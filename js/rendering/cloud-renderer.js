/* Shared artwork: cloud volumes, rain and particles. ChatGPT-assisted.
 * Entity ages, noise paths, rain selection and births belong to the noise mechanic. */
Object.assign(NoiseMechanic, {
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
      const opacity=(1-progress)*(c.fromSheep?1:min(1,c.age*1.4))*(c.ambient?.8:1);
      const morph=constrain(c.age/1.8,0,1), startScale=1+c.sourcePuff*.85;
      const w=lerp(66*startScale,108,morph), h=lerp(58*startScale,64,morph);
      push();drawingContext.globalAlpha *= opacity;WoolPainter.draw(c.sourceVariant,0,0,w,h,Story.night);pop();
      if(c.fromSheep && c.age<.45){
        push();drawingContext.globalAlpha *= (1-c.age/.45)*opacity;
        fill('#414f54');ellipse(w*.27,1,12,16);rect(-12,15,4,10);rect(12,15,4,10);pop();
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
});
