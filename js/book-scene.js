/* Visual drawing helpers. Created with ChatGPT assistance: procedural wood,
 * leather, paper and painted scenery; no generated background images are used.
 * p5 drawing API: https://p5js.org/reference/ */
window.Book = {
  W: 1440, H: 1000, seasonNames: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
  palettes: [
    { ground: '#a7b873', dark: '#405c3b', leaf: '#68834b', flower: '#e1c9b4' },
    { ground: '#a7ae58', dark: '#3f5436', leaf: '#607943', flower: '#efdf9f' },
    { ground: '#b7a173', dark: '#63553b', leaf: '#9b673d', flower: '#d2a35c' },
    { ground: '#c6c9b7', dark: '#52605b', leaf: '#7d8b7f', flower: '#f4f0da' }
  ],
  init() {
    this.desk = this.makeDesk();
    this.paper = createGraphics(this.W, this.H);
    this.paper.pixelDensity(1);
    this.paper.loadPixels();
    let seed = 41;
    for (let i = 0; i < this.paper.pixels.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const v = seed >>> 24;
      this.paper.pixels[i] = this.paper.pixels[i + 1] = this.paper.pixels[i + 2] = v > 127 ? 255 : 43;
      this.paper.pixels[i + 3] = v > 127 ? 13 : 11;
    }
    this.paper.updatePixels();
    this.landscapes = this.palettes.map((p, i) => this.paintMeadow(p, i));
    this.leather = createGraphics(540, 635); this.leather.pixelDensity(1);
    this.leather.noStroke(); randomSeed(79);
    // Broad translucent mottling under fine pores, like rubbed and aged leather.
    for (let y = 8; y < 627; y += 7) for (let x = 44; x < 533; x += 7) {
      const n = noise(x * .017, y * .017);
      this.leather.fill(n > .5 ? '#d5ad6520' : '#21150e25');
      this.leather.ellipse(x, y, 22 + n * 24, 18 + n * 20);
    }
    for (let i = 0; i < 12000; i++) {
      this.leather.fill(i % 2 ? '#cfac6620' : '#1f140e24');
      this.leather.ellipse(random(44, 533), random(7, 627), random(.4, 4), random(.4, 3));
    }
  },
  makeDesk() {
    const g = createGraphics(this.W, this.H);
    g.pixelDensity(1); randomSeed(713); noiseSeed(287);
    g.background('#5e432b');
    // Hundreds of translucent grain strokes build up uneven old timber.
    for (let y = 0; y < this.H; y += 2) {
      const n = noise(y * .021);
      g.stroke(65 + n * 69, 43 + n * 46, 26 + n * 29, 150);
      g.strokeWeight(random(1, 3)); g.noFill(); g.beginShape();
      for (let x = -20; x < this.W + 30; x += 20) g.curveVertex(x, y + noise(x * .003, y * .04) * 9);
      g.endShape();
    }
    for (let i = 0; i < 4900; i++) {
      const x = random(this.W), y = random(this.H);
      g.stroke(i % 2 ? '#cda76a18' : '#1f160e32');
      g.strokeWeight(random(.3, 1.3)); g.line(x, y, x + random(7, 160), y + random(-2, 2));
    }
    for (const y of [127, 347, 582, 808]) {
      g.stroke('#21180f'); g.strokeWeight(3); g.line(0, y, this.W, y + 4);
      g.stroke('#b58d5155'); g.strokeWeight(1); g.line(0, y + 4, this.W, y + 7);
      for (const x of [42, 1375]) { g.fill('#302317'); g.noStroke(); g.ellipse(x, y - 12, 5, 4); }
    }
    // Knots in the timber, using nested irregular rings.
    for (const [x, y] of [[1335, 670], [78, 530], [1020, 930]]) {
      g.noFill();
      for (let j = 0; j < 16; j++) {
        g.stroke(38, 26, 17, 45); g.ellipse(x, y, 12 + j * 8, 4 + j * 2.8);
      }
    }
    // A few loose papers underneath the book, rather than a cluttered interface.
    g.push(); g.translate(350, 49); g.rotate(-.15);
    g.noStroke(); g.fill('#c7b88b'); g.rect(-150, -60, 350, 260);
    g.stroke('#877c5838');
    for (let i = 0; i < 14; i++) g.line(-130, 20 + i * 12, 160, 20 + i * 12);
    g.noFill(); g.ellipse(15, 63, 125, 125); g.line(-90, 63, 120, 63); g.line(15, -40, 15, 155); g.pop();
    g.push(); g.translate(720, 970); g.rotate(.15); g.noStroke(); g.fill('#bbab80'); g.rect(-230, -90, 410, 280);
    g.fill('#d0bf95'); g.rotate(-.23); g.rect(-240, -60, 380, 230);
    g.stroke('#82724c55'); g.strokeWeight(1);
    for (let i = 0; i < 7; i++) g.line(-210, -25 + i * 18, 30, -25 + i * 18);
    g.pop();
    return g;
  },
  paintMeadow(p, season) {
    const g = createGraphics(1000, 500); g.pixelDensity(1);
    randomSeed(521 + season); noiseSeed(93);
    g.background(p.ground); g.noStroke();
    const base = color(p.ground), shade = color(p.dark);
    // Broken opaque and translucent marks give a gouache-like painted ground.
    for (let i = 0; i < 17000; i++) {
      const x = random(1000), y = random(500), n = noise(x * .006, y * .008);
      const c = lerpColor(base, shade, constrain((n - .4) * .8, 0, .45));
      c.setAlpha(random(12, 48)); g.fill(c);
      g.push(); g.translate(x, y); g.rotate(-.45 + noise(x * .01, y * .01));
      g.rect(0, 0, random(8, 38), random(1, 4));
      g.fill(239, 224, 154, 22); g.rect(1, 0, random(5, 30), .6); g.pop();
    }
    for (let i = 0; i < 4500; i++) {
      const x = random(1000), y = random(500);
      g.stroke(i % 3 ? '#ede6ad26' : '#38472b19'); g.strokeWeight(random(.4, 1));
      g.line(x, y, x + random(-2, 2), y - random(1, 5));
    }
    // Tree canopies frame the meadow like the initial sheep illustration.
    g.stroke('#443c2c'); g.strokeWeight(4); g.fill('#8e6944');
    g.beginShape(); g.vertex(104, 164); g.vertex(119, 82); g.vertex(134, 82); g.vertex(144, 164); g.endShape(CLOSE);
    g.fill(p.leaf); g.beginShape();
    for (let i = 0; i <= 72; i++) { const a = i * TWO_PI / 72; const rr = 62 + sin(a * 7) * 7; g.vertex(124 + cos(a) * rr, 76 + sin(a) * rr * .8); }
    g.endShape(CLOSE); g.strokeWeight(2); g.line(125, 143, 126, 65); g.line(125, 110, 99, 86); g.line(126, 99, 152, 71); g.noStroke();
    if (season === 0) for (let i = 0; i < 100; i++) {
      const x = random(30, 970), y = random(175, 470);
      g.stroke('#5b7748'); g.strokeWeight(1); g.line(x, y, x, y - 8); g.noStroke();
      g.fill(i % 2 ? '#e8acb2' : '#f5e6bf');
      for (let j = 0; j < 5; j++) g.ellipse(x + cos(j * TWO_PI / 5) * 3, y - 9 + sin(j * TWO_PI / 5) * 3, 4, 5);
      g.fill('#d6ae53'); g.circle(x, y - 9, 3);
    }
    for (let i = 0; i < 310; i++) {
      const x = random(1000), y = random(500);
      if (noise(x * .011, y * .012) < .52) continue;
      g.noStroke(); g.fill(p.flower);
      g.ellipse(x, y, random(1.2, 3), random(1, 2.7));
      if (season === 0) { g.fill('#e8c5b5'); g.ellipse(x + 2, y - 2, 2, 2); }
    }
    return g;
  },
  tree(g, x, y, r, p, season) {
    g.noStroke(); g.fill('#25372424'); g.ellipse(x + 22, y + 20, r * 2, r);
    for (let j = 0; j < 185; j++) {
      const a = random(TWO_PI), d = sqrt(random()) * r;
      const c = lerpColor(color(p.dark), color(p.leaf), random()); c.setAlpha(random(65, 160));
      g.fill(c); g.ellipse(x + cos(a) * d, y + sin(a) * d * .65, random(7, 24), random(4, 15));
      if (season === 3 && j % 3 === 0) { g.fill('#f2edd58e'); g.ellipse(x + cos(a) * d - 3, y + sin(a) * d * .65 - 5, 12, 7); }
      if (season === 0 && j % 12 === 0) { g.fill('#e4c7b8aa'); g.circle(x + cos(a) * d, y + sin(a) * d * .65, 5); }
    }
  },
  pagePath(ctx) {
    ctx.beginPath();
    ctx.moveTo(239, 202); ctx.bezierCurveTo(420, 173, 623, 181, 720, 208);
    ctx.bezierCurveTo(850, 181, 1075, 182, 1230, 210);
    ctx.lineTo(1224, 797); ctx.bezierCurveTo(1040, 816, 845, 790, 720, 820);
    ctx.bezierCurveTo(585, 794, 390, 818, 237, 790); ctx.closePath();
  },
  meadowPath(ctx) {
    // Broken perimeter: the illustration is painted on the paper, not pasted on.
    ctx.beginPath();
    for (let x = 251; x <= 1206; x += 5) {
      const y = 270 + sin(x * .13) * 2 + noise(x * .03) * 6;
      if (x === 251) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let y = 273; y <= 745; y += 5) ctx.lineTo(1202 + noise(y * .05) * 6, y);
    for (let x = 1206; x >= 251; x -= 5) ctx.lineTo(x, 744 + sin(x * .07) * 2 - noise(x * .05) * 5);
    for (let y = 745; y >= 273; y -= 5) ctx.lineTo(251 + noise(y * .04) * 5, y);
    ctx.closePath();
  },
  backdrop() {
    image(this.desk, 0, 0);
    this.gramophone(); this.compass(180, 830); this.candle(1320, 159);
    // A green fountain pen and a red pencil at the lower edge.
    push(); translate(938, 925); rotate(-.55); noStroke();
    fill('#211d15'); rect(-125, 8, 254, 11, 4); fill('#354c39'); rect(-128, 0, 250, 12, 4);
    fill('#b89a52'); rect(80, 0, 6, 12); triangle(120, 0, 142, 6, 120, 12);
    fill('#6a3326'); rect(-99, 25, 235, 7); fill('#c5a370'); triangle(136, 25, 157, 28, 136, 32); pop();
  },
  openBook() {
    const ctx = drawingContext;
    push(); noStroke();
    ctx.shadowColor = '#100c09bb'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18;
    fill('#302219'); rect(213, 181, 1036, 649, 12);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    fill('#62422b'); rect(215, 178, 1033, 642, 9);
    stroke('#9b7545'); strokeWeight(1.5); noFill(); rect(223, 185, 1016, 628, 6);
    // Layered page edges provide restrained depth rather than a glossy 3D surface.
    for (let i = 8; i > 0; i--) {
      ctx.save(); ctx.translate(0, i * 1.8); this.pagePath(ctx);
      ctx.fillStyle = i % 2 ? '#b8aa7e' : '#d0c295'; ctx.fill(); ctx.restore();
    }
    this.pagePath(ctx);
    const grad = ctx.createLinearGradient(230, 0, 1230, 0);
    [[0, '#dacb96'], [.06, '#e9dcaa'], [.43, '#e6d8a7'], [.49, '#b6a375'], [.5, '#897650'], [.515, '#c7b586'], [.57, '#ecdfb2'], [.92, '#e7d9a6'], [1, '#c7b886']].forEach(([v, c]) => grad.addColorStop(v, c));
    ctx.fillStyle = grad; ctx.fill();
    ctx.save(); this.pagePath(ctx); ctx.clip();
    ctx.save(); this.pagePath(ctx); ctx.clip(); ctx.globalAlpha = Story.reveal;
    const season = Story.season;
    image(this.landscapes[season], 235, 185, 998, 635);
    if (Story.previousSeason !== season && Story.seasonBlend < 1) {
      tint(255, (1 - Story.seasonBlend) * 255); image(this.landscapes[Story.previousSeason], 235, 185, 998, 635); noTint();
    }
    noStroke();
    const night = Story.night;
    fill(16, 37, 59, night * 160); rect(235, 185, 998, 635);
    this.nightDetails(night);
    // Snow falls according to elapsed time; noise controls its sideways drift.
    if (season === 3) {
      for (let i = 0; i < 65; i++) {
        const x = 263 + ((i * 71 + noise(i, Story.elapsed * .1) * 40) % 930);
        const y = 278 + ((i * 67 + Story.elapsed * (8 + i % 9)) % 457);
        fill(255, 249, 227, 120); circle(x, y, 1 + i % 3);
      }
    }
    NoiseMechanic.drawClouds(false);
    Flock.draw();
    NoiseMechanic.drawClouds(true);
    ctx.restore();
    ctx.restore();
    // A translucent gutter sits over the painting and all the living ink.
    ctx.save(); this.pagePath(ctx); ctx.clip();
    const crease = ctx.createLinearGradient(680, 0, 758, 0);
    [[0, '#40351f00'], [.42, '#40351f22'], [.51, '#40351f77'], [.56, '#f6e9b02b'], [1, '#40351f00']].forEach(([v, c]) => crease.addColorStop(v, c));
    ctx.fillStyle = crease; ctx.fillRect(678, 195, 82, 630);
    image(this.paper, 0, 0);
    ctx.restore();
    
    pop();
  },
  nightDetails(n) {
    if (n < .03) return;
    noStroke(); fill(242, 233, 180, n * 205); circle(1119, 316, 25);
    fill(45, 66, 72, n * 220); circle(1128, 311, 22);
    for (let i = 0; i < 31; i++) {
      fill(241, 230, 177, n * (70 + 70 * sin(i + Story.elapsed)));
      circle(285 + (i * 173) % 890, 282 + (i * 37) % 100, i % 4 === 0 ? 2.5 : 1.2);
    }
  },
  pageLettering() {
    fill('#786747'); noStroke(); textFont('Georgia, serif'); textAlign(CENTER, CENTER);
    textSize(11); textStyle(NORMAL); text('A  M E A D O W  O F  L I T T L E  W O N D E R S', 481, 236);
    textSize(11); text(this.seasonNames[Story.season] + '   /   ' + (Story.night > .55 ? 'UNDER THE MOON' : 'IN THE SUN'), 973, 236);
    textSize(11); fill('#7b6946'); text('Hold a little sheep. Let a cloud go.', 482, 774);
    text('Some shadows have stories of their own.', 969, 774);
    textSize(13); text('↶', 274, 779); text('↷', 1195, 779);
    textSize(10); text(String(Story.page * 2 + 1).padStart(2, '0'), 680, 789); text(String(Story.page * 2 + 2).padStart(2, '0'), 764, 789);
    stroke('#ad956451'); strokeWeight(1); line(325, 252, 645, 252); line(802, 252, 1139, 252);
    noStroke(); fill('#9d8053'); circle(482, 252, 3); circle(971, 252, 3);
  },
  cover(amount = 0) {
    push(); translate(239, 166); scale(481 / 540, 1);
    if (amount) { translate(540, 0); scale(cos(amount * PI), 1); translate(-540, 0); }
    if (amount > .5) { noStroke(); fill('#e0d1a1'); rect(0, 0, 540, 635, 5); image(this.paper, 0, 0, 540, 635); pop(); return; }
    const ctx = drawingContext;
    ctx.shadowColor = '#110c09ba'; ctx.shadowBlur = 32; ctx.shadowOffsetY = 20;
    noStroke(); fill('#3c291d'); rect(-9, -6, 553, 663, 12);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    for (let i = 0; i < 7; i++) { fill(i % 2 ? '#ad9c70' : '#d2c298'); rect(11, 25 + i * 2, 524, 625, 4); }
    fill('#62482f'); rect(0, 0, 540, 635, 7);
    image(this.leather, 0, 0);
    fill('#392c20'); rect(0, 0, 28, 635, 4);
    stroke('#967547'); strokeWeight(1); noFill(); rect(38, 20, 481, 593, 3);
    textFont('URW Chancery L, cursive'); textStyle(ITALIC); textSize(87);
    textAlign(CENTER, CENTER); noStroke(); fill('#c0a679'); text('sheep', 285, 307); textStyle(NORMAL);
    // Brass clasp: the visible entry point into the story.
    fill('#302218'); rect(504, 291, 54, 65, 6); fill('#997d44'); rect(510, 297, 47, 51, 5);
    fill('#c2a25b'); rect(516, 304, 35, 36, 4); fill('#58452b'); circle(533, 321, 9);
    
    pop();
  },
  pageTurn() {
    if (Story.turn <= 0) return;
    const t = Story.turn, x = 720 + cos(t * PI) * 492;
    push(); noStroke(); const ctx = drawingContext;
    ctx.shadowColor = '#231b1444'; ctx.shadowBlur = 18;
    fill('#e4d5a6'); beginShape(); vertex(720, 208); bezierVertex(760, 178, x, 181 - sin(t * PI) * 80, x, 210);
    vertex(x, 795); bezierVertex(x, 797, 760, 780, 720, 820); endShape(CLOSE);
    ctx.shadowBlur = 0;
    stroke('#a790592b'); line(x + 3, 214, x + 3, 786); pop();
  },
  gramophone() {
    push(); translate(129, 160); rotate(-.12); noStroke();
    fill('#252822'); rect(-83, -65, 178, 123, 7); fill('#b9b69a'); rect(-76, -59, 164, 102, 3);
    fill('#d8cca4'); rect(-70, -53, 152, 33); fill('#b38d52'); rect(-70, -20, 152, 48);
    fill('#242b26'); rect(-58, -14, 128, 35, 3);
    for (const x of [-32, 43]) { fill('#a8a58a'); circle(x, 3, 28); fill('#353a30'); circle(x, 3, 20);
      push(); translate(x, 3); rotate(MusicBox.playing ? Story.elapsed : 0); fill('#c4bd98'); for (let i = 0; i < 6; i++) { rotate(PI / 3); rect(6, -2, 5, 4); } pop(); }
    fill('#766b4e'); textSize(12); textAlign(LEFT); text('sheep · side A', -61, -31);
    fill('#8a8972'); for (const x of [-70, 80]) { circle(x, 46, 8); fill('#272a24'); circle(x,46,3); }
    fill('#cab88c'); textAlign(CENTER); textSize(18); text(MusicBox.playing ? 'Ⅱ' : '▷', -8, 78); text('›', 54, 78);
    noFill(); stroke('#282a22'); strokeWeight(2); bezier(23, 55, 114, 110, -50, 120, 32, 162); pop();
  },
  compass(x, y) {
    push(); translate(x, y); rotate(-.22); noStroke();
    drawingContext.shadowColor = '#17130c88'; drawingContext.shadowBlur = 14; drawingContext.shadowOffsetY = 8;
    fill('#433a24'); circle(0, 0, 171); drawingContext.shadowBlur = 0; drawingContext.shadowOffsetY = 0;
    fill('#ae9552'); circle(0, 0, 160); fill('#665932'); circle(0, 0, 149); fill('#c0af78'); circle(0, 0, 133);
    noFill(); stroke('#7c7049'); circle(0, 0, 119); circle(0, 0, 104);
    for (let i = 0; i < 60; i++) { const a = i * TWO_PI / 60; line(cos(a) * 59, sin(a) * 59, cos(a) * (i % 5 ? 55 : 49), sin(a) * (i % 5 ? 55 : 49)); }
    textAlign(CENTER, CENTER); noStroke(); fill('#615638'); textSize(12);
    ['N', 'E', 'S', 'W'].forEach((s, i) => text(s, sin(i * HALF_PI) * 40, -cos(i * HALF_PI) * 40));
    rotate(.7); fill('#635332'); triangle(0, -51, -9, 9, 9, 9); fill('#e3d29a'); triangle(0, 51, -9, -9, 9, -9);
    fill('#635332'); circle(0, 0, 11); fill('#d6c58a'); circle(0, 0, 4); pop();
  },
  candle(x, y) {
    push(); translate(x, y); noStroke();
    fill('#29251a77'); ellipse(10, 20, 104, 49); fill('#806b3e'); ellipse(0, 0, 84, 43);
    fill('#ae965c'); ellipse(0, -6, 77, 34); fill('#d5c38b'); rect(-20, -74, 40, 69, 6);
    fill('#e7d8a4'); ellipse(0, -73, 40, 17); fill('#605033'); ellipse(0, -73, 19, 6);
    fill('#f3c771'); ellipse(0, -91, 14 + sin(Story.elapsed * 4), 31); fill('#fff0ba'); ellipse(0, -86, 6, 18);
    for (let i = 6; i > 0; i--) { fill(255, 211, 111, 3); circle(0, -88, i * 29); } pop();
  },
  finish() {
    const ctx = drawingContext;
    const vignette = ctx.createRadialGradient(710, 450, 200, 720, 490, 880);
    vignette.addColorStop(0, '#1a130c00'); vignette.addColorStop(.6, '#1a130c12'); vignette.addColorStop(1, '#120e0acc');
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, this.W, this.H);
    noStroke(); fill('#c8b181'); textFont('Georgia, serif'); textAlign(LEFT, CENTER); textSize(12); text('THE SHEEP', 247, 887);
    textSize(10); fill('#b6a17c'); textStyle(ITALIC); text('An enchanted field journal', 247, 909); textStyle(NORMAL);
    textAlign(RIGHT, CENTER); textSize(10); text(Story.open ? 'a little patience, a little wonder' : 'a story is waiting to unfold', 1225, 890);
  }
};
