
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';

class MouseEvent extends Container
{
  
  // win: null,

  // t_b: null,
  // t_c: null,
  // t_t: null,

  // showing: null,

  constructor(size)
  {
    $super();
    this.win = new Sprite(DisplayObject.GetResource(GameWin, ResourceType.SPRITE, 'ui.game.win'));

    var r = (size / this.win.w) * 0.9;
    this.win.w *= r;
    this.win.h *= r;
    this.addChild(this.win);

    this.y -= this.h;
    this.x = (size - this.w) / 2;

    this.showing = false;

    this.t_t = 0;
    this.t_b = 0;
    this.t_c = this.h + size/2;

    this.final = this.t_c - this.h;

  }

  show()
  {
    this.showing = true;
  }

  tween(t, b, c, d)
  {
    t /= d;
    return c*t*t + b;
  }

  render(dt, x, y)
  {
    if(this.showing) {
      this.t_t += dt;
      this.y = this.tween(this.t_t, this.t_b, this.t_c, 1000) - this.h;
      if(this.y >= this.final) {
        this.showing = false;
        this.y = this.final;
      }
    }
    $super(dt, x, y);
  }

}

export default MouseEvent;


