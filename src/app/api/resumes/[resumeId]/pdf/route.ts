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

    // CRITICAL: Pre-pagination script — physically move items that cross page boundaries
    const debugInfo = await page.evaluate((settings) => {
      const FULL_PAGE = 1123;
      const PAGE_MARGIN_TOP = 20;
      const PAGE_MARGIN_BOTTOM = 20;
      const SAFETY_BUFFER = 5;
      const PRINTABLE_HEIGHT = FULL_PAGE - PAGE_MARGIN_TOP - PAGE_MARGIN_BOTTOM;

      // Remove any previously injected spacers
      document.querySelectorAll('.pdf-page-spacer').forEach(s => s.remove());

      // Broad selectors to find all possible resume items AND section headings
      const rawItems = Array.from(document.querySelectorAll(
        '[data-resume-item], [data-resume-section], .space-y-0 > div, .space-y-1 > div, .space-y-2 > div, .space-y-3 > div, .space-y-4 > div, .space-y-5 > div, .space-y-6 > div, article'
      ));
      const uniqueItems = [...new Set(rawItems)] as HTMLElement[];
      const debugLog: string[] = [];
      debugLog.push(`Found ${uniqueItems.length} resume items`);

      // Multi-pass: push ONE item per pass, then re-scan
      for (let pass = 0; pass < 20; pass++) {
        let pushed = false;

        for (let i = 0; i < uniqueItems.length; i++) {
          const el = uniqueItems[i];
          const rect = el.getBoundingClientRect();
          const top = rect.top;
          const bottom = rect.bottom;

          const pageIndex = Math.floor(top / PRINTABLE_HEIGHT);
          const pageBottomBoundary = (pageIndex + 1) * PRINTABLE_HEIGHT - SAFETY_BUFFER;

          let shouldPush = false;

          // FIX: Catch items that EXTEND past the boundary (not just straddling)
          if (bottom > pageBottomBoundary) {
            shouldPush = true;
          }

          // Orphan heading: heading on page N, next item on page N+1
          if (!shouldPush && i < uniqueItems.length - 1 && el.hasAttribute('data-resume-section')) {
            const nextTop = uniqueItems[i + 1].getBoundingClientRect().top;
            if (Math.floor(nextTop / PRINTABLE_HEIGHT) > pageIndex) {
              shouldPush = true;
            }
          }

          if (shouldPush) {
            const nextPageStart = (pageIndex + 1) * PRINTABLE_HEIGHT;
            const spacerHeight = nextPageStart - top;

            if (spacerHeight > 0) {
              debugLog.push(`Pass ${pass}: Pushing item at top=${Math.round(top)} bottom=${Math.round(bottom)} to next page (spacer=${Math.round(spacerHeight)}px)`);

              // If orphan heading push, remove spacers before subsequent items
              if (el.hasAttribute('data-resume-section')) {
                for (let j = i + 1; j < uniqueItems.length; j++) {
                  if (uniqueItems[j].hasAttribute('data-resume-section')) break;
                  const prev = uniqueItems[j].previousElementSibling;
                  if (prev && prev.classList.contains('pdf-page-spacer')) {
                    prev.remove();
                  }
                }
              }

              const spacer = document.createElement('div');
              spacer.className = 'pdf-page-spacer';
              spacer.style.height = `${spacerHeight}px`;
              spacer.style.width = '100%';
              spacer.style.display = 'block';
              spacer.style.flexShrink = '0';
              el.parentNode?.insertBefore(spacer, el);

              // Apply direct styles to the container
              const container = document.getElementById('resume-container');
              if (container) {
                container.style.fontFamily = `'${settings?.fontFamily || 'Inter'}', sans-serif`;
                container.style.backgroundColor = settings?.backgroundColor || 'white';
                container.style.fontSize = '16px';
              }

              pushed = true;
              break; // Re-scan from beginning
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
      margin: { top: '20px', bottom: '20px' },
    });

    await browser.close();

    const filename = `${resume.title.replace(/\s+/g, '_')}_Resume.pdf`;

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
