
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';

class MouseEvent extends Container
{
  
  // length: null,
  // position: null,

  // ratio: null,

  // unit: null,

  constructor(ratio, length)
  {
    $super();

    this.length = length;
    this.position = length;
    this.ratio = ratio;

    this.unit = new Sprite(DisplayObject.GetResource(GameTimer, ResourceType.SPRITE, 'ui.game.timer_unit'));
    this.unit.w *= (ratio+0.1);
    this.unit.h *= (ratio+0.1);

    var bg = new Sprite(DisplayObject.GetResource(GameTimer, ResourceType.SPRITE, 'ui.game.bar.04'));
    bg.w *= ratio;
    bg.h *= ratio;
    this.addChild(bg);



  }

  handleDropTimerUpdate: function(value) 
  {
    this.position = value;
  }

  render(dt, x, y)
  {
    $super(dt, x, y);
    var dy = this.ratio * 3;
    for(var i = 0; i < this.length; i++) {
      var dx = this.ratio * (30 * i + 18);
      if(i < this.position) {
        this.scene.drawImage(
          this.unit.sprite.img,
          this.unit.sprite.x, //sx,
          this.unit.sprite.y, //sy,
          this.unit.sprite.w, //sw,
          this.unit.sprite.h, //sh,
          this.unit.x + x + this.x + dx, //dx,
          this.unit.y + y + this.y + dy, //dy,
          this.unit.w, //dw,
          this.unit.h //dh
        );
        //this.scene.setFillColor(Color.FromHex('#990000'));
        //this.scene.drawRect('', x + this.x + dx, y + this.y, 8, 8);
      } else {
        this.scene.setFillColor(Color.FromHex('#000000'));
        this.scene.drawRect('', x + this.x + dx, y + this.y, 8, 8);
      }
    }
  }

}

export default MouseEvent;


