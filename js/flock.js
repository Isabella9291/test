/* Sheep rendering and collision bounds. ChatGPT-assisted implementation:
 * small overlapping paint marks form wool; the wolf is a flat, moving shadow.
 * This file owns appearance; perlin-mechanic.js owns random choices. */
window.Flock = {
  sheep: [],
  bounds: { left: 297, right: 1163, top: 393, bottom: 710 },
  create(x, y, size, growing = false) {
    const r = () => NoiseMechanic.rand();
    return {
      id: NoiseMechanic.nextId++, x, y, homeX: x, homeY: y, size,
      wolf: r() < .28, seed: r() * 1000, facing: r() < .5 ? -1 : 1,
      eyeHue: r() * 360, jumpHeight: 8 + r() * 19, jumpSpeed: 1.5 + r() * 1.5,
      chaseRadius: 38 + r() * 35, chaseSpeed: .35 + r() * .4,
      growth: growing ? 0 : 1, lookUntil: 0, puff: 0,
      tufts: Array.from({ length: 26 }, () => ({ x: (r() - .5) * 32, y: (r() - .5) * 22, r: 4 + r() * 7 }))
    };
  },
  findSpace(size = 1, desired = null) {
    const b = this.bounds;
    for (let i = 0; i < 180; i++) {
      const x = desired && i < 50 ? constrain(desired.x + (NoiseMechanic.rand() - .5) * i * 3, b.left, b.right) : NoiseMechanic.range(b.left, b.right);
      const y = desired && i < 50 ? constrain(desired.y + (NoiseMechanic.rand() - .5) * i * 2, b.top, b.bottom) : NoiseMechanic.range(b.top, b.bottom);
      if (abs(x - 720) < 26) continue;
      if (this.sheep.every(s => dist(s.x, s.y, x, y) > (s.size + size) * 25)) return { x, y };
    }
    return null;
  },
  update(dt) {
    const b = this.bounds, chase = MusicBox.playing && Story.night < .5;
    for (const s of this.sheep) {
      if (s.growth === 0 && !s.rainBorn) s.growth = 1;
      const active = chase && s.wolf;
      const angle = Story.elapsed * s.chaseSpeed + s.seed;
      const tx = s.homeX + (active ? cos(angle) * s.chaseRadius : 0);
      const ty = s.homeY + (active ? sin(angle) * s.chaseRadius * .48 : 0);
      s.x = lerp(s.x, constrain(tx, b.left, b.right), min(1, dt * 2));
      s.y = lerp(s.y, constrain(ty, b.top, b.bottom), min(1, dt * 2));
      // A separation pass prevents the small chase loops crossing another sheep.
      for (const other of this.sheep) {
        if (s.id >= other.id) continue;
        let dx = s.x - other.x, dy = s.y - other.y;
        const d = Math.hypot(dx, dy), gap = (s.size + other.size) * 21;
        if (d < gap) {
          const f = (gap - d) * .5 / max(d, .01);
          if (d < .01) dx = .1;
          s.x += dx * f; s.y += dy * f; other.x -= dx * f; other.y -= dy * f;
        }
      }
      s.x = constrain(s.x, b.left, b.right); s.y = constrain(s.y, b.top, b.bottom);
      const held = Input.held?.sheep === s;
      s.puff = lerp(s.puff, held ? min(1, Input.held.duration / 1.7) : 0, min(1, dt * 5));
    }
  },
  hit(x, y) {
    return [...this.sheep].sort((a, b) => b.y - a.y).find(s => s.growth > .5 && dist(x, y, s.x, s.y - 8) < 26 * s.size);
  },
  draw() {
    const sorted = [...this.sheep].sort((a, b) => a.y - b.y);
    for (const s of sorted) this.shadow(s);
    for (const s of sorted) this.body(s);
  },
  shadow(s) {
    if (s.growth <= .01) return;
    let x = s.x, y = s.y;
    if (s.wolf && MusicBox.playing && Story.night < .5) {
      // The wolf follows the sheep's little circuit with a playful time delay.
      const a = Story.elapsed * s.chaseSpeed + s.seed - .5;
      x += (cos(a) - cos(a + .5)) * s.chaseRadius;
      y += (sin(a) - sin(a + .5)) * s.chaseRadius * .48;
    }
    push(); translate(x, y + 6); scale(s.size * s.growth);
    const sun = Story.sun, dark = Story.night;
    rotate(atan2(s.y - Input.point.y, s.x - Input.point.x));
    scale(.75 + abs(sun) * .6, 1);
    noStroke(); fill(25, 40, 30, lerp(106, 66, dark));
    if (!s.wolf) {
      beginShape(); vertex(-11, -5); bezierVertex(2, -15, 45, -12, 63, -6);
      bezierVertex(77, -2, 70, 6, 58, 6); bezierVertex(33, 9, 1, 11, -12, 5); endShape(CLOSE);
      ellipse(61, -3, 17, 11);
    } else {
      const hover = MusicBox.playing;
      const eager = hover ? .65 + sin(Story.elapsed * 4 + s.seed) * .35 : .12 + sin(Story.elapsed * .8 + s.seed) * .1;
      // Side profile: swept back, pointed ears, long muzzle, lower jaw and paw.
      beginShape(); vertex(-13, 5); bezierVertex(-7, -11, 18, -20, 40, -21);
      vertex(47, -35); vertex(52, -21); vertex(62, -32); vertex(64, -17);
      bezierVertex(71, -13, 75, -8, 84, -6); vertex(86, -1); vertex(72, 1);
      vertex(65, 1 + eager * 7); vertex(77, 5 + eager * 5); vertex(73, 9 + eager * 5);
      bezierVertex(58, 12, 50, 3, 49, -1); bezierVertex(37, -4, 30, 1, 32, 6);
      vertex(49, 8 - eager * 5); vertex(54, 5 - eager * 7); vertex(57, 8 - eager * 6);
      vertex(53, 14); bezierVertex(37, 20, 14, 11, -13, 5); endShape(CLOSE);
    }
    if (s.wolf) {
      fill(226, 218, 173, 160);
      for (let i = 0; i < 4; i++) triangle(64 + i * 4, 0, 68 + i * 4, 0, 66 + i * 4, 5);
      if (MusicBox.playing) { stroke('#a36c60'); strokeWeight(3); noFill(); const t = sin(Story.elapsed * 3 + s.seed); bezier(73, 8, 81, 12, 88 + t * 4, 1, 79, -2); }
    }
    pop();
  },
  body(s) {
    if (s.growth <= .01) return;
    let jump = 0;
    if (MusicBox.playing && Story.night > .5) {
      const wave = sin(Story.elapsed * s.jumpSpeed + s.seed);
      jump = max(0, wave) ** 1.5 * s.jumpHeight;
    }
    const look = false;
    const facing = look ? (Input.point.x > s.x ? 1 : -1) : s.facing;
    push(); translate(s.x, s.y - jump); scale(s.size * s.growth);
    noStroke(); fill('#4c4938'); rect(-11, 1, 4, 11, 2); rect(6, 1, 4, 10, 2);
    push(); scale(1 + s.puff * .43); fill(Story.night > .5 ? '#aeb9ba' : '#cbc9a9'); ellipse(0, -8, 35, 27);
    for (let i = 0; i < s.tufts.length; i++) {
      const t = s.tufts[i], k = i / s.tufts.length;
      const c = lerpColor(color('#d3d0b4'), color('#fffbe5'), k * .8);
      const nc = lerpColor(c, color('#a0b8bf'), Story.night * .6);
      fill(nc); push(); translate(t.x, t.y - 10); rotate(-.5 + sin(i * 2) * .35);
      rect(-t.r * .6, -t.r * .45, t.r * 1.5, t.r, 2);
      stroke(255, 249, 220, 105); strokeWeight(.7);
      for (let j = 0; j < 3; j++) line(-t.r * .5, j * 1.5 - 3, t.r * .6, j * 1.5 - 4);
      noStroke(); pop();
      stroke(255, 255, 238, 55); strokeWeight(.6); noFill(); arc(t.x, t.y - 11, t.r, t.r * .6, PI, TWO_PI); noStroke();
    }
    fill(255, 252, 228, 110); ellipse(-6, -20, 16, 7); pop();
    push(); scale(facing, 1);
    const headY = look ? -17 : -9;
    fill('#4b4638'); ellipse(18, headY, 13, 17); ellipse(14, headY - 6, 11, 5);
    fill('#635e49'); ellipse(23, headY - 5, 9, 4); fill('#3b3a31'); ellipse(21, headY + 5, 8, 6);
    fill('#e5ddbc'); circle(21, headY - 3, 2.1);
    if (Story.night > .25) {
      colorMode(HSB, 360, 100, 100, 1);
      for (let k = 5; k > 0; k--) { fill(s.eyeHue, 53, 100, Story.night * .07); circle(22, headY - 3, k * 2.4); }
      fill(s.eyeHue, 40, 100, Story.night); circle(22, headY - 3, 3); colorMode(RGB, 255);
    }
    pop();
    // Gentle ring signals the long-press interaction without covering the drawing.
    if (Input.held?.sheep === s) {
      noFill(); stroke('#ead8a3'); strokeWeight(1.3);
      arc(0, -10, 59, 47, -HALF_PI, -HALF_PI + min(1, Input.held.duration / 1.5) * TWO_PI);
    }
    pop();
  }
};
