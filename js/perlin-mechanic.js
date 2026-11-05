/* PERLIN NOISE + RANDOMNESS mechanic (student owner: fill in your name).
 * Created with ChatGPT assistance. randomSeed-like local PRNG keeps artwork
 * texture generation from altering behaviour. noise() samples a continuous field
 * for cloud wind; random choices set individuals, rain, lifetimes and particles.
 * Sources: https://p5js.org/reference/p5/noise/
 *          https://p5js.org/reference/p5/randomSeed/
 * Local PRNG: a simple 32-bit linear congruential generator, not for security. */
window.NoiseMechanic = {
  seed: 1927, nextId: 1, clouds: [], particles: [],
  rand() { this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0; return this.seed / 4294967296; },
  range(a, b) { return a + this.rand() * (b - a); },
  newFlock() {
    this.clouds = []; this.particles = []; Flock.sheep = [];
    const count = floor(this.range(18, 27));
    for (let i = 0; i < count; i++) {
      const size = this.range(.72, 1.28), p = Flock.findSpace(size);
      if (p) Flock.sheep.push(Flock.create(p.x, p.y, size));
    }
    // A readable minority of wolf shadows, even for unlucky random samples.
    if (!Flock.sheep.some(s => s.wolf)) Flock.sheep[0].wolf = true;
    this.ambientCloud(443, 322); this.ambientCloud(1004, 337);
  },
  ambientCloud(x, y) { this.addCloud(x, y + 75, .85, true); },
  addCloud(x, y, size = 1, ambient = false) {
    if (this.clouds.length >= 14) return;
    this.clouds.push({
      x, y: y - 16, groundY: constrain(y + this.range(-15, 30), 408, 700),
      startY: y - 16, targetY: max(311, y - this.range(110, 160)),
      size, age: 0, life: this.range(16, 25), rain: this.rand() < .38,
      seed: this.range(0, 900), newborn: null, burst: false, ambient,
      tufts: Array.from({ length: 11 }, () => ({ x: this.range(-30, 30), y: this.range(-10, 10), r: this.range(15, 27) }))
    });
  },
  update(dt) {
    for (const c of this.clouds) {
      c.age += dt;
      if (Input.dragCloud !== c) {
        // Two independent continuous noise samples prevent straight-line drift.
        c.x += (noise(c.seed, Story.elapsed * .065) - .48) * dt * 32;
        if (c.age < 4) {
          c.y = lerp(c.startY, c.targetY, 1 - (1 - min(1, c.age / 4)) ** 3);
        } else c.y += (noise(c.seed + 160, Story.elapsed * .075) - .5) * dt * 9;
      }
      c.x = constrain(c.x, 290, 1161); c.y = constrain(c.y, 292, 678);
      const progress = constrain((c.age - (c.life - 4)) / 4, 0, 1);
      if (progress > 0 && c.rain && !c.newborn) {
        const size = this.range(.75, 1.12);
        const p = Flock.sheep.length < 45 ? Flock.findSpace(size, { x: c.x, y: c.groundY }) : null;
        if (p) {
          c.newborn = Flock.create(p.x, p.y, size, true); c.newborn.rainBorn = true;
          Flock.sheep.push(c.newborn);
        } else c.rain = false;
      }
      // Growth and cloud opacity share this exact progress value.
      if (c.newborn) c.newborn.growth = progress;
      if (progress > 0 && !c.burst) {
        c.burst = true;
        for (let i = 0; i < 37; i++) this.particles.push({
          x: c.x + this.range(-35, 35), y: c.y + this.range(-15, 15),
          vx: this.range(-12, 12), vy: this.range(-18, 2), age: 0,
          life: this.range(2, 4), size: this.range(1, 3), seed: this.range(0, 300)
        });
      }
    }
    for (const p of this.particles) {
      p.age += dt; p.x += (p.vx + (noise(p.seed, Story.elapsed * .2) - .5) * 9) * dt; p.y += p.vy * dt;
    }
    // Bound entity lifetimes and count so repeated interaction remains lightweight.
    this.clouds = this.clouds.filter(c => c.age < c.life);
    this.particles = this.particles.filter(p => p.age < p.life);
    if (Input.dragCloud && !this.clouds.includes(Input.dragCloud)) Input.dragCloud = null;
  },
  hit(x, y) { return [...this.clouds].reverse().find(c => dist(x, y, c.x, c.y) < 42 * c.size); },
  drawClouds(front) {
    noStroke();
    for (const c of this.clouds) {
      const progress = constrain((c.age - (c.life - 4)) / 4, 0, 1);
      if (!front && c.rain && c.newborn && progress > 0) {
        // Rain is bounded by its cloud and the place where its sheep is growing.
        stroke(185, 212, 207, 140 * (1 - progress)); strokeWeight(1);
        for (let i = 0; i < 23; i++) {
          const f = (i / 23 + Story.elapsed * .9) % 1;
          const x = lerp(c.x, c.newborn.x, f) + sin(i * 9) * 17;
          const y = lerp(c.y + 6, c.newborn.y, f);
          line(x, y, x - 1, y + 6);
        }
        noStroke();
      }
      if (!front) continue;
      push(); translate(c.x, c.y); scale(c.size);
      const opacity = (1 - progress) * min(1, c.age * 1.4) * (c.ambient ? .8 : 1);
      fill(35, 48, 40, opacity * 12); ellipse(7, 21, 76, 20);
      for (let i = 0; i < c.tufts.length; i++) {
        const t = c.tufts[i]; fill(lerpColor(color('#f2edda'), color('#a5bbc6'), Story.night * .7));
        const col = lerpColor(color('#f4efdc'), color('#a5bbc6'), Story.night * .7); col.setAlpha(opacity * 205);
        fill(col); ellipse(t.x, t.y, t.r * 1.5, t.r);
        fill(255, 251, 227, opacity * 42); ellipse(t.x - 2, t.y - 4, t.r, t.r * .5);
      }
      pop();
    }
    if (!front) return;
    for (const p of this.particles) {
      const alpha = (1 - p.age / p.life) * 210;
      fill(245, 231, 175, alpha); circle(p.x, p.y, p.size);
      if (p.size > 2.5) { stroke(249, 237, 195, alpha * .8); strokeWeight(.7); line(p.x - 3, p.y, p.x + 3, p.y); line(p.x, p.y - 3, p.x, p.y + 3); noStroke(); }
    }
  }
};
