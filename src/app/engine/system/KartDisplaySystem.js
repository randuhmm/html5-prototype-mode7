import minibot from 'minibot';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineEvent from 'app/event/EngineEvent';
import ResourceType from 'app/resource/ResourceType';

var BindAsEventListener = minibot.core.Utils.BindAsEventListener,
    DisplaySystem = minibot.engine.system.DisplaySystem,
    CreateScene = minibot.system.CreateScene;

class KartDisplaySystem extends DisplaySystem {

  constructor(player, camera) {
    super(ComponentType.DISPLAY);
    this.player = player;
    this.camera = camera;
    this.modes = [];
    this.levelSprite = null;

    // Viewport
    this.omega = 120 * Math.PI/180;
    this.theta = 60 * Math.PI/180;
    this.alpha = 30 * Math.PI/180;
    this.h = 15;
    this.H = 180;
    this.LH = 1;

    this.dx = 0;
  }

  onAddedToEngine()
  {
    this.addResource(ResourceType.SPRITE, 'object.bow');
    this.addResource(ResourceType.SPRITE, 'level.mariocircuit');
  }

  onResourcesLoaded() {
    // Get the level image
    this.levelSprite = this.getResource(ResourceType.SPRITE, 'level.mariocircuit');
    
    // Prepare the ground canvas
		var max = Math.max(this.levelSprite.w, this.levelSprite.h);
		this.groundScene = CreateScene(
      {
        'enableEvents': false,
        'width': max,
        'height': max
      }
    );
    
    // INSERT FOR DEBUGGING
    document.getElementById('wrapper').appendChild(this.groundScene.getElement());

    // Viewport Settings
    var WIDTH = 320;
    var omega = 120 * Math.PI/180;
    var theta = 60 * Math.PI/180;
    var alpha = 30 * Math.PI/180;
    var h = 15;
    var H = 180;
    var LH = 1;
    var sx, sy, sw, sh, dx, dw,
		    w  = 0,
			  w1 = 0,
			  w2 = 0,
			  d1 = 0,
			  d2 = 0;
		for(var L = 1; L <= H; L++) {
			this.modes[L] = null;
			w1 = 2 * h * Math.tan( (Math.PI - theta)/2 + alpha*(L - 1)/H ) / Math.tan(omega/2);
			w2 = 2 * h * Math.tan( (Math.PI - theta)/2 + alpha*L/H ) / Math.tan(omega/2);
			d1 = h * Math.tan( (Math.PI - theta)/2 + alpha*(L - 1)/H );
			d2 = h * Math.tan( (Math.PI - theta)/2 + alpha*L/H );
			//w = w1 + (w2-w1)/2;
			w = w1;
			//if(d2 > groundScene.height) continue;
			sx = (this.groundScene.width - w)/2;
			sy = this.groundScene.height - d1;
			sw = w;
			sh = d2 - d1;
			dw = WIDTH;
			dx = 0;
			if(w > this.groundScene.width) {
				sx = 0;
				sw = this.groundScene.width;
				dw = WIDTH * (sw/w);
				dx = (WIDTH - dw) / 2;
			}
			this.modes[L] = {
				'sx': sx,
				'sy': sy,
				'sw': sw,
				'sh': sh,
				'dx': dx,
				'dw': dw
			};
		}
  }

  render(dt, x, y) {
    //super.render(dt, x, y);
    
		// Clear the canvas
		this.groundScene.clear();
		// this.groundContext.save();
		// this.groundContext.translate(dx + px, dy + py);
		// this.groundContext.rotate(pa);
    // this.groundContext.translate((dx + px)*-1, (dy + py)*-1);
    this.dx += (dt / 20.0);
		this.groundScene.drawImage(
      this.levelSprite.img,
      0,
      0,
      this.levelSprite.w,
      this.levelSprite.h,
      0,
      this.dx,
      this.levelSprite.w,
      this.levelSprite.h
    );
    // this.groundContext.restore();
    
    var element = this.groundScene.getElement();

    var scene = this.getScene();
    var HEIGHT = 200;
		for(var L = 1; L <= this.H; L++) {
			var val = this.modes[L];
			if(val == undefined) continue;
			scene.drawImage(
				element,
				val.sx,
				val.sy,
				val.sw,
				val.sh,
				val.dx,
				HEIGHT - (L*this.LH),
				val.dw,
				this.LH
      );
		}
  }

}

export default KartDisplaySystem;