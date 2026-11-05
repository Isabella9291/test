/* p5.js 主程序：setup、draw、窗口缩放与模块整合
 * AI-assisted implementation: ChatGPT/Codex. Ownership and references: README.md. */

// ── Section 1 ──
/* Integration only: each mechanic lives in its own script.
 * Project code created with ChatGPT assistance; see README for scope and sources.
 * p5.js global mode reference: https://p5js.org/ */
let sceneScale = 1;
function fitScene() {
  sceneScale = min(windowWidth / Book.W, windowHeight / Book.H);
  return [max(1, floor(Book.W * sceneScale)), max(1, floor(Book.H * sceneScale))];
}
function setup() {
  pixelDensity(min(window.devicePixelRatio || 1, 2));
  const dimensions = fitScene();
  const canvas = createCanvas(...dimensions); canvas.parent('stage');
  canvas.attribute('aria-label', 'The Sheep：桌面上的互动童话书。可使用页面按钮或键盘操作。');
  textFont('Georgia, serif'); frameRate(40);
  document.fonts.load('112px StorybookScript').catch(()=>{});
  Book.init(); WoolPainter.init();
  const seed = new URLSearchParams(location.search).get('seed');
  NoiseMechanic.seed = seed !== null && /^\d+$/.test(seed) ? Number(seed) >>> 0 : Date.now() >>> 0;
  NoiseMechanic.newFlock(); Input.bind();
  document.getElementById('loading').hidden = true;
}
function draw() {
  // Cap a resumed tab's dt: long pauses must not teleport sheep or skip a story.
  const dt = min(deltaTime / 1000, .08);
  TimeMechanic.update(dt); Input.update(dt); MusicBox.update();
  if (Story.open) { NoiseMechanic.update(dt); Flock.update(dt); }
  background('#241a13'); push(); scale(sceneScale);
  Book.backdrop();
  push(); translate(720,500); scale(Book.viewScale); translate(-720,-500);
  if (Story.open) {
    if (Story.opening < 1) {
      Book.openingFrame();
    } else { Book.openBook(); Book.pageTurn(); }
  } else Book.cover();
  pop(); Book.finish(); pop();
}
function windowResized() { const dimensions = fitScene(); resizeCanvas(...dimensions); Input.cancel(); Input.layoutCassetteControls(); }
