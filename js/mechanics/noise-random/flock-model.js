/* NOISE + RANDOMNESS: entity creation, traits, placement, motion and separation. ChatGPT-assisted implementation:
 * small overlapping paint marks form wool; the wolf is a flat, moving shadow.
 * Owner: Perlin noise and randomness member (fill in real name). Drawing is separate. */
window.Flock = {
  sheep: [],
  bounds: { left: 297, right: 1163, top: 465, bottom: 744 },
  create(x, y, size, growing = false) {
    const r = () => NoiseMechanic.rand();
    return {
      id: NoiseMechanic.nextId++, x, y, homeX: x, homeY: y, size,
      woolVariant: floor(r()*8), wolf: r() < .28, seed: r() * 1000, facing: r() < .5 ? -1 : 1,
      eyeHue: r() * 360, jumpHeight: 8 + r() * 19, jumpSpeed: 1.5 + r() * 1.5,
      chaseRadius: 65 + r() * 45, chaseSpeed: .55 + r() * .35,
      shadowAngle: Math.atan2(y - 500, x - 720),
      wolfReveal: 0, trail: [], wolfX: x, wolfY: y,
      growth: growing ? 0 : 1, lookUntil: 0, puff: 0,
      tufts: Array.from({ length: 26 }, () => ({ x: (r() - .5) * 32, y: (r() - .5) * 22, r: 4 + r() * 7 }))
    };
  },
  findSpace(size = 1, desired = null) {
    const b = this.bounds;
    for (let i = 0; i < 180; i++) {
      const x = desired && i < 50 ? constrain(desired.x + (NoiseMechanic.rand() - .5) * i * 3, b.left, b.right) : NoiseMechanic.range(b.left, b.right);
      const y = desired && i < 50 ? constrain(desired.y + (NoiseMechanic.rand() - .5) * i * 2, b.top, b.bottom) : NoiseMechanic.range(b.top, b.bottom);
      if (abs(x - 720) < 26 || SceneGeometry.isBlocked(x, y, 18 * size)) continue;
      if (this.sheep.every(s => dist(s.x, s.y, x, y) > (s.size + size) * 25)) return { x, y };
    }
    return null;
  },
  addAt(x, y) {
    const b = this.bounds;
    if (this.sheep.length >= ProjectConfig.noise.maxSheep || x < b.left || x > b.right || y < b.top || y > b.bottom || abs(x - 720) < 26 || SceneGeometry.isBlocked(x, y, 18)) return false;
    const size = NoiseMechanic.range(.75, 1.2);
    if (this.sheep.some(s => dist(s.x, s.y, x, y) < (s.size + size) * 24)) return false;
    this.sheep.push(this.create(x, y, size)); return true;
  },
  update(dt) {
    const b = this.bounds, chase = MusicBox.playing && Story.night < .5;
    for (const s of this.sheep) {
      if (s.growth === 0 && !s.rainBorn) s.growth = 1;
      const targetAngle = atan2(s.y - Input.point.y, s.x - Input.point.x);
      const difference = atan2(sin(targetAngle - s.shadowAngle), cos(targetAngle - s.shadowAngle));
      // Angular damping plus a speed limit avoids flipping when the pointer crosses a sheep.
      if (abs(difference) > .035) s.shadowAngle += constrain(difference * (1 - exp(-dt * 1.25)), -dt * .65, dt * .65);
      const active = chase && s.wolf;
      s.wolfReveal = lerp(s.wolfReveal, active ? 1 : 0, 1 - exp(-dt * 3));
      const angle = Story.elapsed * s.chaseSpeed + s.seed;
      const tx = s.homeX + (active ? cos(angle) * s.chaseRadius : 0);
      const ty = s.homeY + (active ? sin(angle) * s.chaseRadius * .68 : 0);
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
      const ground=SceneGeometry.constrainGround(s.x,s.y,20*s.size,b);
      s.x=ground.x;s.y=ground.y;
      s.trail.push({x:s.x,y:s.y,time:Story.elapsed});
      while(s.trail.length > 2 && s.trail[1].time < Story.elapsed - .75) s.trail.shift();
      s.wolfX = lerp(s.wolfX, s.trail[0].x - s.facing * 35, 1-exp(-dt*3));
      s.wolfY = lerp(s.wolfY, s.trail[0].y + 12, 1-exp(-dt*3));
      const held = Input.held?.sheep === s;
      s.puff = lerp(s.puff, held ? min(1, Input.held.duration / 1.0) : 0, min(1, dt * 7));
    }
  },
};
