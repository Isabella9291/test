/* Browser interaction regression checks, created with ChatGPT assistance.
 * Start the server first. npm install, then npm test.
 * CHROMIUM_PATH can select an existing Chromium instead of Playwright's download. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const report = [];
  try {
    await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8000/?seed=1927');
    await page.waitForFunction(() => window.Story && document.getElementById('loading').hidden);
    assert.equal(await page.evaluate(() => Story.open), false);
    await page.mouse.click(1223, 506); // Actual brass clasp, rather than an internal setter.
    await page.waitForFunction(() => Story.opening === 1 && Story.reveal === 1);
    const mouse={
      click:async(x,y)=>{const p=await page.evaluate(p=>Book.toScreen(p.x,p.y),{x,y});return page.mouse.click(p.x,p.y);},
      move:async(x,y,options)=>{const p=await page.evaluate(p=>Book.toScreen(p.x,p.y),{x,y});return page.mouse.move(p.x,p.y,options);}
    };
    const initial = await page.evaluate(() => Flock.sheep.map(s => ({ id: s.id, x: s.x, y: s.y, size: s.size, wolf: s.wolf })));
    assert(initial.length >= 18 && initial.length <= 26);
    assert(initial.some(s => s.wolf) && initial.some(s => !s.wolf));
    report.push('clasp opens; varied flock and wolf shadows generated');

    const free = await page.evaluate(() => {
      for (let y = 445; y < 730; y += 30) for (let x = 310; x < 1140; x += 30) {
        if (abs(x - 720) > 30 && !Book.isRiver(x,y,20) && !NoiseMechanic.hit(x,y) && Flock.sheep.every(s => dist(x,y,s.x,s.y) > (s.size + 1.2) * 25)) return {x,y};
      }
    });
    assert(free, 'There is a free patch of grass');
    await mouse.click(free.x, free.y);
    assert.equal(await page.evaluate(() => Flock.sheep.length), initial.length + 1);
    assert(await page.evaluate(p => Flock.sheep.some(s => dist(s.x,s.y,p.x,p.y) < 3), free));
    await mouse.click(600, await page.evaluate(() => 185 + Book.riverY((600-235)/998*1000)*635/500));
    assert.equal(await page.evaluate(() => Flock.sheep.length), initial.length + 1);
    report.push('empty grass click creates a sheep at the pointer; river clicks do not');

    const sheep = initial[5];
    let clouds = await page.evaluate(() => NoiseMechanic.clouds.length);
    await mouse.click(sheep.x, sheep.y - 8);
    assert.equal(await page.evaluate(() => NoiseMechanic.clouds.length), clouds);
    assert(await page.evaluate(id => Flock.sheep.some(s => s.id === id), sheep.id));
    await mouse.move(sheep.x, sheep.y - 8); await page.mouse.down();
    await page.waitForFunction(() => Input.held?.duration > .75);
    await page.mouse.up();
    assert.equal(await page.evaluate(() => NoiseMechanic.clouds.length), clouds + 1);
    assert(await page.evaluate(id => !Flock.sheep.some(s => s.id === id), sheep.id));
    report.push('short press preserves sheep; long press transforms sheep into cloud');

    await page.waitForTimeout(200);
    let c = await page.evaluate(() => { const c = NoiseMechanic.clouds.at(-1); return { x: c.x, y: c.y }; });
    await mouse.move(c.x, c.y); await page.mouse.down();
    await mouse.move(900, 345, { steps: 10 });
    assert(await page.evaluate(() => Input.dragCloud !== null));
    await page.mouse.up();
    const afterDrag = await page.evaluate(() => { const c = NoiseMechanic.clouds.at(-1); return { x: c.x, y: c.y }; });
    assert(Math.abs(afterDrag.x - 900) < 3 && Math.abs(afterDrag.y - 345) < 3);
    await page.waitForTimeout(900);
    assert(await page.evaluate(x => Math.abs(NoiseMechanic.clouds.at(-1).x - x) > .05, afterDrag.x));
    report.push('cloud drags to pointer and resumes noise-driven drift');

    // Accelerate the real lifecycle to its rain event, preserving random rain selection.
    const lifecycle = await page.evaluate(() => {
      for (let i = 0; i < 12 && !NoiseMechanic.clouds.some(c => c.rain); i++) NoiseMechanic.addCloud(900, 530);
      const cloud = NoiseMechanic.clouds.find(c => c.rain);
      if (!cloud) throw new Error('No rainy cloud available for lifecycle check');
      cloud.age = cloud.life - 4; NoiseMechanic.update(.1);
      const first = cloud.newborn?.growth;
      NoiseMechanic.update(1);
      const progress = (cloud.age - (cloud.life - 4)) / 4;
      const synced = Math.abs(cloud.newborn.growth - progress) < .00001;
      NoiseMechanic.update(4);
      return { first, synced, complete: cloud.newborn.growth === 1, removed: !NoiseMechanic.clouds.includes(cloud), particles: NoiseMechanic.particles.length };
    });
    assert(lifecycle.first > 0 && lifecycle.first < 1);
    assert(lifecycle.synced && lifecycle.complete && lifecycle.removed);
    report.push('random rainy cloud grows a new sheep in sync with its disappearance');

    const oldIds = await page.evaluate(() => Flock.sheep.map(s => s.id));
    await mouse.click(275, 780);
    await page.waitForFunction(() => Story.turn === 0 && Story.page === 1);
    assert(await page.evaluate(ids => Flock.sheep.every(s => !ids.includes(s.id)), oldIds));
    for (let season = 1; season <= 4; season++) {
      await mouse.click(1197, 780);
      await page.waitForFunction(expected => Story.turn === 0 && Story.season === expected, season % 4);
    }
    report.push('left page refreshes flock; right page cycles all four seasons');

    await page.locator('#night-button').click();
    await page.waitForFunction(() => Story.night > .85);
    await page.locator('#music-button').click();
    await page.waitForFunction(() => MusicBox.playing && MusicBox.ctx.state === 'running' && MusicBox.nodes.size > 0);
    await page.locator('#track-button').click();
    await page.waitForFunction(() => MusicBox.track === 1 && MusicBox.playing);
    await page.screenshot({ path: process.env.SCREENSHOT || '/tmp/sheep-book-night.png' });
    await page.locator('#music-button').click();
    assert.equal(await page.evaluate(() => MusicBox.playing), false);
    report.push('night transition, audio scheduling, track switch and pause');

    await page.setViewportSize({ width: 820, height: 620 });
    await page.waitForTimeout(250);
    assert(await page.evaluate(() => width <= innerWidth && height <= innerHeight));
    await page.locator('#help-button').click(); assert(await page.locator('#help').isVisible());
    report.push('responsive canvas and help controls');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: report, pageErrors: errors }, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
