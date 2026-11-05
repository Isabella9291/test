/* ChatGPT-assisted Canvas 2D material study. All imagery is drawn in code.
 * Layered opaque colour, local shading, scumbling and edge highlights form the
 * painted CG desk. Canvas gradients: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D */
window.PaintedDesk = {
  create() {
    const g=createGraphics(1440,1000);g.pixelDensity(1);const c=g.drawingContext;
    let seed=27831; const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const gradient=(x,y,x2,y2,stops)=>{const a=c.createLinearGradient(x,y,x2,y2);stops.forEach(([p,v])=>a.addColorStop(p,v));return a;};
    const box=(x,y,w,h,r,ink)=>{c.fillStyle=ink;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
    const ellipse=(x,y,rx,ry,ink)=>{c.fillStyle=ink;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
    const line=(x,y,xx,yy,ink,width=1)=>{c.strokeStyle=ink;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();};
    const shade=(blur=15,x=5,y=10)=>{c.shadowColor='#100f0cbb';c.shadowBlur=blur;c.shadowOffsetX=x;c.shadowOffsetY=y;};
    const clear=()=>{c.shadowBlur=0;c.shadowOffsetX=c.shadowOffsetY=0;};
    const scumble=(x,y,w,h,n,ink)=>{c.fillStyle=ink;for(let i=0;i<n;i++){const xx=x+rand()*w,yy=y+rand()*h;c.fillRect(xx,yy,.3+rand()*7,.25+rand()*1.5);}};
    // Broad planks: flowing grain follows knots, with individual colour temperatures.
    box(0,0,1440,1000,0,'#59412c');
    const edges=[0,127,347,582,808,1000];
    for(let board=0;board<5;board++){
      const top=edges[board],h=edges[board+1]-top;
      c.fillStyle=gradient(0,top,1350,top+h,[[0,'#967549'],[.3,'#8c6940'],[.65,'#5b442e'],[1,'#42382b']]);c.fillRect(0,top,1440,h);
      for(let j=0;j<h;j+=1.2){const y=top+j;c.beginPath();
        for(let x=0;x<=1460;x+=12){const yy=y+Math.sin(x*.004+j*.09)*3+Math.sin(x*.019+j*.021)*1.8; x?c.lineTo(x,yy):c.moveTo(x,yy);}
        c.strokeStyle=j%5<2?'#201d1730':'#d2a46b26';c.lineWidth=.3+rand()*1.4;c.stroke();}
      scumble(0,top,1440,h,1000,'#dec18a18');scumble(0,top,1440,h,1100,'#211f191b');
      line(0,top+2,1440,top+2,'#29261d',3);line(0,top+5,1440,top+5,'#bea07066');
    }
    for(const [x,y] of [[74,510],[1330,660],[1090,946]]){
      c.save();c.translate(x,y);for(let i=1;i<24;i++){c.beginPath();c.ellipse(0,0,i*4,i*1.25,0,0,Math.PI*2);c.strokeStyle='#2f2c2044';c.lineWidth=.7;c.stroke();}c.restore();
    }
    // Scattered papers retain their established positions, with fold and cut edges.
    const paper=(x,y,w,h,a)=>{c.save();c.translate(x,y);c.rotate(a);shade(14,4,8);
      box(-w/2,-h/2,w,h,1,gradient(-w/2,-h/2,w/2,h/2,[[0,'#e8dbb3'],[.55,'#cebc8d'],[1,'#97876b']]));clear();
      scumble(-w/2,-h/2,w,h,2200,'#776b4c12');line(-w/2+2,-h/2+2,w/2-2,-h/2+2,'#fff0c6b0');
      c.strokeStyle='#6b705336';c.lineWidth=.7;for(let i=0;i<10;i++)line(-w/2+20,-h/2+35+i*16,w/2-30,-h/2+35+i*16,'#74725330');
      c.restore();};
    paper(372,100,350,260,-.15);paper(705,980,410,220,.15);paper(688,1005,390,210,-.08);
    c.save();c.translate(366,116);c.rotate(-.15);c.strokeStyle='#77755255';c.lineWidth=.7;c.beginPath();c.arc(0,0,62,0,Math.PI*2);c.stroke();line(-90,0,100,0,'#77755255');line(0,-90,0,90,'#77755255');c.restore();
    // Cassette: bevelled dark shell, paper label, visible reels and worn screws.
    c.save();c.translate(129,160);c.rotate(-.12);shade(16,7,11);
    box(-84,-65,182,128,8,'#171e1b');clear();
    box(-84,-69,178,122,7,gradient(-84,-69,94,53,[[0,'#5d6559'],[.18,'#303a32'],[.8,'#171f1a'],[1,'#54564a']]));
    box(-76,-60,161,99,3,gradient(0,-60,0,39,[[0,'#e1d5ae'],[.65,'#c6bc97'],[1,'#a79f7d']]));
    box(-71,-21,151,45,1,'#ad8553');box(-60,-14,129,35,4,'#101b18');
    for(const x of [-32,43]){ellipse(x,3,16,16,'#c0b78e');ellipse(x,3,12,12,'#242d26');
      for(let a=0;a<6;a++){c.save();c.translate(x,3);c.rotate(a*Math.PI/3);box(7,-2,5,4,0,'#d8cda5');c.restore();}}
    line(-14,4,25,4,'#626c55',.7);c.fillStyle='#545842';c.font='italic 12px Georgia,serif';c.fillText('sheep · side A',-61,-35);
    for(const [x,y] of [[-73,-56],[83,-56],[-73,42],[83,42]]){ellipse(x,y,3,3,'#a2a38e');line(x-1,y-2,x+1,y+2,'#242e26');}
    for(let i=0;i<14;i++)line(-74,-66+i*.7,82,-66+i*.7,'#d1c8a61c');
    scumble(-82,-64,174,116,1200,'#b9bba022');scumble(-70,-57,145,32,300,'#5a604225');
    c.strokeStyle='#25281e';c.lineWidth=2;c.beginPath();c.moveTo(23,55);c.bezierCurveTo(114,110,-50,120,32,162);c.stroke();c.restore();
    // Brass compass is a painted metal object with glass, not concentric flat disks.
    c.save();c.translate(180,830);c.rotate(-.22);shade(20,9,13);ellipse(0,4,88,87,'#342e20');clear();
    ellipse(0,0,85,85,gradient(-65,-75,65,80,[[0,'#f1d296'],[.2,'#c4a363'],[.45,'#695a35'],[.65,'#b69955'],[1,'#413b27']]));
    ellipse(0,0,76,76,'#6d633f');ellipse(0,0,70,70,gradient(-45,-55,60,65,[[0,'#dbcd9d'],[.55,'#b6aa7b'],[1,'#807956']]));
    for(let i=0;i<120;i++){const a=i*Math.PI/60,r=i%10?65:59;line(Math.sin(a)*68,Math.cos(a)*68,Math.sin(a)*r,Math.cos(a)*r,'#696548',i%10?.5:1);}
    c.fillStyle='#565640';c.font='12px Georgia,serif';c.textAlign='center';['N','E','S','W'].forEach((v,i)=>c.fillText(v,Math.sin(i*Math.PI/2)*45,-Math.cos(i*Math.PI/2)*45+4));
    c.save();c.rotate(.7);c.fillStyle='#364238';c.beginPath();c.moveTo(0,-54);c.lineTo(-8,7);c.lineTo(8,7);c.fill();c.fillStyle='#d6d0af';c.beginPath();c.moveTo(0,54);c.lineTo(-8,-7);c.lineTo(8,-7);c.fill();ellipse(0,0,5,5,'#8e804d');c.restore();
    c.save();c.beginPath();c.arc(0,0,70,0,Math.PI*2);c.clip();c.fillStyle=gradient(-70,-70,70,70,[[0,'#fff6d54a'],[.35,'#ffffdc08'],[.6,'#23352b08'],[1,'#18291c55']]);c.fillRect(-70,-70,140,140);
    line(-55,-21,27,-56,'#ffffe42b',8);scumble(-70,-70,140,140,600,'#4d513817');c.restore();
    for(let i=0;i<80;i++){const a=rand()*Math.PI*2,r=78+rand()*5;line(Math.cos(a)*r,Math.sin(a)*r,Math.cos(a+.025)*r,Math.sin(a+.025)*r,'#ebd59c66',.7);}c.restore();
    // Beeswax with warm translucent edges and a heavy brass saucer.
    c.save();c.translate(1320,159);shade(16,8,10);ellipse(0,0,45,21,'#50472c');clear();
    ellipse(0,-5,43,19,gradient(-35,-20,35,12,[[0,'#d8ba72'],[.5,'#8a783f'],[1,'#4e482c']]));
    box(-20,-75,40,69,5,gradient(-20,0,20,0,[[0,'#8f8251'],[.22,'#ddcb8d'],[.5,'#e3d39a'],[1,'#96885c']]));
    scumble(-19,-71,38,63,650,'#88774620');ellipse(0,-74,20,8,'#e5d49b');ellipse(1,-74,10,4,'#96814e');
    for(const [x,y] of [[-13,-42],[-4,-58],[10,-53]]){line(x,-71,x,y,'#ecda9d',4);ellipse(x,y,2.5,4,'#e0cc8f');}
    line(0,-75,1,-83,'#383627',2);c.restore();
    // Lacquer and exposed wood give the pens small, legible material changes.
    c.save();c.translate(938,925);c.rotate(-.55);shade(5,2,5);
    box(-128,0,250,12,5,gradient(0,0,0,12,[[0,'#9da98a'],[.25,'#4d6852'],[.55,'#304b39'],[1,'#172d23']]));clear();
    box(80,0,6,12,0,'#bfa367');c.fillStyle='#c0aa73';c.beginPath();c.moveTo(120,0);c.lineTo(142,6);c.lineTo(120,12);c.fill();line(122,6,139,6,'#615b37');line(-120,2,76,2,'#d2d6b04a');
    box(-99,25,235,7,1,gradient(0,25,0,32,[[0,'#be8050'],[.4,'#945336'],[1,'#582f24']]));c.fillStyle='#c7a46e';c.beginPath();c.moveTo(136,25);c.lineTo(157,28);c.lineTo(136,32);c.fill();line(152,28,157,28,'#37372d',2);c.restore();
    // Broad ambient warm light and cool shadow unify all painted materials.
    const glow=c.createRadialGradient(250,65,30,470,270,1100);glow.addColorStop(0,'#fbe2a62b');glow.addColorStop(.5,'#e8c68908');glow.addColorStop(1,'#14232235');c.fillStyle=glow;c.fillRect(0,0,1440,1000);
    return g;
  },
  movingDetails(){
    push();translate(1320,159);noStroke();fill('#eeb66d');ellipse(0,-91,11+sin(Story.elapsed*3)*.6,27);fill('#fff0b4');ellipse(0,-88,5,16);pop();
    push();translate(129,160);rotate(-.12);fill('#d4c291');noStroke();textAlign(CENTER,CENTER);textSize(18);text(MusicBox.playing?'Ⅱ':'▷',-8,73);text('›',54,73);
    if(MusicBox.playing) for(const x of [-32,43]){push();translate(x,3);rotate(Story.elapsed*.8);stroke('#e2d8ac');strokeWeight(1.5);line(-7,0,7,0);pop();}pop();
  }
};
Book.makeDesk=function(){return PaintedDesk.create();};
Book.backdrop=function(){image(this.desk,0,0);PaintedDesk.movingDetails();};
