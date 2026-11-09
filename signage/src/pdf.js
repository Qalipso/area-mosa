// node pdf.js in.svg out.pdf widthMM heightMM — векторный PDF (1 страница = артборд)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, inp, out, w, h] = process.argv;
  const svg = fs.readFileSync(inp, 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent(`<html><head><style>@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svg}</body></html>`);
  await p.pdf({ path: out, width: `${w}mm`, height: `${h}mm`, printBackground: true, margin: {top:0,right:0,bottom:0,left:0}, pageRanges: '1' });
  await b.close();
})();
