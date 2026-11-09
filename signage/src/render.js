// node render.js in.svg out.png width height — растеризация SVG (прозрачный фон) через Chromium
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, inp, out, w, h] = process.argv;
  const svg = fs.readFileSync(inp, 'utf8').replace(/ width="[\d.]+" height="[\d.]+"/, ` width="${w}" height="${h}"`);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await p.screenshot({ path: out, omitBackground: true });
  await b.close();
})();
