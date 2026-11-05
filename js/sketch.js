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
  Book.init();
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
  if (Story.open) {
    if (Story.opening < 1) {
      push(); translate(720, 208); scale(1, .25 + .75 * sin(Story.opening * HALF_PI)); translate(-720, -208);
      Book.openBook(); pop(); Book.cover(Story.opening);
    } else { Book.openBook(); Book.pageTurn(); }
  } else Book.cover();
  Book.finish(); pop();
}
function windowResized() { const dimensions = fitScene(); resizeCanvas(...dimensions); Input.cancel(); }
function mouseMoved() { Input.move(mouseX / sceneScale, mouseY / sceneScale); }
function mouseDragged() { Input.move(mouseX / sceneScale, mouseY / sceneScale); return false; }
function mousePressed(event) {
  if (event?.target?.tagName !== 'CANVAS') return;
  Input.press(mouseX / sceneScale, mouseY / sceneScale); return false;
}
function mouseReleased() { Input.release(); }
function touchStarted(event) {
  if (event?.target?.tagName !== 'CANVAS') return;
  const t = touches[0]; if (t) Input.press(t.x / sceneScale, t.y / sceneScale); return false;
}
function touchMoved() { const t = touches[0]; if (t) Input.move(t.x / sceneScale, t.y / sceneScale); return false; }
function touchEnded() { Input.release(); return false; }
function keyPressed(event) {
  if (event?.target?.tagName === 'BUTTON') return;
  if (keyCode === ENTER) TimeMechanic.open();
  else if (keyCode === LEFT_ARROW) TimeMechanic.turn('flock');
  else if (keyCode === RIGHT_ARROW) TimeMechanic.turn('season');
  else if (key.toLowerCase() === 'n') TimeMechanic.toggleNight();
  else if (key.toLowerCase() === 'm') MusicBox.toggle();
  else if (key.toLowerCase() === 't') MusicBox.next();
  else if (key.toLowerCase() === 'h') Input.help();
  else return;
  return false;
}
