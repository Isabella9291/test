/* Shared river geometry, used by rendering and placement. ChatGPT-assisted. */
window.SceneGeometry = {
  riverY(x) { return 112 + sin(x * .007 - .8) * 43 + sin(x * .014) * 12; },
  isRiver(x, y, margin = 0) {
    const u = (x - 235) / 998 * 1000, v = (y - 185) / 635 * 500;
    return abs(v - this.riverY(u)) < 23 + margin;
  },
};
