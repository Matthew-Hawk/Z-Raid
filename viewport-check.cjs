// QA checks real element bounds and panel overflow, not just hidden scrollbars.
const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1007-641-0_26.1007.641.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const assert=require('assert');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  let checks=0;
  const sizes=[{width:375,height:667},{width:390,height:844},{width:768,height:1024},{width:1366,height:768},{width:1440,height:900}];
  for(const viewport of sizes.filter(v=>!process.argv[2]||v.width===Number(process.argv[2]))){
    const page=await browser.newPage({viewport,reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    await page.goto('http://localhost:8080');await page.evaluate(()=>document.fonts.ready);
    async function fit(name){
      const issues=await page.evaluate(()=>{
        const problems=[];
        if(document.documentElement.scrollHeight>innerHeight+1||document.documentElement.scrollWidth>innerWidth+1)problems.push('Document scrolls');
        const modal=document.querySelector('dialog[open]');
        const root=modal||document.querySelector('#app');
        for(const e of root.querySelectorAll('button,p,h1,h2,b,small,meter,.eyebrow,.tags')){
          const r=e.getBoundingClientRect();if(!r.width||!r.height||getComputedStyle(e).display==='none')continue;
          if(r.top<-.5||r.bottom>innerHeight+.5||r.left<-.5||r.right>innerWidth+.5)problems.push(`${e.tagName} outside screen: ${e.textContent.slice(0,55)} (${Math.round(r.top)}..${Math.round(r.bottom)})`);
        }
      for(const e of root.querySelectorAll('.screen,.selection-layout,.selected-detail,.raid-body,.decision,.result-panel'))if(e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2)problems.push(`${e.className} has clipped/overflowing content: ${e.scrollHeight}/${e.clientHeight}`);
        if(modal&&modal.scrollHeight>modal.clientHeight+1)problems.push('Instructions scroll');
        return problems;
      });
      assert.deepEqual(issues,[],`${viewport.width}x${viewport.height} ${name}`);checks++;
    }
    const click=async(selector)=>{await page.waitForTimeout(290);await page.locator(selector).click();};
    await fit('title');
    if(viewport.width===375)await page.screenshot({path:'assets/preview-menu-mobile.png'});
    if(viewport.width===1440)await page.screenshot({path:'assets/preview-menu-motion.png'});
    await click('#help');for(let i=0;i<6;i++){await fit(`manual ${i+1}`);if(i<5)await click('#manual-next');}await page.keyboard.press('Escape');
    await click('[data-action="new"]');
    for(const id of ['rook','echo','patch']){await click(`[data-id="${id}"]`);await fit(`survivor ${id}`);}
    await click('[data-action="choose-character"]');
    // Browser run uses deterministic success to visit every state without luck.
    await page.evaluate(()=>{const start=ZRules.startRaid;ZRules.startRaid=s=>{window.qaState=s;return start(s,()=>window.qaSlice?.99999:0);};const resolve=ZRules.resolve;ZRules.resolve=(s,a)=>resolve(s,a,()=>window.qaFail?.99999:0);});
    for(let raid=0;raid<(viewport.width===375?6:3);raid++){
      if(raid===3){await click('[data-action="new"]');await click('[data-action="choose-character"]');}
      else if(raid)await click('[data-action="prepare"]');
      for(const id of ['pharmacy','metro','checkpoint']){await click(`[data-id="${id}"]`);await fit(`location ${id}`);}
      await click(`[data-id="${['pharmacy','metro','checkpoint'][raid%3]}"]`);
      await click('[data-action="prep-next"]');
      for(const id of ['bat','bow','pistol','knife']){await click(`[data-id="${id}"]`);await fit(`weapon ${id}`);}
      await click('[data-action="prep-next"]');
      for(const id of ['vest','boots','kit','pack']){await click(`[data-id="${id}"]`);await fit(`gear ${id}`);}
      await click('[data-action="prep-next"]');await fit('loadout review');
      await click('[data-action="prep-back"]');assert(await page.locator('[data-id="pack"][aria-pressed="true"]').isVisible());await click('[data-action="prep-next"]');
      if(viewport.width===375&&raid===0)await page.screenshot({path:'assets/preview-mobile.png'});
      await page.evaluate(r=>window.qaSlice=r>=3?5:0,raid);
      await click('[data-action="raid"]');
      for(let i=0;i<5;i++){
        await fit(`raid ${raid+1} encounter ${i+1}`);
        if(raid===0&&i===0){
          const before=await page.locator('#app').innerText();
          await page.setViewportSize(viewport.width===375?{width:1366,height:768}:{width:375,height:667});
          await fit('live resize');assert.equal(await page.locator('#app').innerText(),before);
          await page.setViewportSize(viewport);await fit('resize restored');
        }
        assert(!(await page.locator('.decision-grid').innerText()).includes('%'));
        const artworkAndStats=await page.evaluate(()=>{
          const s=window.qaState,e=s.encounters[s.index],c=ZRules.item('characters',s.character);
          const statsCorrect=['yes','no'].every(answer=>{
            const stat=e[answer].stat,expected=c[stat]+ZRules.bonuses(s,stat);
            const badge=document.querySelector(`[data-action="${answer}"] .decision-stat`);
            return badge?.classList.contains(stat)&&Number(badge.querySelector('span').textContent)===expected;
          });
          const scene=document.querySelector('.encounter-scene'),body=document.querySelector('.encounter-description'),decisions=document.querySelector('.decision-grid');
          const style=scene&&getComputedStyle(scene);
          return statsCorrect&&Number(scene?.dataset.scene)===e.scene&&scene?.dataset.location===s.location&&style.opacity==='0.7'&&style.maskImage!=='none'&&Math.abs(scene.getBoundingClientRect().height-body.clientHeight)<2&&scene.getBoundingClientRect().bottom<=decisions.getBoundingClientRect().top;
        });
        assert(artworkAndStats,'Decision stats must match the actual check and artwork must match the current encounter');
        if(viewport.width===375&&raid===0&&i===0)await page.screenshot({path:'assets/preview-mobile-raid.png'});
        if(viewport.width===1440&&raid===0&&i===0)await page.screenshot({path:'assets/preview-raid.png'});
        await click(`[data-action="${i%2?'no':'yes'}"]`);await fit('outcome');await click('[data-story="1"]');await fit('gear and pursuit');await click('[data-story="0"]');
        await page.evaluate(()=>document.querySelector('[data-action="next"]').click());assert(await page.locator('[data-action="next"]').isVisible());
        await click('[data-action="next"]');
      }
      await fit(raid%3===2?'victory':'raid summary');
    }
    assert(await page.getByText('✓ Cure assembled',{exact:true}).isVisible());
    await click('[data-action="new"]');await click('[data-action="choose-character"]');await click('[data-step="3"]');await page.evaluate(()=>window.qaFail=true);await click('[data-action="raid"]');
    for(let i=0;i<5&&await page.locator('[data-action="yes"]').count();i++){await click('[data-action="yes"]');await fit('injury or death');if(await page.locator('[data-action="next"]').count())await click('[data-action="next"]');}
    assert(await page.getByText('The dark won this time.').isVisible());await fit('death');
    await click('[data-action="new"]');await fit('fresh run');
    assert.deepEqual(errors,[]);console.log(`PASS: ${viewport.width}x${viewport.height}`);await page.close();
  }
  console.log(`PASS: ${checks} viewport checks: title, all selections and tiers, review/back, manual pages, raid choices, results, summary, death, reset and victory; no scrolling, clipping, hidden odds or JavaScript errors at SE 375x667 through desktop.`);
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
