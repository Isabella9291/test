/* Shared landscape geometry. ChatGPT-assisted: matching painter and placement bounds. */
window.SceneGeometry = {
  trees: [{x:325,y:465,r:44},{x:1005,y:458,r:48},{x:1150,y:560,r:43}],
  horizon(u) { return 170 + 34*Math.exp(-Math.pow((u-640)/120,2)) - 14*Math.sin(u*.006); },
  groundY(x) { return 185 + this.horizon((x-235)/998*1000)*635/500; },
  musicHit(x,y) { return x>281 && x<380 && y>657 && y<750; },
  isBlocked(x,y,margin=0) {
    return y<this.groundY(x)+margin ||
      this.trees.some(t=>Math.hypot(x-t.x,(y-(t.y-34))*1.1)<t.r+margin) ||
      (x>275-margin && x<390+margin && y>630-margin && y<758+margin);
  },
  constrainGround(x,y,margin,bounds) {
    y=Math.max(y,this.groundY(x)+margin+2);
    for(let pass=0;pass<2;pass++) for(const t of this.trees){
      const dx=x-t.x,dy=y-(t.y-34),d=Math.hypot(dx,dy),radius=t.r+margin+2;
      if(d<radius){x=t.x+(d?dx/d:1)*radius;y=t.y-34+(d?dy/d:0)*radius;}
    }
    if(x>275-margin && x<390+margin && y>630-margin)x=392+margin;
    return {x:Math.max(bounds.left,Math.min(bounds.right,x)),y:Math.max(bounds.top,Math.min(bounds.bottom,y))};
  }
};
