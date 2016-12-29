
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';

class Button extends Container
{

  // body: null,
  // leftWing: null,
  // rightWing: null,

  constructor(gameSize)
  {
    $super();

    var ratio = (gameSize / 5) / 400;

    this.leftWing = new Sprite(DisplayObject.GetResource(Bat, ResourceType.SPRITE, 'ui.game.bat.wing_1l'));
    this.leftWing.w *= ratio;
    this.leftWing.h *= ratio;
    this.leftWing.x -= 50*ratio
    this.leftWing.y += 25*ratio
    this.addChild(this.leftWing);

    this.rightWing = new Sprite(DisplayObject.GetResource(Bat, ResourceType.SPRITE, 'ui.game.bat.wing_1r'));
    this.rightWing.w *= ratio;
    this.rightWing.h *= ratio;
    this.rightWing.x += 75*ratio
    this.rightWing.y += 25*ratio
    this.addChild(this.rightWing);

    this.body = new Sprite(DisplayObject.GetResource(Bat, ResourceType.SPRITE, 'ui.game.bat.body'));
    this.body.w *= ratio;
    this.body.h *= ratio;
    this.addChild(this.body);

    this.body.x -= this.body.w/2;
    this.body.y -= this.body.h/2;

    this.leftWing.x -= this.body.w/2;
    this.leftWing.y -= this.body.h/2;

    this.rightWing.x -= this.body.w/2;
    this.rightWing.y -= this.body.h/2;


  }


  
}

export default Button;


