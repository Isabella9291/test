/* Visual drawing helpers. Created with ChatGPT assistance: procedural wood,
 * leather, paper and painted scenery; no generated background images are used.
 * p5 drawing API: https://p5js.org/reference/ */
window.Book = {
  W: 1440, H: 1000, viewScale: 1.17,
  toPage(x,y){return {x:720+(x-720)/this.viewScale,y:500+(y-500)/this.viewScale};},
  toScreen(x,y){return {x:720+(x-720)*this.viewScale,y:500+(y-500)*this.viewScale};}, seasonNames: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
  palettes: [
    { ground: '#99ab70', dark: '#405c3b', leaf: '#68834b', flower: '#e1c9b4' },
    { ground: '#9ca35b', dark: '#3f5436', leaf: '#607943', flower: '#efdf9f' },
    { ground: '#b7a173', dark: '#63553b', leaf: '#9b673d', flower: '#d2a35c' },
    { ground: '#c6c9b7', dark: '#52605b', leaf: '#7d8b7f', flower: '#f4f0da' }
  ],
  setPalette(index){
    // Keep the chosen green meadow; the blue reference informs wool shading only.
    index=1;
    this.artPalette=index;
    const grounds=['#99ab70','#9ca35b','#a6a16b','#c6c9b7'];
    this.palettes=this.palettes.map((p,i)=>({...p,ground:grounds[i],dark:'#405c3b'}));
    if(!this.paintingCache)this.paintingCache={};
    if(!this.paintingCache[index])this.paintingCache[index]=this.palettes.map((p,i)=>this.paintMeadow(p,i));
    this.landscapes=this.paintingCache[index];
  },
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
      this.paper.pixels[i + 3] = v > 127 ? 5 : 4;
    }
    this.paper.updatePixels();
    // Cached uneven brush grain, reused inside material masks without flickering.
    this.brush = createGraphics(256,256); this.brush.pixelDensity(1); this.brush.loadPixels();
    for (let y=0;y<256;y++) for(let x=0;x<256;x++) {
      const i=(y*256+x)*4, n=noise(x*.06,y*.09);
      const ridge=sin(x*.8+y*.34+noise(x*.02,y*.02)*18);
      const v=constrain(128+(n-.5)*210+ridge*20,0,255);
      this.brush.pixels[i]=v; this.brush.pixels[i+1]=v*.95; this.brush.pixels[i+2]=v*.82; this.brush.pixels[i+3]=90;
    } this.brush.updatePixels();
    this.setPalette(0);
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
  paintMeadow(p, season) {
    const g = createGraphics(1000, 500); g.pixelDensity(1);
    randomSeed(521 + season); noiseSeed(93);
    const sky=['#bcd5d5','#a7ccd5','#d2c8c1','#c7d6df'][season];
    g.background(sky);g.noStroke();
    // A lightly scumbled sky above the hills; preserve the existing painted surface.
    for(let i=0;i<2100;i++){
      const x=random(1000),y=random(220);g.fill(245,239,214,random(3,12));
      g.rect(x,y,random(6,35),random(.5,2));
    }
    g.fill(p.ground);g.beginShape();g.vertex(0,500);
    for(let x=0;x<=1000;x+=5)g.vertex(x,SceneGeometry.horizon(x));
    g.vertex(1000,500);g.endShape(CLOSE);
    const base = color(p.ground), shade = color(p.dark);
    // Broken opaque and translucent marks give a gouache-like painted ground.
    for (let i = 0; i < 8000; i++) {
      const x = random(1000), y = random(500), n = noise(x * .006, y * .008);
      if(y<SceneGeometry.horizon(x)+2)continue;
      const c = lerpColor(base, shade, constrain((n - .25) * 1.2, 0, .68));
      c.setAlpha(random(65, 150)); g.fill(c);
      g.push(); g.translate(x, y); g.rotate(-.45 + noise(x * .01, y * .01));
      const length = random(12, 48), breadth = random(3, 10);
      g.beginShape(); g.vertex(0, 0); g.vertex(length * .82, -1); g.vertex(length, breadth * .3); g.vertex(length - 3, breadth); g.vertex(2, breadth + 1); g.endShape(CLOSE);
      for (let bristle = 0; bristle < 4; bristle++) {
        g.stroke(220, 220, 160, 28); g.strokeWeight(.5); g.line(2, bristle * breadth / 4, length - random(1, 7), bristle * breadth / 4 - 1);
      } g.noStroke();
      g.fill(this.artPalette===1?'#efe09a16':'#c0d8fa16'); g.rect(1, 0, random(5, 30), .6); g.pop();
    }
    for (let i = 0; i < 4500; i++) {
      const x = random(1000), y = random(500);
      if(y<SceneGeometry.horizon(x)+2)continue;
      g.stroke(i % 3 ? '#ede6ad26' : '#38472b19'); g.strokeWeight(random(.4, 1));
      g.line(x, y, x + random(-2, 2), y - random(1, 5));
    }

    if (season === 0) for (let i = 0; i < 100; i++) {
      const x = random(30, 970), y = random(175, 470);
      if (y < SceneGeometry.horizon(x)+12) continue;
      g.stroke('#5b7748'); g.strokeWeight(1); g.line(x, y, x, y - 8); g.noStroke();
      g.fill(i % 2 ? '#e8acb2' : '#f5e6bf');
      for (let j = 0; j < 5; j++) g.ellipse(x + cos(j * TWO_PI / 5) * 3, y - 9 + sin(j * TWO_PI / 5) * 3, 4, 5);
      g.fill('#d6ae53'); g.circle(x, y - 9, 3);
    }
    for (let i = 0; i < 310; i++) {
      const x = random(1000), y = random(500);
      if(y<SceneGeometry.horizon(x)+2)continue;
      if (noise(x * .011, y * .012) < .52) continue;
      g.noStroke(); g.fill(p.flower);
      g.ellipse(x, y, random(1.2, 3), random(1, 2.7));
      if (season === 0) { g.fill('#e8c5b5'); g.ellipse(x + 2, y - 2, 2, 2); }
    }
    for(const tree of SceneGeometry.trees)this.paintTree(g,tree,p,season);
    this.paintPageMusic(g);
    return g;
  },
  paintTree(g,tree,p,season){
    const x=(tree.x-235)/998*1000,y=(tree.y-185)/635*500,r=tree.r*.85;
    g.noStroke();g.fill('#3048312b');g.ellipse(x+17,y+7,r*1.7,r*.4);
    g.fill('#795d40');g.rect(x-5,y-42,10,48,4);g.stroke('#c1a27588');g.strokeWeight(1);g.line(x-2,y-30,x-2,y+2);g.noStroke();
    const leaf=[p.leaf,'#4f754c','#ac7950','#9bab9e'][season];
    for(let i=0;i<55;i++){
      const a=i*2.399,d=sqrt(random())*r*.78,xx=x+cos(a)*d,yy=y-42+sin(a)*d*.75;
      const col=lerpColor(color(p.dark),color(leaf),.3+random()*.7);g.fill(col);g.ellipse(xx,yy,random(15,30),random(13,25));
    }
    for(let i=0;i<320;i++){
      const a=random(TWO_PI),d=sqrt(random())*r,xx=x+cos(a)*d,yy=y-45+sin(a)*d*.8;
      const col=lerpColor(color(leaf),color(season===3?'#f4f1de':'#b5bf80'),random()*.65);col.setAlpha(random(30,120));g.fill(col);
      g.push();g.translate(xx,yy);g.rotate(random(-1,1));g.rect(0,0,random(2,6),random(1,3));g.pop();
    }
    if(season===3){g.fill('#edf0dfb0');g.ellipse(x-6,y-62,r*1.4,r*.4);}
  },
  paintPageMusic(g){
    // Small painted gramophone matches the reference's lower-left composition.
    const x=(330-235)/998*1000,y=(718-185)/635*500;
    g.push();g.translate(x,y);g.noStroke();g.fill('#3c3a2933');g.ellipse(4,16,86,24);
    g.fill('#87613f');g.rect(-33,-8,67,30,4);g.fill('#b38a55');g.rect(-33,-11,67,19,4);
    g.fill('#343c35');g.ellipse(0,-3,39,15);g.fill('#bdac73');g.ellipse(0,-3,11,4);
    g.noFill();g.stroke('#846339');g.strokeWeight(5);g.bezier(20,-5,39,-24,10,-37,9,-48);
    g.noStroke();g.fill('#b38d50');g.triangle(11,-36,-14,-61,30,-61);g.fill('#d4bc7c');g.ellipse(8,-61,45,15);g.fill('#7d7046');g.ellipse(8,-61,32,8);g.pop();
  },
  pagePath(ctx) {
    ctx.beginPath();
    ctx.moveTo(239, 202); ctx.bezierCurveTo(420, 173, 623, 181, 720, 208);
    ctx.bezierCurveTo(850, 181, 1075, 182, 1230, 210);
    ctx.lineTo(1224, 797); ctx.bezierCurveTo(1040, 816, 845, 790, 720, 820);
    ctx.bezierCurveTo(585, 794, 390, 818, 237, 790); ctx.closePath();
  },
  openBook() {
    const ctx = drawingContext;
    push(); noStroke();
    ctx.shadowColor = '#100c09bb'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18;
    fill('#302219'); rect(213, 181, 1036, 649, 12);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    fill('#60472e'); rect(215,178,1033,642,9);
    this.patina(215,178,1033,642,.65);
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
    const volume=ctx.createLinearGradient(237,0,1224,0);
    [[0,'#493f3140'],[.025,'#f5e5b32a'],[.18,'#fff0c30c'],[.44,'#342d2414'],[.488,'#322e2650'],[.50,'#302b2480'],[.525,'#e4d4a326'],[.72,'#fff4ca05'],[.975,'#7d735527'],[1,'#3b382e44']].forEach(([p,c])=>volume.addColorStop(p,c));
    ctx.fillStyle=volume;ctx.fillRect(237,185,998,635);
    image(this.paper, 0, 0);
    ctx.restore();
    
    pop();
  },
  nightDetails(n) {
    push();noStroke();
    fill(249,222,143,(1-n)*230);circle(1055,276,39);
    fill(255,239,183,(1-n)*55);circle(1052,273,30);pop();
    if (n < .03) return;
    noStroke(); fill(242, 233, 180, n * 205); circle(1119, 316, 25);
    fill(45, 66, 72, n * 220); circle(1128, 311, 22);
    for (let i = 0; i < 31; i++) {
      fill(241, 230, 177, n * (70 + 70 * sin(i + Story.elapsed)));
      circle(285 + (i * 173) % 890, 282 + (i * 37) % 100, i % 4 === 0 ? 2.5 : 1.2);
    }
  },
  cover(amount = 0) {
    push(); translate(720, 185);
    const eased = amount * amount * (3 - 2 * amount);
    drawingContext.transform(cos(eased * PI), -sin(eased * PI) * .09, 0, 1, 0, 0);
    scale(lerp(510, 495, eased) / 540, 1);
    if (amount > .5) {
      // The inside of a cover is still a rigid leather board with an inset liner,
      // not a loose sheet. Keep its rim, sidewall and thickness until it lies flat.
      const ctx=drawingContext;
      ctx.shadowColor='#17140d66';ctx.shadowBlur=12;ctx.shadowOffsetY=8;
      noStroke();fill('#33271e');rect(-9,-6,553,663,10);
      ctx.shadowBlur=0;ctx.shadowOffsetY=0;
      fill('#62482f');rect(-5,-5,545,646,8);image(this.leather,0,0);
      noFill();stroke('#a38655');strokeWeight(1);rect(3,3,530,628,5);
      noStroke();fill('#c5b58a');rect(11,20,518,608,4);
      fill('#e0d1a1');rect(14,22,511,601,3);
      ctx.save();ctx.beginPath();ctx.rect(14,22,511,601);ctx.clip();
      image(this.paper,0,0,540,635);ctx.restore();
      stroke('#9a895e66');strokeWeight(1);line(523,24,523,620);
      pop();return;
    }
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
  openingFrame() {
    // The page block stays on the table. Only the front cover rotates about its spine.
    const ctx = drawingContext;
    ctx.save(); ctx.beginPath(); ctx.rect(720, 150, 600, 730); ctx.clip(); this.openBook(); ctx.restore();
    this.cover(Story.opening);
    if (abs(Story.opening-.5)<.04) {
      push();stroke('#51402c');strokeWeight(4);line(720,180,720,829);pop();
    }
    if (Story.opening > .94) {
      ctx.save(); ctx.beginPath(); ctx.rect(180, 150, 540, 730); ctx.clip();
      ctx.globalAlpha = (Story.opening - .94) / .06; this.openBook(); ctx.restore();
    }
  },
  pageTurn() {
    if (Story.turn <= 0) return;
    const t = Story.turn * Story.turn * (3 - 2 * Story.turn);
    const direction = Story.turnKind === 'season' ? 1 : -1;
    const angle = t * PI, ctx = drawingContext;
    // A bent sheet is drawn as adjacent strips, anchored to the unchanged spine.
    const point = (u, bottom) => ({
      x: 720 + direction * (cos(angle) * 492 * u + sin(angle) * 70 * sin(PI * u)),
      y: (bottom ? 820 - 23 * u : 208 - 10 * u) - sin(angle) * 62 * sin(u * HALF_PI)
    });
    ctx.save(); ctx.shadowColor = '#382b1935'; ctx.shadowBlur = 14;
    for (let i = 0; i < 40; i++) {
      const u = i / 40, v = (i + 1) / 40;
      const a = point(u, false), b = point(v, false), c = point(v, true), d = point(u, true);
      const shade = 1 - sin(angle) * .14 * sin(u * PI);
      ctx.fillStyle = `rgb(${230 * shade},${216 * shade},${170 * shade})`;
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.lineTo(d.x,d.y); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },
  patina(x,y,w,h,strength=.5,oval=false) {
    const ctx=drawingContext; ctx.save(); ctx.beginPath();
    if(oval) ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,TWO_PI); else ctx.rect(x,y,w,h);
    ctx.clip(); ctx.globalAlpha *= strength; ctx.globalCompositeOperation='multiply';
    image(this.brush,x,y,w,h); ctx.restore();
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
