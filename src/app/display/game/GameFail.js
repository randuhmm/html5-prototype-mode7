
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';

class GameFail extends minibot.display.scene.Container
{

  // fail: null,

  // t_b: null,
  // t_c: null,
  // t_t: null,

  // showing: null,

  constructor(size)
  {
    super();
    this.fail = new Sprite(DisplayObject.GetResource(GameFail, ResourceType.SPRITE, 'ui.game.fail'));

    var r = (size / this.fail.w) * 0.9;
    this.fail.w *= r;
    this.fail.h *= r;
    this.addChild(this.fail);

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
    super.render(dt, x, y);
  }

}

export default GameFail;


