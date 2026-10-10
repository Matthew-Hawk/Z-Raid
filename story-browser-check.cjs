// Exhaust every authored passage on the minimum supported screen and desktop.
const {chromium}=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1007-641-0_26.1007.641.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');
const assert=require('assert');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});let checks=0;
  for(const viewport of [{width:375,height:667},{width:1366,height:768}]){
    const page=await browser.newPage({viewport,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
    // Remove time from this content/layout test; viewport-check covers debounce.
    await page.addInitScript(()=>{let time=1000;performance.now=()=>time+=1000;});
    await page.goto('http://localhost:8080');await page.evaluate(()=>document.fonts.ready);
    await page.locator('[data-action="new"]').click();await page.locator('[data-action="choose-character"]').click();await page.locator('[data-step="3"]').click();
    await page.evaluate(()=>{const start=ZRules.startRaid;ZRules.startRaid=s=>{window.qaState=s;return start(s,()=>0);};const resolve=ZRules.resolve;ZRules.resolve=(s,a)=>resolve(s,a,()=>window.qaSuccess?0:.99999);});
    await page.locator('[data-action="raid"]').click();
    const results=await page.evaluate(()=>{
      const issues=[];let checked=0,caseIndex=0;
      const dispatch=attrs=>{const b=document.createElement('button');for(const [k,v] of Object.entries(attrs))b.dataset[k]=v;document.querySelector('#app').appendChild(b);b.click();b.remove();};
      const fit=tag=>{
        if(document.documentElement.scrollHeight>innerHeight+1)issues.push(`${tag}: document scrolls`);
        for(const e of document.querySelectorAll('#app button,#app p,#app h1,#app h2,#app b,#app .eyebrow')){
          const r=e.getBoundingClientRect();if(!r.width||!r.height)continue;
          if(r.top<0||r.bottom>innerHeight+1||r.left<0||r.right>innerWidth+1)issues.push(`${tag}: outside viewport ${e.textContent}`);
        }
        for(const e of document.querySelectorAll('.screen,.raid-body,.outcome,.result-panel'))if(e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2)issues.push(`${tag}: panel overflow`);
        if(/undefined|NaN|\d+%/.test(document.querySelector('#app').innerText))issues.push(`${tag}: invalid text or hidden odds`);
        checked++;
      };
      for(const location of ZContent.locations)for(const arc of location.storylines)for(let index=0;index<5;index++)for(const answer of ['yes','no'])for(const success of [true,false])for(const character of ZContent.characters){
        const s=window.qaState;Object.assign(s,{character:character.id,location:location.id,storyline:arc,encounters:arc.encounters,index,phase:'raid',weapon:ZContent.weapons[caseIndex%4].id,gear:ZContent.gear[Math.floor(caseIndex/4)%4].id,tier:caseIndex%3,completed:caseIndex%3,hp:character.health,supplies:0,pressure:[0,3,7][caseIndex%3]});window.qaSuccess=success;
        dispatch({action:answer});const tag=`${character.id}/${arc.id}/${index}/${answer}/${success}`;
        if(!document.querySelector('.story-copy').textContent.includes(arc.encounters[index][answer].story[success?'success':'failure']))issues.push(`${tag}: wrong passage`);
        fit(tag);dispatch({story:'1'});fit(`${tag}/context`);caseIndex++;
        if(!success){s.phase='raid';s.hp=1;dispatch({action:answer});fit(`${tag}/fatal`);dispatch({story:'1'});fit(`${tag}/fatal-context`);if(!document.querySelector('.story-copy').textContent.includes('fatal'))issues.push(`${tag}: missing fatal context`);}
      }
      for(const l of ZContent.locations)for(const arc of l.storylines)for(const phase of ['summary','victory']){
        Object.assign(window.qaState,{phase,storyline:arc,completed:phase==='summary'?2:3,recovery:12,usedSupplies:6});dispatch({action:'qa-render'});fit(`${arc.id}/${phase}`);
        if(!document.querySelector('#app').textContent.includes(arc.ending))issues.push(`${arc.id}: missing conclusion`);
      }
      const arc=ZContent.locations.find(l=>l.id==='metro').storylines[1];Object.assign(window.qaState,{phase:'raid',location:'metro',storyline:arc,encounters:arc.encounters,index:0,character:'rook',weapon:'bat',gear:'vest',hp:100,completed:0,tier:0,supplies:0,pressure:3});window.qaSuccess=false;dispatch({action:'yes'});fit('Rook stealth example');
      return {issues,checked};
    });
    assert.deepEqual(results.issues,[]);assert.deepEqual(errors,[]);checks+=results.checked;
    await page.screenshot({path:viewport.width===375?'assets/preview-story-mobile.png':'assets/preview-story-desktop.png'});
    console.log(`PASS: ${viewport.width}x${viewport.height}, ${results.checked} narrative screens`);await page.close();
  }
  await browser.close();console.log(`PASS: ${checks} story/outcome/context/fatal screens, all six arcs and survivors, varied gear and pursuit; no scrolling, clipping or hidden odds.`);
})().catch(e=>{console.error(e);process.exit(1);});
