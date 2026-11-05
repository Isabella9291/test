/* TIME mechanic (student owner: fill in your name).
 * ChatGPT-assisted: elapsed seconds drive transitions, timed day/night cycles,
 * seasonal snow and page animation. Delta time keeps timing frame-rate independent.
 * Reference: https://p5js.org/reference/p5/deltaTime/ */
window.Story = {
  open: false, opening: 0, reveal: 0, turn: 0, turnKind: '', turnSwapped: false,
  season: 0, previousSeason: 0, seasonBlend: 1, page: 0,
  elapsed: 0, night: 0, targetNight: 0, sun: .75,
  manualLightUntil: 0, cycleTime: 0
};
window.TimeMechanic = {
  open() {
    if (Story.open) return;
    Story.open = true; Story.opening = .001;
    document.getElementById('open-button').hidden = true;
    for (const id of ['flock-button', 'season-button', 'night-button']) document.getElementById(id).hidden = false;
    Input.announce('故事书打开了。长按小羊可以放出云朵。');
  },
  turn(kind) {
    if (!Story.open || Story.turn > 0 || Story.opening < 1) return;
    Story.reveal = 0; Story.turn = .001; Story.turnKind = kind; Story.turnSwapped = false;
    Input.cancel();
  },
  toggleNight() {
    Story.targetNight = Story.targetNight > .5 ? 0 : 1;
    Story.manualLightUntil = Story.elapsed + 45;
  },
  update(dt) {
    Story.elapsed += dt;
    if (!Story.open) return;
    Story.opening = min(1, Story.opening + dt / 1.25);
    if (Story.opening === 1 && Story.turn === 0) Story.reveal = min(1, Story.reveal + dt / 2.2);
    Story.cycleTime += dt;
    // A true timer-driven mechanic, alongside the user's manual time control.
    if (Story.elapsed > Story.manualLightUntil) Story.targetNight = (1 - cos(Story.cycleTime * TWO_PI / 120)) / 2;
    Story.night = lerp(Story.night, Story.targetNight, min(1, dt * 1.6));
    Story.seasonBlend = min(1, Story.seasonBlend + dt / 1.4);
    if (Story.turn > 0) {
      Story.turn += dt / 1.05;
      if (Story.turn >= .5 && !Story.turnSwapped) {
        Story.turnSwapped = true; Story.page++;
        if (Story.turnKind === 'season') {
          Story.previousSeason = Story.season; Story.season = (Story.season + 1) % 4; Story.seasonBlend = 0;
          Input.announce('季节：' + ['春', '夏', '秋', '冬'][Story.season]);
        } else { NoiseMechanic.newFlock(); Input.announce('新的一页，新的羊群。'); }
      }
      if (Story.turn >= 1) Story.turn = 0;
    }
  }
};
