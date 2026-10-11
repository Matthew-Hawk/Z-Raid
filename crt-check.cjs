// Verify CRT visibility, unchanged text geometry, small-text styling and controls.
const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1007-641-0_26.1007.641.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const assert=require('assert');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    for(const width of [375,1440]){
      const page=await browser.newPage({viewport:{width,height:width===375?667:900},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',e=>errors.push(String(e)));
      await page.goto('http://localhost:8080');await page.evaluate(()=>document.fonts.ready);
      const click=async selector=>{await page.waitForTimeout(310);await page.locator(selector).click();};
      await click('[data-action="new"]');await click('[data-action="choose-character"]');await click('[data-step="3"]');await click('[data-action="raid"]');
      const textStyle=()=>page.evaluate(()=>Array.from(document.querySelectorAll('.decision small,.pursuit,.decision-stat,.odds-note,.hud b,footer')).map(e=>{
        const s=getComputedStyle(e),r=e.getBoundingClientRect();return {text:e.textContent,font:s.fontSize,line:s.lineHeight,filter:s.filter,transform:s.transform,width:r.width,height:r.height};
      }));
      const before=await textStyle(),off=await page.screenshot();
      await click('#crt');assert.equal(await page.locator('#crt').getAttribute('aria-pressed'),'true');
      assert.deepEqual(await textStyle(),before,'CRT must not blur, shrink or move small text');
      const effect=await page.evaluate(()=>{
        const a=getComputedStyle(document.body,'::after'),b=getComputedStyle(document.body,'::before');
        return a.display!=='none'&&a.backgroundImage.includes('repeating-linear-gradient')&&b.backgroundImage.includes('radial-gradient')&&a.pointerEvents==='none'&&a.animationName==='none';
      });assert(effect,'CRT must be visible and static even with reduced motion');
      const on=await page.screenshot({path:`assets/preview-crt-${width}.png`});assert(!off.equals(on),'CRT must visibly change rendering');
      assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight&&document.documentElement.scrollWidth<=innerWidth));
      await click('#help');assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');
      await click('#crt');assert.equal(await page.locator('#crt').getAttribute('aria-pressed'),'false');assert.deepEqual(await textStyle(),before);
      await page.emulateMedia({reducedMotion:'no-preference'});await click('#crt');assert(await page.evaluate(()=>getComputedStyle(document.body,'::after').animationName==='none'));
      await click('[data-action="yes"]');assert(await page.locator('[data-action="next"]').isVisible());assert.deepEqual(errors,[]);
      console.log(`PASS: CRT ${width}px: visible texture, unchanged small text, no scrolling, reduced motion, toggle, help and decision input`);await page.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
