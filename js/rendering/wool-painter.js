/* ChatGPT-assisted procedural wool painting. Video references supplied by user:
 * second clip (620459...mp4): round ivory volumes against blue; uploaded ZIP:
 * noise-random.js releaseSheep/updateCloud: continuous inflation and rising phase.
 * Reimplemented for this project's entities; no imported code is executed. */
window.WoolPainter={
  sprites:[],
  init(){
    for(let night=0;night<2;night++)for(let variant=0;variant<8;variant++){
      const g=createGraphics(160,140);g.pixelDensity(2);const c=g.drawingContext;
      let seed=891+variant*713;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
      const lobes=[];
      for(let i=0;i<11;i++){const a=i*Math.PI*2/11;lobes.push({x:80+Math.cos(a)*37,y:66+Math.sin(a)*25,r:21+rand()*5});}
      lobes.push({x:61,y:62,r:27},{x:90,y:69,r:29},{x:92,y:48,r:27},{x:68,y:44,r:25});
      lobes.sort((a,b)=>b.y-a.y);
      for(const p of lobes){
        const grad=c.createRadialGradient(p.x-p.r*.33,p.y-p.r*.43,p.r*.08,p.x,p.y,p.r);
        [[0,night?'#e4edf0':'#fffef1'],[.42,night?'#d4e1e7':'#f7f7e9'],[.78,night?'#a5bdcf':'#dce5e2'],[1,night?'#718fa8':'#bdcdd0']].forEach(([v,k])=>grad.addColorStop(v,k));
        c.fillStyle=grad;c.beginPath();c.ellipse(p.x,p.y,p.r,p.r*.9,0,0,Math.PI*2);c.fill();
      }
      c.save();c.globalCompositeOperation='source-atop';
      const whole=c.createRadialGradient(60,30,5,80,64,75);
      whole.addColorStop(0,night?'#e4edf08c':'#fffef18c');whole.addColorStop(.55,'#e6ece329');whole.addColorStop(1,night?'#648baa70':'#8caab86b');
      c.fillStyle=whole;c.fillRect(0,0,160,140);c.restore();
      // Short, curved, low-contrast bristle marks sit over shaded rounded volumes.
      for(let i=0;i<1250;i++){
        const x=24+rand()*111,y=14+rand()*96;
        if(!lobes.some(p=>Math.hypot(x-p.x,(y-p.y)/.9)<p.r-2))continue;
        const bright=rand()>.4;c.strokeStyle=bright?'#fffef330':'#718b9b19';c.lineWidth=.35+rand()*.5;
        c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-3,x+4+rand()*2,y-1);c.stroke();
      }
      this.sprites.push(g);
    }
  },
  draw(variant,x,y,w,h,night=0){
    const id=Math.floor(variant)%8;
    image(this.sprites[id],x-w/2,y-h/2,w,h);
    if(night>.01){push();tint(255,night*255);image(this.sprites[id+8],x-w/2,y-h/2,w,h);pop();}
  }
};
