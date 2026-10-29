/* Run with node tests/guide.test.cjs. Set PLAYWRIGHT_MODULE_PATH if needed. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modulePath = process.env.PLAYWRIGHT_MODULE_PATH || 'playwright';
const {chromium} = require(modulePath);
const browserPath = process.env.BRAVE_EXECUTABLE || 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const output = path.resolve('.qa');
fs.mkdirSync(output,{recursive:true});
const url = pathToFileURL(path.resolve('index.html')).href;
const results = [];
async function check(name,fn){await fn(); results.push(name); console.log('PASS '+name);}
(async () => {
 fs.mkdirSync(path.join(output,'downloads'),{recursive:true});
 const browser = await chromium.launch({executablePath:browserPath,headless:true,downloadsPath:path.join(output,'downloads')});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
  const page = await context.newPage();
  const errors = [], requests = [];
  page.on('pageerror',error => errors.push(error.message));
  page.on('request',request => {if (/^https?:/.test(request.url())) requests.push(request.url());});
  await page.goto(url);
  await check('Offline file opens with one chapter and complete navigation', async()=>{
   assert.equal(await page.locator('.chapter').count(),11);
   assert.equal(await page.locator('.chapter:visible').count(),1);
   assert.equal(await page.locator('.chapter-nav a').count(),11);
   assert(await page.locator('#welcome').isVisible());
  });
  await page.screenshot({path:path.join(output,'desktop-welcome.png'),fullPage:true});
  await check('Chapter navigation, history, and direct links',async()=>{
   await page.locator('.chapter-nav a[href="#anatomy"]').click();
   assert(await page.locator('#anatomy').isVisible());
   assert.equal(await page.locator('.chapter:visible').count(),1);
   await page.locator('#next').click(); assert(await page.locator('#copilot').isVisible());
   await page.goBack(); assert(await page.locator('#anatomy').isVisible());
   await page.reload(); assert(await page.locator('#anatomy').isVisible());
  });
  await check('Anatomy reveals the requested component',async()=>{
   await page.locator('[data-panel="scripts"]').click();
   assert(await page.locator('[data-view="scripts"]').isVisible());
   assert(!(await page.locator('[data-view="entry"]').isVisible()));
  });
  await page.screenshot({path:path.join(output,'desktop-anatomy.png'),fullPage:true});
  await check('Progress and checklists persist across reload',async()=>{
   await page.locator('#anatomy .complete-button').click();
   assert.match(await page.locator('#progress-text').textContent(),/1 of 10/);
   await page.locator('.chapter-nav a[href="#workshop"]').click();
   await page.locator('#lab-created').check();
   await page.reload(); assert(await page.locator('#lab-created').isChecked());
   assert.match(await page.locator('#progress-text').textContent(),/1 of 10/);
  });
  await check('Download is the complete Markdown skill, not HTML',async()=>{
   const pending = page.waitForEvent('download');
   await page.locator('#download-skill').click();
   const download = await pending; assert.equal(download.suggestedFilename(),'SKILL.md');
   const failure = await download.failure(); assert.equal(failure,null,'Download failed: '+failure);
   const filepath = await download.path(), text = fs.readFileSync(filepath,'utf8');
   assert(text.startsWith('---\nname: release-notes\n'));
   assert(text.includes('“Release notes — <version>”'));
   assert(!text.includes('&lt;')); assert(text.includes('## Boundaries'));
   fs.writeFileSync(path.join(output,'downloaded-SKILL.md'),text);
  });
  await check('Copy button passes exact example text to clipboard API',async()=>{
   await page.evaluate(()=>{window.__copied=''; Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});});
   await page.locator('[data-copy="lab-input"]').click();
   assert.equal(await page.evaluate(()=>window.__copied),await page.locator('#lab-input').textContent());
  });
  await check('Clipboard denial provides selectable text fallback',async()=>{
   await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('Denied');}; window.__execCommand=document.execCommand; document.execCommand=()=>false;});
   await page.locator('[data-copy="lab-input"]').click();
   assert.equal(await page.evaluate(()=>getSelection().toString()),await page.locator('#lab-input').textContent());
   assert.match(await page.locator('#toast').textContent(),/Ctrl\+C/);
   await page.evaluate(()=>{document.execCommand=window.__execCommand;getSelection().removeAllRanges();});
  });
  await check('Search finds collapsed content and safely handles arbitrary input',async()=>{
   await page.locator('#search').fill('fork');
   assert(await page.locator('#search-results').isVisible());
   await page.locator('#search-results a[href="#copilot"]').click();
   assert(await page.locator('#copilot').isVisible());
   assert.equal(await page.locator('#copilot details').filter({hasText:'Advanced invocation controls'}).getAttribute('open'),'');
   await page.locator('#search').fill('<img src=x onerror=alert(1)>');
   assert.match(await page.locator('#search-results').textContent(),/0 chapters/);
   assert.equal(await page.locator('#search-results img').count(),0);
   await page.locator('#clear-search').click();
  });
  await check('Search activates a matching anatomy panel',async()=>{
   await page.locator('#search').fill('Deterministic work');
   await page.locator('#search-results a[href="#anatomy"]').click();
   assert(await page.locator('[data-view="scripts"]').isVisible());
   assert.match(await page.locator('.search-hit').textContent(),/Deterministic work/i);
  });
  await check('Resume state and browser Back keep the correct chapter',async()=>{
   await page.goto(url+'#workshop');
   await page.goto(url);
   assert(await page.locator('#workshop').isVisible());
   assert.equal(new URL(page.url()).hash,'#workshop');
   await page.locator('#next').click();
   await page.goBack(); assert(await page.locator('#workshop').isVisible());
  });
  await check('Skip link preserves the active chapter',async()=>{
   await page.locator('.skip').focus(); await page.keyboard.press('Enter');
   assert(await page.locator('#workshop').isVisible());
   assert.equal(await page.evaluate(()=>document.activeElement.id),'workshop');
  });
  await check('Quiz feedback differentiates empty, incorrect, and correct answers',async()=>{
   await page.locator('.chapter-nav a[href="#foundations"]').click();
   const quiz=page.locator('#foundations .quiz');
   await quiz.locator('[data-check]').click(); assert.match(await quiz.locator('.feedback').textContent(),/Choose/);
   await quiz.locator('input[value="a"]').check(); await quiz.locator('[data-check]').click(); assert.match(await quiz.locator('.feedback').textContent(),/Not quite/);
   await quiz.locator('input[value="b"]').check(); await quiz.locator('[data-check]').click(); assert.match(await quiz.locator('.feedback').textContent(),/Correct/);
  });
  await check('Decision helper answers a distinct scenario',async()=>{
   await page.locator('.chapter-nav a[href="#toolbox"]').click();
   await page.locator('#scenario').selectOption('enforce');
   assert.match(await page.locator('#decision').textContent(),/enforced check/);
  });
  await check('Read-all mode reveals all chapters and returns to guided mode',async()=>{
   await page.locator('#reading-mode').click(); assert.equal(await page.locator('.chapter:visible').count(),11);
   await page.locator('#reading-mode').click(); assert.equal(await page.locator('.chapter:visible').count(),1);
  });
  await check('Print exposes every chapter, disclosure, and anatomy panel',async()=>{
   await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
   await page.emulateMedia({media:'print'});
   assert.equal(await page.locator('.chapter:visible').count(),11);
   assert.equal(await page.locator('details:not([open])').count(),0);
   assert.equal(await page.locator('[data-view]:visible').count(),8);
   assert(!(await page.locator('.skip').isVisible()));
   assert.match(await page.locator('#safety .feedback').textContent(),/^Answer:/);
   await page.pdf({path:path.join(output,'guide-print.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
   await page.emulateMedia({media:'screen'});
   await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
   assert.equal(await page.locator('.chapter:visible').count(),1);
  });
  await check('Internal IDs, links, and copy targets resolve',async()=>{
   const audit=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);
    return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),broken:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),copies:[...document.querySelectorAll('[data-copy]')].filter(n=>!document.getElementById(n.dataset.copy)).length};
   });
   assert.deepEqual(audit,{duplicates:[],broken:[],copies:0});
  });
  for (const width of [1440,1024,768,390,320]) {
   await check(`All chapters fit viewport at ${width}px`,async()=>{
    await page.setViewportSize({width,height:900});
    for(const id of ['welcome','foundations','toolbox','anatomy','copilot','authoring','workshop','evaluation','safety','patterns','reference']) {
     await page.goto(url+'#'+id);
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
     assert(!overflow,`${id} overflows at ${width}`);
    }
   });
  }
  await page.setViewportSize({width:390,height:844}); await page.goto(url+'#welcome');
  await page.screenshot({path:path.join(output,'mobile-welcome.png'),fullPage:true});
  await check('Mobile menu opens, navigates, and closes with Escape',async()=>{
   await page.locator('#menu-toggle').click(); assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
   await page.locator('.chapter-nav a[href="#copilot"]').click(); assert(await page.locator('#copilot').isVisible());
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
   await page.locator('#menu-toggle').click(); await page.keyboard.press('Escape');
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  });
  await check('Closed mobile menu is hidden from keyboard focus',async()=>{
   assert.equal(await page.locator('#sidebar').evaluate(node=>getComputedStyle(node).visibility),'hidden');
   await page.locator('#menu-toggle').focus(); await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'reading-mode');
  });
  await check('Mobile search exposes an accessible results view',async()=>{
   await page.locator('#menu-toggle').click();
   await page.locator('#search').fill('permission');
   await page.locator('#show-search').click();
   assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
   assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H2');
   assert(await page.locator('#search-results').isVisible());
   await page.locator('#search-results a').first().click();
  });
  await page.goto(url+'#copilot');
  await page.screenshot({path:path.join(output,'mobile-copilot.png'),fullPage:true});
  await check('Reduced motion removes smooth scrolling',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  });
  const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const staticPage=await staticContext.newPage(); await staticPage.goto(url);
  await check('No-JavaScript fallback retains the whole guide and examples',async()=>{
   assert.equal(await staticPage.locator('.chapter:visible').count(),11);
   assert(await staticPage.locator('#lab-skill').isVisible());
   assert(await staticPage.locator('[data-view="refs"]').isVisible());
   assert(await staticPage.locator('.chapter-nav').isVisible());
   assert(!(await staticPage.locator('#menu-toggle').isVisible()));
  });
  const restrictedContext=await browser.newContext({viewport:{width:1200,height:900}});
  await restrictedContext.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
  const restrictedPage=await restrictedContext.newPage(); await restrictedPage.goto(url);
  await check('Blocked browser storage preserves functional navigation',async()=>{
   assert.match(await restrictedPage.locator('#storage-note').textContent(),/temporary/);
   await restrictedPage.locator('.chapter-nav a[href="#workshop"]').click();
   await restrictedPage.locator('#lab-created').check();
   assert(await restrictedPage.locator('#lab-created').isChecked());
  });
  await page.setViewportSize({width:1440,height:1000}); await page.goto(url+'#reference');
  await check('Reset and Undo restore saved progress and checklists',async()=>{
   const before=await page.locator('#progress-text').textContent();
   await page.locator('#reset-progress').click();
   assert.match(await page.locator('#progress-text').textContent(),/0 of 10/);
   await page.locator('#toast button').click();
   assert.equal(await page.locator('#progress-text').textContent(),before);
  });
  await check('No page errors or external asset requests',async()=>{assert.deepEqual(errors,[]); assert.deepEqual(requests,[]);});
  fs.writeFileSync(path.join(output,'test-results.json'),JSON.stringify({browser:'Brave (Chromium)',url,passed:results.length,checks:results,errors,externalRequests:requests},null,2));
  console.log(`\n${results.length} checks passed.`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
