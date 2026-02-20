import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'manual-screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { name: 'sms', path: '/sms' },
  { name: 'whatsapp', path: '/whatsapp' },
  { name: 'rcs', path: '/rcs' },
  { name: 'voice', path: '/voice-api' },
  { name: 'video', path: '/video-api' },
  { name: 'email', path: '/email' },
  { name: 'sip-trunk', path: '/sip-trunk' },
  { name: 'did', path: '/did' }
];

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Taking configuration screenshots...');

  for (const route of routes) {
    console.log(`Processing ${route.name}...`);
    
    // Inject auth state before navigation
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('cpaas_user', JSON.stringify({
        id: 'admin@cpaas.com', aud: 'authenticated', role: 'authenticated', email: 'admin@cpaas.com',
        app_metadata: { role: 'admin' }, user_metadata: { full_name: 'Admin User' }
      }));
      localStorage.setItem('cpaas_profile', JSON.stringify({
        id: 'admin@cpaas.com', email: 'admin@cpaas.com', full_name: 'Admin User', role: 'admin', balance: 1000
      }));
    });

    await page.goto(`http://localhost:9999${route.path}`, { waitUntil: 'networkidle0' });
    
    // Give it a tiny bit of extra time to render charts/effects cleanly
    await new Promise(r => setTimeout(r, 1500));
    
    // Take screenshot of main content area, ignoring sidebar if we want.
    // For manual, full page is fine. 
    await page.screenshot({ path: path.join(outDir, `${route.name}.png`), fullPage: false });
    console.log(`Saved ${route.name}.png`);
  }

  await browser.close();
  console.log('All screenshots captured.');
}

run().catch(console.error);
