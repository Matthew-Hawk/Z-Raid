// Export a static HTML rendering of the existing hero artwork and wordmark.
const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1007-641-0_26.1007.641.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const {resolve}=require('node:path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1,reducedMotion:'reduce'});
    await page.goto(process.argv[2]||'http://localhost:8080');
    await page.setContent(`<link rel="stylesheet" href="styles.css"><style>
      body{display:block;width:1200px;height:630px;padding:0;min-height:0}
      .hero{width:1200px;height:630px}.hero-copy{padding:48px 70px;max-width:1000px}
      .hero h1{font-size:160px;margin:12px 0 24px;white-space:nowrap}
      .hero h2{font-size:28px}.hero p{font-size:18px;margin-top:24px}
      .hero .eyebrow{font-size:13px;letter-spacing:2px}
    </style><body class="motion-off"><section class="hero"><div class="hero-shade"></div>
      <div class="hero-copy"><span class="eyebrow">THREE RAIDS. ONE LIFE.</span>
      <h1>Z<span>-</span>RAID<span>.</span></h1>
      <h2>The dead took the world.<br>Take it back.</h2>
      <p>Pick your survivor. Recover the cure.</p></div>
    </section></body>`);
    await page.evaluate(async()=>{await document.fonts.ready;const image=new Image();image.src='assets/title.png';await image.decode();});
    await page.screenshot({path:resolve(__dirname,'../assets/social-preview.png')});
    console.log('Rendered assets/social-preview.png (1200 × 630)');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
