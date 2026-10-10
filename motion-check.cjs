// Development QA: uses this workstation's bundled Playwright, like browser-check.cjs.
const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1007-641-0_26.1007.641.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const assert=require('assert');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://localhost:8080');await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(800);
  const background=()=>page.locator('.hero').evaluate(e=>getComputedStyle(e).backgroundImage);
  assert((await background()).includes('title-loop.gif'));
  const first=await page.locator('.hero').screenshot();await page.waitForTimeout(750);
  assert(!first.equals(await page.locator('.hero').screenshot()),'The menu should animate');
  await page.locator('.hero .primary').hover();await page.waitForTimeout(200);
  assert.notEqual(await page.locator('.hero .primary').evaluate(e=>getComputedStyle(e).transform),'none');
  await page.screenshot({path:'assets/preview-menu-motion.png'});
  await page.locator('#motion').click();assert((await background()).includes('title.png'));
  assert.equal(await page.locator('#motion').getAttribute('aria-pressed'),'false');
  await page.reload();assert((await background()).includes('title.png'));
  await page.locator('#motion').click();assert((await background()).includes('title-loop.gif'));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('#motion').disabled);
  assert((await background()).includes('title.png'));
  assert(await page.locator('#motion').isDisabled());
  assert.equal(await page.locator('.hero h1').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'assets/preview-menu-mobile.png',fullPage:true});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>!document.body.classList.contains('motion-off'));
  assert((await background()).includes('title-loop.gif'));
  await page.waitForTimeout(350); // Let the narrower toggle label settle the mobile header.
  await page.locator('[data-action="new"]').click();await page.waitForTimeout(500);
  await page.locator('[data-id="rook"]').click();assert(await page.locator('[data-action="raid"]').isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS: animated GIF menu, visible motion, hover movement, motion toggle, persisted preference, reduced-motion still image, mobile overflow, game start, no JavaScript errors.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
