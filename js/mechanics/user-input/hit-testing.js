/* USER INPUT: pointer hit testing. ChatGPT-assisted. Owner: user-input member. */
Object.assign(Flock, {
  hit(x, y) {
    return [...this.sheep].sort((a, b) => b.y - a.y).find(s => s.growth > .5 && dist(x, y, s.x, s.y - 8) < 26 * s.size);
  }
});
Object.assign(NoiseMechanic, {
  hit(x, y) { return [...this.clouds].reverse().find(c => dist(x, y, c.x, c.y) < 42 * c.size); }
});
