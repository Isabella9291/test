/* USER INPUT mechanic (student owner: fill in your name).
 * ChatGPT-assisted hit testing and gesture state: click, hold, cloud drag and
 * empty-meadow time scrubbing are mutually exclusive. Mouse and touch share it.
 * Source: https://p5js.org/reference/p5/mousePressed/ */
window.Input = {
  point: { x: 720, y: 500 }, held: null, dragCloud: null, lightDrag: null,
  hoverSheep: null, activePointer: false,
  announce(message) { document.getElementById('announcement').textContent = message; },
  cancel() { this.held = null; this.dragCloud = null; this.lightDrag = null; this.activePointer = false; },
  move(x, y) {
    const page=Book.toPage(x,y); x=page.x; y=page.y;
    this.point = { x, y };
    if (this.dragCloud) {
      this.dragCloud.x = constrain(x, 290, 1161); this.dragCloud.y = constrain(y, 235, 678);
      // Dragging releases the rising phase; its wind field resumes from this point.
      this.dragCloud.age = max(4, this.dragCloud.age);
      this.dragCloud.groundY = constrain(y + 120, 408, 700);
    }
    if (this.lightDrag && dist(x, y, this.lightDrag.x, this.lightDrag.y) > 8) {
      this.lightDrag.moved = true;
      TimeMechanic.setNight(this.lightDrag.night + (y - this.lightDrag.y) / 220);
    }
  },
  press(x, y) {
    this.move(x, y);
    if (x >= 65 && x <= 162 && y >= 192 && y <= 253) { MusicBox.toggle(); return; }
    if (x > 162 && x < 226 && y >= 192 && y < 253) { MusicBox.next(); return; }
    x=this.point.x; y=this.point.y;
    if (!Story.open) {
      if (x > 720 && x < 1250 && y > 166 && y < 810) TimeMechanic.open();
      return;
    }
    if (Story.opening < 1 || Story.turn > 0) return;
    if (x > 240 && x < 338 && y > 753 && y < 815) { TimeMechanic.turn('flock'); return; }
    if (x > 1140 && x < 1230 && y > 753 && y < 815) { TimeMechanic.turn('season'); return; }
    const cloud = NoiseMechanic.hit(x, y);
    this.activePointer = true;
    if (cloud) { this.dragCloud = cloud; return; }
    const sheep = Flock.hit(x, y);
    if (sheep) { this.held = { sheep, duration: 0 };  return; }
    if (x > 260 && x < 1200 && y > 280 && y < 744) this.lightDrag = { x, y, moved: false, night: Story.targetNight };
  },
  release() {
    if (this.lightDrag && !this.lightDrag.moved) {
      const added = Flock.addAt(this.lightDrag.x, this.lightDrag.y);
      this.announce(added ? '草地上出现了一只新小羊。' : '请点击远离河流和羊群的空白草地。');
    }
    if (this.held) {
      const { sheep, duration } = this.held;
      
      if (NoiseMechanic.releaseSheep(sheep, duration)) { this.announce('羊毛变成了一朵云，可以拖动它。'); }
    }
    this.cancel();
  },
  update(dt) {
    // This member owns DOM feedback; the time mechanic only changes scene state.
    if (this.shownOpen !== Story.open) {
      this.shownOpen = Story.open;
      document.getElementById('open-button').hidden = Story.open;
      for (const id of ['flock-button','season-button','night-button']) document.getElementById(id).hidden = !Story.open;
    }
    if (Story.notice && this.lastNotice !== Story.notice) {
      this.lastNotice = Story.notice; this.announce(Story.notice);
    }
    if (Story.turn > 0) this.cancel();
    if (this.held) this.held.duration += dt;
    this.hoverSheep = Story.open && Story.opening === 1 && Story.turn === 0 ? Flock.hit(this.point.x, this.point.y) : null;
    if (Story.open && !this.activePointer && Story.night < .8) {
      Story.sun = lerp(Story.sun, map(constrain(this.point.x, 270, 1200), 270, 1200, -.95, .95), min(1, dt * 2));
    }
    const p = this.point;
    const onClasp = !Story.open && p.x > 720 && p.x < 1250 && p.y > 166 && p.y < 810;
    const corner = Story.open && p.y > 753 && p.y < 815 && ((p.x > 240 && p.x < 338) || (p.x > 1140 && p.x < 1230));
    const onRecord = p.x > 65 && p.x < 226 && p.y > 192 && p.y < 253;
    cursor(this.dragCloud ? 'grabbing' : (this.hoverSheep || onClasp || corner || onRecord || NoiseMechanic.hit(p.x, p.y)) ? 'pointer' : 'default');
  },
  bind() {
    const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    on('open-button', () => TimeMechanic.open());
    on('flock-button', () => TimeMechanic.turn('flock'));
    on('season-button', () => TimeMechanic.turn('season'));
    on('night-button', () => TimeMechanic.toggleNight());
    on('music-button', () => MusicBox.toggle());
    on('track-button', () => MusicBox.next());
    on('help-button', () => this.help());
    window.addEventListener('blur', () => this.cancel());
    window.addEventListener('pointercancel', () => this.cancel());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.cancel(); });
  },
  help() {
    const panel = document.getElementById('help'); panel.hidden = !panel.hidden;
    document.getElementById('help-button').setAttribute('aria-expanded', String(!panel.hidden));
  }
};
