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
      .select('id, title')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !resume) {
      return new NextResponse('Resume not found', { status: 404 });
    }

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

    // CRITICAL: Pre-pagination script — physically move items that cross page boundaries
    // The export page has @page { margin: 20px 0 }, so the print engine adds 20px 
    // top/bottom on every page. The effective printable height per page is 1083px.
    const debugInfo = await page.evaluate(() => {
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
              pushed = true;
              break; // Re-scan from beginning
            }
          }
        }
        if (!pushed) break;
      }

      return debugLog;
    });

    console.log('[PDF Pagination Debug]', debugInfo);

    // Print color fix
    await page.addStyleTag({
      content: `
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `
    });

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
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
