
import minibot from 'minibot';
import EngineConstants from 'app/engine/EngineConstants';
import DisplayComponent from 'app/engine/component/core/DisplayComponent';
import ComponentMessage from 'app/engine/component/core/ComponentMessage';
import Engine from 'app/engine/Engine';
import ResourceType from 'app/resource/ResourceType';
import CandyType from 'app/engine/enum/CandyType';

class SpriteResource extends DisplayComponent
{
  
  // bow: null,

  // candyMap: null,
  
  constructor()
  {
    $super();
    
  }
  
  onAddedToObject()
  {
    this.setProperty("dLocation", 0);
  }
  
  onAddedToSystem()
  {

  }
  
  onResourcesLoaded()
  {
    this.bow = this.getResource(ResourceType.SPRITE, "object.bow");

    this.candyMap = {};
    this.candyMap[CandyType.A] = this.getResource(ResourceType.SPRITE, "object.candy.01");
    this.candyMap[CandyType.B] = this.getResource(ResourceType.SPRITE, "object.candy.02");
    this.candyMap[CandyType.C] = this.getResource(ResourceType.SPRITE, "object.candy.03");
    this.candyMap[CandyType.D] = this.getResource(ResourceType.SPRITE, "object.candy.04");
    this.candyMap[CandyType.E] = this.getResource(ResourceType.SPRITE, "object.candy.05");
    this.candyMap[CandyType.F] = this.getResource(ResourceType.SPRITE, "object.candy.06");
    this.candyMap[CandyType.G] = this.getResource(ResourceType.SPRITE, "object.candy.07");

  }
  
  update(dt)
  {
    
  }
  
  render(dt, x, y)
  {
    var zoom = 10 - this.system.getZoomLevel();
    var viewport = this.system.getViewport();
    var scene = this.system.getScene();
    
    var a = this.getProperty("dLocation");
    
    var r = 400 * EngineConstants.R;

    var bw = this.bow.w * EngineConstants.R;
    var bh = this.bow.h * EngineConstants.R;
    var bx = x + (viewport.w/2) + (r * Math.cos(a));
    var by = y + (viewport.h/2) - (r * Math.sin(a));
    
    //scene.drawRect("", x - s/2, y - s/2, s, s);
    var _a = (a*-1) - (3*Math.PI/4);

    scene.save();
    scene.translate(bx, by);
    scene.rotate(_a);
    // draw bow
    scene.drawImage(
      this.bow.img,
      this.bow.x, //sx,
      this.bow.y, //sy,
      this.bow.w, //sw,
      this.bow.h, //sh,
      bw/-2, //dx,
      bh/-2, //dy,
      bw, //dw,
      bh //dh
    );
    scene.restore();

    var candy = this.candyMap[this.getProperty('nextPiece')];
    var candys = EngineConstants.WorldToScreenS(CursorDisplayComponent.CANDY_H);
    var candyr = EngineConstants.WorldToScreenR(CursorDisplayComponent.CANDY_H);
    var candyx = x + (viewport.w/2) + (candyr * Math.cos(a));
    var candyy = y + (viewport.h/2) - (candyr * Math.sin(a));

    // draw 
    scene.save();
    scene.translate(candyx, candyy);
    scene.rotate(_a);
    scene.drawImage(
      candy.img,
      candy.x, //sx,
      candy.y, //sy,
      candy.w, //sw,
      candy.h, //sh,
      candys/-2, //dx,
      candys/-2, //dy,
      candys, //dw,
      candys //dh
    );
    scene.restore();

    /*
    var ca = this.getProperty("cLocation");
    var cr = 400 * EngineConstants.R;
    var cx = x + (viewport.w/2) + (cr * Math.cos(ca));
    var cy = y + (viewport.h/2) - (cr * Math.sin(ca));
    scene.drawLine(cx, cy, (viewport.w/2), (viewport.h/2));
    
    var da = this.getProperty("dLocation");
    var ds = 20 * EngineConstants.R;
    var dr = 400 * EngineConstants.R;
    var dx = x + (viewport.w/2) + (dr * Math.cos(da)) - ds/2;
    var dy = y + (viewport.h/2) - (dr * Math.sin(da)) - ds/2;
    scene.drawRect("", dx, dy, ds, ds);
    */
  }
  
}

export default SpriteResource;


