import { NextResponse, type NextRequest } from 'next/server';
import puppeteer from 'puppeteer';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const { resumeId } = await params;
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get('preview') === 'true';
    
    const cookieStore = await cookies();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify ownership
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('id, title, settings, template_id')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !resume) {
      return new NextResponse('Resume not found', { status: 404 });
    }

    // Parse settings if it's a JSON string
    let settings = resume.settings || {};
    if (typeof settings === 'string') {
      try {
        settings = JSON.parse(settings);
      } catch (e) {
        settings = {};
      }
    }

    // Merge resume object with parsed settings for easier access
    const fullResume = { ...resume, settings };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const exportUrl = `${baseUrl}/resume/${resumeId}/export`;

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const allCookies = cookieStore.getAll().map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: new URL(baseUrl).hostname,
      path: '/',
      httpOnly: true,
      secure: baseUrl.startsWith('https'),
      sameSite: 'Lax' as const
    }));

    await page.setCookie(...allCookies);

    // Set viewport to exact A4 width at 96 DPI
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    await page.goto(exportUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // CRITICAL: Wait for ALL fonts to be loaded before any pagination or printing
    await page.evaluateHandle('document.fonts.ready');

    const debugInfo = await page.evaluate((settings) => {
      const FULL_PAGE = 1123;
      const PAGE_MARGIN_TOP = 72; // Professional 0.75in margin
      const PAGE_MARGIN_BOTTOM = 72;
      const PRINTABLE_HEIGHT = FULL_PAGE; 
      const SAFETY_ZONE = 120; 

      // Remove any previously injected spacers
      document.querySelectorAll('.pdf-page-spacer').forEach(s => s.remove());

      const rawItems = Array.from(document.querySelectorAll(
        '[data-resume-item], [data-resume-section]'
      ));
      const uniqueItems = [...new Set(rawItems)] as HTMLElement[];
      const debugLog: string[] = [];

      // Ensure the container has enough padding for the first page
      const container = document.getElementById('resume-container');
      if (container) {
        container.style.paddingTop = `${PAGE_MARGIN_TOP}px`;
        container.style.paddingBottom = `${PAGE_MARGIN_BOTTOM}px`;
      }

      for (let pass = 0; pass < 30; pass++) {
        let pushed = false;

        for (let i = 0; i < uniqueItems.length; i++) {
          const el = uniqueItems[i];
          const rect = el.getBoundingClientRect();
          
          // Position relative to the very top of the document
          const top = rect.top + window.scrollY;
          const bottom = rect.bottom + window.scrollY;

          const currentPage = Math.floor(top / FULL_PAGE);
          const pageBottomLimit = (currentPage + 1) * FULL_PAGE - PAGE_MARGIN_BOTTOM;
          const pageTopLimit = currentPage * FULL_PAGE + PAGE_MARGIN_TOP;

          let shouldPush = false;

          // 1. Split Prevention: Does this item cross the bottom margin?
          if (bottom > pageBottomLimit) {
            // Only push if it's NOT already at the very top of the page 
            // (to avoid infinite loops on items larger than a page)
            if (top > pageTopLimit + 20) {
                shouldPush = true;
            }
          }

          // 2. Orphan Prevention: Heading on Page N, Content on Page N+1
          if (!shouldPush && i < uniqueItems.length - 1) {
            const isHeading = el.hasAttribute('data-resume-section');
            if (isHeading) {
              const nextEl = uniqueItems[i+1];
              const nextRect = nextEl.getBoundingClientRect();
              const nextTop = nextRect.top + window.scrollY;
              
              const nextPage = Math.floor(nextTop / FULL_PAGE);
              if (nextPage > currentPage) {
                shouldPush = true;
              } else if (nextRect.bottom + window.scrollY > pageBottomLimit) {
                // If the next item is GOING to be pushed, push the heading now
                shouldPush = true;
              }
            }
          }

          if (shouldPush) {
            const nextPageStart = (currentPage + 1) * FULL_PAGE;
            const spacerHeight = nextPageStart - top + PAGE_MARGIN_TOP;

            if (spacerHeight > 0) {
              const spacer = document.createElement('div');
              spacer.className = 'pdf-page-spacer';
              spacer.style.height = `${spacerHeight}px`;
              spacer.style.width = '100%';
              spacer.style.display = 'block';
              el.parentNode?.insertBefore(spacer, el);
              
              pushed = true;
              break; // Restart loop to account for layout shift
            }
          }
        }
        if (!pushed) break;
      }

      return debugLog;
    }, fullResume.settings);

    console.log('[PDF Pagination Debug]', debugInfo);

    // Aggressive font-face injection for embedding
    await page.addStyleTag({
      content: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&family=Lato:wght@400;500;600;700;800;900&family=Raleway:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: inherit;
        }

        body, html, #resume-container, [data-resume-item], h1, h2, h3, p, span, li {
          font-family: "${fullResume.settings?.fontFamily || 'Inter'}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        @media print {
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `
    });

    // Final paint wait
    await new Promise(r => setTimeout(r, 1500));

    // Generate PDF
    const pdf = await page.pdf({
      width: '794px',
      height: '1123px',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
    });

    await browser.close();

    const filename = `${resume.title.replace(/\s+/g, '_')}_Resume.pdf`;

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': isPreview ? 'inline' : `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
