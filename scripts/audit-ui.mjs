import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
const base=process.env.AUDIT_URL || 'http://127.0.0.1:4173';
const urls=[...((await fs.readFile('dist/sitemap.xml','utf8')).matchAll(/<loc>([^<]+)<\/loc>/g))].map(m=>new URL(m[1]).pathname);
const browser=await puppeteer.launch({headless:true,args:['--no-sandbox']});
const results=[];await fs.mkdir('docs/audit/screenshots',{recursive:true});
for(const width of [375,768,1024,1440]) {
 for(const route of urls) {
  const page=await browser.newPage();await page.setViewport({width,height:900});
  const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
  await page.goto(base+route,{waitUntil:'networkidle2'});
  const metrics=await page.evaluate(()=>({title:document.title,h1:document.querySelectorAll('main h1').length,overflow:document.documentElement.scrollWidth>innerWidth+2,overflowNodes:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left < -2)&&getComputedStyle(e).position!=='absolute'&&!e.closest('svg,.location-map-canvas,[aria-hidden="true"]')}).slice(0,5).map(e=>({tag:e.tagName,cls:e.className})),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.currentSrc).map(i=>i.currentSrc),canonical:document.querySelector('link[rel=canonical]')?.href}));
  results.push({width,route,...metrics,errors});
  if(process.env.AUDIT_SCREENSHOTS && [375,1440].includes(width)&&['/','/vi-tri','/mat-bang','/faq'].includes(route))await page.screenshot({path:`docs/audit/screenshots/${route.replaceAll('/','_')||'home'}-${width}.png`});
  page.off('pageerror',handler); await page.close();
  await fs.writeFile('docs/audit/ui-results.json',JSON.stringify(results,null,2));
 }
 console.log('checked',width,urls.length);
}
await fs.writeFile('docs/audit/ui-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.filter(r=>r.overflow||r.h1!==1||r.errors.length||r.brokenImages.length)));
await browser.close();
if(results.some(r=>r.overflow||r.h1!==1||r.errors.length||r.brokenImages.length))process.exitCode=1;
