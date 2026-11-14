/** Audit the actual prerendered HTML, based on Qtopia's publication checklist. */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { loadEnv } from 'vite';
const buildOrigin = loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL;
if (!process.env.VITE_SITE_URL && buildOrigin) process.env.VITE_SITE_URL = buildOrigin;
const { SITE_URL } = await import('../src/lib/seo.js');
const dist=resolve(process.env.DIST_DIR||'dist');
const xml=readFileSync(join(dist,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
let errors=0, warnings=0;
const fail=(p,m)=>{errors++;console.error(`ERROR ${p}: ${m}`)};
const warn=(p,m)=>{warnings++;console.warn(`WARN ${p}: ${m}`)};
const attr=(tag,name)=>tag?.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] || '';
const clean=s=>(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const rows=[]; const titles=new Set(); const descriptions=new Set();
if(!urls.length) fail('sitemap','No URLs');
for(const url of urls) {
  const parsed=new URL(url);const route=parsed.pathname;
  if(parsed.origin!==SITE_URL) fail(route,'wrong sitemap origin');
  const file=join(dist,route==='/'?'index.html':`${route.slice(1)}/index.html`);
  if(!existsSync(file)){fail(route,'missing prerendered HTML');continue;}
  const html=readFileSync(file,'utf8');const body=html.slice(html.indexOf('<body'));
  const meta=(key)=>attr([...html.matchAll(/<meta\b[^>]*>/g)].map(m=>m[0]).find(t=>attr(t,'name')===key||attr(t,'property')===key),'content');
  const title=clean(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]);const description=meta('description');
  const canonical=attr([...html.matchAll(/<link\b[^>]*>/g)].map(m=>m[0]).find(t=>attr(t,'rel')==='canonical'),'href');
  if(!title||titles.has(title))fail(route,'missing/duplicate title');titles.add(title);
  if(!description||descriptions.has(description))fail(route,'missing/duplicate description');descriptions.add(description);
  if(title.length>60)warn(route,`title ${title.length} characters`);
  if(description.length<120||description.length>160)warn(route,`description ${description.length} characters`);
  if(canonical!==url)fail(route,`canonical ${canonical} != ${url}`);
  if(/noindex/.test(meta('robots')))fail(route,'noindex URL in sitemap');
  if((body.match(/<h1[\s>]/g)||[]).length!==1)fail(route,'must have exactly one H1');
  if(meta('og:url')!==canonical)fail(route,'og:url mismatch');
  for(const key of ['og:title','og:description','og:image','og:type','twitter:card'])if(!meta(key))fail(route,`missing ${key}`);
  if(!/^https?:\/\//.test(meta('og:image')))fail(route,'og:image must be absolute');
  if(/lorem ipsum|placehold\.co/i.test(body))fail(route,'placeholder content');
  const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if(!schemas.length)fail(route,'missing JSON-LD');
  for(const [,raw] of schemas){try {const data=JSON.parse(raw);for(const node of data['@graph']||[data])if(node['@type']==='FAQPage')for(const q of node.mainEntity||[]){if(!clean(body).includes(q.name)||!clean(body).includes(q.acceptedAnswer.text))fail(route,'FAQ differs from visible content');}}catch{fail(route,'invalid JSON-LD');}}
  let missingSize=0;
  for(const [tag] of body.matchAll(/<img\b[^>]*>/g)){if(!/\salt=/.test(tag))fail(route,'image missing alt');if(!attr(tag,'width')||!attr(tag,'height'))missingSize++;}
  if(missingSize)warn(route,`${missingSize} images without intrinsic dimensions`);
  rows.push({route,title,description,h1:clean(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]),canonical,image:meta('og:image')});
}
for(const route of ['404.html','cam-on/index.html']) {
 const file=join(dist,route);
 if(!existsSync(file)||!readFileSync(file,'utf8').includes('noindex'))fail(route,'missing noindex document');
}
if(!readFileSync(join(dist,'robots.txt'),'utf8').includes(`Sitemap: ${SITE_URL}/sitemap.xml`))fail('robots','Sitemap mismatch');
mkdirSync('docs/audit',{recursive:true});
writeFileSync('docs/audit/seo-results.json',JSON.stringify({errors,warnings,pages:rows},null,2));
console.log(`SEO: ${urls.length} URLs, ${errors} errors, ${warnings} warnings`);
if(errors)process.exitCode=1;
