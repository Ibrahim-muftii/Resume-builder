import { NextResponse, type NextRequest } from 'next/server';
import { getBrowser } from '@/lib/puppeteer';
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

    let settings = resume.settings || {};
    if (typeof settings === 'string') {
      try { settings = JSON.parse(settings); } catch (e) { settings = {}; }
    }

    const fullResume = { ...resume, settings };
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const exportUrl = `${baseUrl}/resume/${resumeId}/export`;

    // Use Warm Browser Singleton
    const browser = await getBrowser();
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
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Navigate to the export page which ALREADY handles its own pagination
    await page.goto(exportUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for the embedded pagination script to finish
    await page.waitForFunction(() => document.readyState === 'complete');
    
    // Final check for fonts and layout stability
    await page.evaluate(async () => {
        await document.fonts.ready;
    });

    // Aggressive font-face injection for final PDF embedding
    await page.addStyleTag({
      content: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800;900&display=swap');
        
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

    // Wait for any last-minute layout shifts
    await new Promise(r => setTimeout(r, 1000));

    // Generate PDF
    const pdf = await page.pdf({
      width: '794px',
      height: '1123px',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
    });

    await page.close();

    const filename = `${resume.title.replace(/\s+/g, '_')}_Resume.pdf`;

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Disposition': isPreview ? 'inline' : `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
