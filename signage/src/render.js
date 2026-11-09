// node render.js in.svg out.png width  — растеризация SVG через Chromium
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, inp, out, w] = process.argv;
  const svg = fs.readFileSync(inp, 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: Math.round(+w / 2) }, deviceScaleFactor: 1 });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/width="\d+" height="\d+"/, `width="${w}" height="${Math.round(+w/2)}"`)}</body></html>`);
  await p.screenshot({ path: out, omitBackground: true });
  await b.close();
})();
