/* USER INPUT: p5 mouse, touch and keyboard callbacks. ChatGPT-assisted.
 * Converts canvas coordinates, then delegates gestures to Input. */
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
