// Compare deployed response bytes with the actual files in this checkout.
const {readFile}=require('node:fs/promises');
const {resolve}=require('node:path');
const {createHash}=require('node:crypto');
const root=resolve(__dirname,'..');
const base=process.argv[2]||'https://z-raid.thehawk6353.workers.dev/';
const files=['index.html','styles.css','content.js','stories.js','engine.js','art.js','game.js','assets/title.png','assets/title-loop.gif','assets/favicon.svg'];
const hash=data=>createHash('sha256').update(data).digest('hex');
(async()=>{
  const results=await Promise.all(files.map(async file=>{
    const url=new URL(file==='index.html'?'':file,base);url.searchParams.set('deployment-check',Date.now());
    const response=await fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
    if(!response.ok)return `${file}: HTTP ${response.status}`;
    const [local,live]=await Promise.all([readFile(resolve(root,file)),response.arrayBuffer()]);
    return hash(local)===hash(Buffer.from(live))?null:`${file}: deployed content differs from this checkout`;
  }));
  const failures=results.filter(Boolean);
  if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
  else console.log(`PASS: all ${files.length} runtime files on ${base} match this checkout byte for byte.`);
})().catch(error=>{console.error(error.message);process.exitCode=1;});
