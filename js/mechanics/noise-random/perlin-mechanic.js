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
  addCloud(x, y, size = 1, ambient = false, source = null) {
    if (this.clouds.length >= ProjectConfig.noise.maxClouds) return;
    this.clouds.push({
      x, y, groundY: constrain(y + this.range(-15, 30), 408, 700),
      startY: y, sourceVariant: source?.woolVariant ?? floor(this.range(0,8)), sourcePuff: source?.puff ?? 0, fromSheep: !!source, targetY: max(235, y - this.range(140, 210)),
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
        if (c.age < ProjectConfig.noise.cloudRiseSeconds) {
          const t=min(1,c.age/ProjectConfig.noise.cloudRiseSeconds); c.y = lerp(c.startY, c.targetY, t*t*(3-2*t));
        } else c.y += (noise(c.seed + 160, Story.elapsed * .075) - .5) * dt * 9;
      }
      c.x = constrain(c.x, 290, 1161); c.y = constrain(c.y, 235, c.fromSheep ? max(678,c.startY) : 678);
      const progress = constrain((c.age - (c.life - 4)) / 4, 0, 1);
      if (progress > 0 && c.rain && !c.newborn) {
        const size = this.range(.75, 1.12);
        const p = Flock.sheep.length < ProjectConfig.noise.maxSheep ? Flock.findSpace(size, { x: c.x, y: c.groundY }) : null;
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
  releaseSheep(sheep, heldSeconds) {
    if (heldSeconds < ProjectConfig.input.holdToCloudSeconds || this.clouds.length >= ProjectConfig.noise.maxClouds || !Flock.sheep.includes(sheep)) return false;
    Flock.sheep = Flock.sheep.filter(s => s !== sheep);
    this.addCloud(sheep.x, sheep.y - 12, sheep.size, false, sheep);
    return true;
  }
};
