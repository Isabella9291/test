/* Shared artwork: sheep, shadows and four-legged wolves. ChatGPT-assisted.
 * Reads entity state; does not own random selection or input events. */
Object.assign(Flock, {
  draw() {
    const sorted = [...this.sheep].sort((a, b) => a.y - b.y);
    for (const s of sorted) this.shadow(s);
    const figures = sorted.map(s=>({y:s.y,s,wolf:false}));
    for(const s of sorted) if(s.wolf && s.wolfReveal > .02) figures.push({y:s.wolfY,s,wolf:true});
    figures.sort((a,b)=>a.y-b.y).forEach(v=>v.wolf?this.drawWolf(v.s):this.body(v.s));
  },
  shadow(s) {
    if (s.growth <= .01) return;
    push(); translate(s.x, s.y + 6); scale(s.size * s.growth);
    rotate(s.shadowAngle); scale(.75 + abs(Story.sun) * .6, 1);
    noStroke(); fill(25,40,30,lerp(100,62,Story.night));
    if (!s.wolf || s.wolfReveal > .01) {
      drawingContext.save(); if(s.wolf) drawingContext.globalAlpha *= s.wolfReveal;
      ellipse(27,0,79,13);ellipse(63,-1,17,10);drawingContext.restore();
    }
    if(s.wolf && s.wolfReveal < .99) {
      drawingContext.save();drawingContext.globalAlpha *= (1-s.wolfReveal)*.43;
      translate(24,-2);scale(.78,.38);this.wolfShape(0,false);drawingContext.restore();
    }
    pop();
  },
  wolfShape(gait, painted) {
    // Four-legged profile: long muzzle, pointed ears, back, hocks and bushy tail.
    // The identical outline is used for its flat shadow and its emerged body.
    const coat = painted ? '#59635d' : '#24372c';
    noStroke();fill(coat);
    beginShape();vertex(-28,-16);bezierVertex(-47,-19,-48,-3,-70,-2);vertex(-60,7);vertex(-52,5);vertex(-47,9);bezierVertex(-32,4,-22,-6,-22,-12);endShape(CLOSE);
    for(let i=0;i<4;i++){
      const fore=i>1, x=fore?23:-24, phase=gait+(i%2)*PI+(fore?PI*.6:0);
      const knee=x+sin(phase)*9, paw=x+sin(phase)*17, lift=max(0,cos(phase))*7;
      fill(painted?(i%2?'#424e48':'#69756b'):coat);
      beginShape();vertex(x-5,-2);vertex(x+4,-1);vertex(knee+3,14-lift*.4);vertex(paw+5,28-lift);vertex(paw+11,29-lift);vertex(paw+10,32-lift);vertex(paw-2,32-lift);vertex(knee-3,16-lift*.4);endShape(CLOSE);
    }
    fill(coat);beginShape();vertex(-33,-14);bezierVertex(-18,-24,5,-23,24,-22);vertex(35,-34);vertex(40,-48);vertex(46,-36);vertex(53,-45);vertex(55,-30);vertex(62,-22);vertex(78,-16);vertex(80,-11);vertex(65,-8);vertex(60,-3);vertex(50,-6);vertex(40,0);bezierVertex(24,8,-15,10,-32,2);vertex(-38,-5);endShape(CLOSE);
    if(!painted)return;
    fill('#919787');beginShape();vertex(-27,-17);bezierVertex(-9,-24,12,-19,27,-21);vertex(37,-31);vertex(42,-34);vertex(39,-20);vertex(26,-12);bezierVertex(7,-13,-13,-12,-27,-17);endShape(CLOSE);
    fill('#b4b5a0');beginShape();vertex(35,-19);vertex(44,-26);vertex(53,-22);vertex(62,-16);vertex(75,-14);vertex(58,-11);vertex(51,-5);vertex(41,-1);vertex(31,-4);endShape(CLOSE);
    fill('#333e38');triangle(40,-44,43,-34,38,-34);triangle(52,-40,53,-30,48,-33);
    fill('#232c29');ellipse(77,-14,8,5);triangle(57,-12,73,-10,63,-5);
    fill('#e7dbb8');triangle(60,-11,64,-10,62,-6);triangle(68,-10,71,-10,69,-7);
    fill('#d1b777');ellipse(54,-24,3,2);fill('#252f27');circle(55,-24,1.2);
    stroke('#aeb19b66');strokeWeight(.7);
    for(let i=0;i<22;i++){const x=-27+(i*17)%63,y=-17+(i*7)%19;line(x,y,x+5,y-2);}noStroke();
    if(MusicBox.playing){fill('#b98579');ellipse(68,-5+sin(gait*.4),7,3);}
  },
  drawWolf(s) {
    push();const emerged=s.wolfReveal;
    translate(lerp(s.x,s.wolfX,emerged),lerp(s.y,s.wolfY,emerged));
    drawingContext.globalAlpha *= emerged;
    const facing=s.x>s.wolfX?1:-1;
    noStroke();fill(24,36,27,55);ellipse(0,12,64*s.size,13*s.size);
    scale(s.size*.65*facing,s.size*.65*(.4+.6*emerged));
    translate(0,-abs(sin(Story.elapsed*7+s.seed))*3);
    this.wolfShape(Story.elapsed*7+s.seed,true);pop();
  },
  body(s) {
    if (s.growth <= .01) return;
    let jump = 0;
    if (MusicBox.playing && Story.night > .5) {
      const wave = sin(Story.elapsed * s.jumpSpeed + s.seed);
      jump = max(0, wave) ** 1.5 * s.jumpHeight;
    }
    if (MusicBox.playing && Story.night < .5 && s.wolf) jump = abs(sin(Story.elapsed * 5 + s.seed)) * 7;
    const look = false;
    const facing = look ? (Input.point.x > s.x ? 1 : -1) : s.facing;
    push(); translate(s.x, s.y - jump); scale(s.size * s.growth);
    noStroke(); fill('#4c4938'); rect(-11, 1, 4, 11, 2); rect(6, 1, 4, 10, 2);
    push(); scale(1+s.puff*.85);
    WoolPainter.draw(s.woolVariant,0,-12,66,58,Story.night);pop();
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
});
