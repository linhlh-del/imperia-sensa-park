import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.env.DIST_DIR||'dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let relative=pathname.replace(/^\/+/, '');
    if(pathname==='/tinh-tra-gop'){res.writeHead(308,{Location:'/bang-gia'});return res.end();}
    if(['/lien-he','/chinh-sach-ban-hang'].includes(pathname))relative='index.html';
    let file=path.resolve(root,relative||'index.html');
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
    let status=200;
    try { if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html'); await fs.access(file); }
    catch { status=404;file=path.join(root,'404.html'); }
    res.writeHead(status,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(await fs.readFile(file));
  }catch{res.writeHead(500);res.end('Server error');}
});
server.listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log('Static audit server: http://127.0.0.1:'+(process.env.PORT||4174)));
