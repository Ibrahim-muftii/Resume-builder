import puppeteer, { Browser } from 'puppeteer';

let browser: Browser | null = null;

export async function getBrowser() {
  if (browser && browser.connected) {
    return browser;
  }

  // Use the standard puppeteer package installed in the project
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  return browser;
}
