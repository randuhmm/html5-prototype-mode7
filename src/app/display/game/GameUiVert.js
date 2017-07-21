
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';
import GameMenuButton from 'app/display/game/GameMenuButton';
import GameTimer from './GameTimer';

class GameUiVert extends minibot.display.scene.Container
{

  // gameTimer: null,

  // candiesLeftText: null,

  // penaltyLength: null,
  // penaltyCount: null,
  // penaltyOn: null,
  // penaltyOff: null,

  // ratio: null,

  constructor(width, height, size, matches, ticks, score)
  {
    super();

    this.setWidth(width);
    this.setHeight(height);
    this.resizable = false;

    this.matches = matches;

    this.penaltyLength = 3;
    this.penaltyCount = 0;

    var r = (size*3/4) / 280;
    this.ratio = r;

    // BG
    var pSprite = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.tile'));
    pSprite.w *= r;
    pSprite.h *= r;
    var pPat = new Pattern(pSprite);
    var bg1 = new Rect(this.w, size/4, '', pPat);
    this.addChild(bg1);
    var bg2 = new Rect(size*3/4, this.h, '', pPat);
    this.addChild(bg2);
    bg2.x = this.w - bg2.w;

    var vby = size/4;
    while(vby < this.h) {
      var vbSprite = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.border_vert_right'));
      vbSprite.w *= r;
      vbSprite.h *= r;
      vbSprite.x = this.w - vbSprite.w - (35*r);
      vbSprite.y = vby;
      this.addChild(vbSprite);
      vby += vbSprite.h;
    }

    var hbx = this.w - size*3/4;
    while(hbx > 0) {
      var hbSprite = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.border_horz_top'));
      hbSprite.w *= r;
      hbSprite.h *= r;
      hbSprite.x = hbx - hbSprite.w;
      hbSprite.y = size/4 - hbSprite.h + (35*r);
      this.addChild(hbSprite);
      hbx -= hbSprite.w;
    }


    this.gameTimer = new GameTimer((r+0.2), 16);
    this.gameTimer.x = (100*r);
    this.gameTimer.y = (10*r);
    this.addChild(this.gameTimer);


    var scoreBg = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.bar.01'));
    scoreBg.w *= (r+0.2);
    scoreBg.h *= (r+0.2);
    scoreBg.x = this.w - scoreBg.w - (400*r);
    scoreBg.y = (10*r);
    this.addChild(scoreBg);
    var scoreLabel = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.score'));
    scoreLabel.w *= (r+0.3);
    scoreLabel.h *= (r+0.3);
    scoreLabel.x = this.w - scoreBg.w - (390*r);
    scoreLabel.y = (14*r);
    this.addChild(scoreLabel);


    var candiesLeftBg = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.bar.03'));
    candiesLeftBg.w *= (r+0.2);
    candiesLeftBg.h *= (r+0.2);
    candiesLeftBg.x = this.w - (size*3/8) - candiesLeftBg.w/2;
    candiesLeftBg.y = (500*r);
    this.addChild(candiesLeftBg);
    var candiesLeftLabel = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.candies_left'));
    candiesLeftLabel.w *= (r+0.3);
    candiesLeftLabel.h *= (r+0.3);
    candiesLeftLabel.x = this.w - (size*3/8) - candiesLeftBg.w/2;
    candiesLeftLabel.y = (480*r);
    this.addChild(candiesLeftLabel);
    var style = new TextStyle("proxima-nova", 30, Color.FromHex("#FFDD55"), "center", "800");
    this.candiesLeftText = new Text(matches, style);
    this.candiesLeftText.x = this.w - size*3/8;
    this.candiesLeftText.y = (500*r) + candiesLeftBg.h - (40*r);
    this.addChild(this.candiesLeftText);

    var penaltyBg = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.bar.05'));
    penaltyBg.w *= (r+0.2);
    penaltyBg.h *= (r+0.2);
    penaltyBg.x = this.w - (size*3/8) - penaltyBg.w/2;
    penaltyBg.y = (800*r);
    this.addChild(penaltyBg);
    var penaltyLabel = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.penalty'));
    penaltyLabel.w *= (r+0.3);
    penaltyLabel.h *= (r+0.3);
    penaltyLabel.x = this.w - (size*3/8) - penaltyBg.w/2;
    penaltyLabel.y = (780*r);
    this.addChild(penaltyLabel);
    this.penaltyOn = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.penalty.on'));
    this.penaltyOn.w *= (r+0.3);
    this.penaltyOn.h *= (r+0.3);
    this.penaltyOn.x = penaltyBg.x + (30*r);
    this.penaltyOn.y = penaltyBg.y + (30*r);
    this.penaltyOff = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.penalty.off'));
    this.penaltyOff.w *= (r+0.3);
    this.penaltyOff.h *= (r+0.3);
    this.penaltyOff.x = penaltyBg.x + (30*r);
    this.penaltyOff.y = penaltyBg.y + (30*r);

    // Menu
    var menuButtonUp = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.menu.up'));
    menuButtonUp.w *= (r+0.5);
    menuButtonUp.h *= (r+0.5);
    var menuButtonDown = new Sprite(DisplayObject.GetResource(GameUiVert, ResourceType.SPRITE, 'ui.game.menu.down'));
    menuButtonDown.w *= (r+0.5);
    menuButtonDown.h *= (r+0.5);
    var menuButton = new Button(menuButtonUp, menuButtonDown, menuButtonDown);
    menuButton.x = this.w - menuButton.w;
    menuButton.addEventListener(ButtonEvent.SELECT, this.handleMenuSelect.bindAsEventListener(this));
    menuButton.addEventListener(MouseEvent.MOUSE_UP, function() {});
    this.addChild(menuButton);


    /*
    var button = new GameMenuButton('QUIT', size*3/4, size/4);
    button.x = this.w - size*3/4;
    button.y = this.h - 100;
    this.addChild(button);
    */

  }


  render(dt, x, y)
  {
    super.render(dt, x, y);

    var dx = 0,
      dy = 0;

    for(var i = 0; i < this.penaltyLength; i++) {
      dy = (i * 80 * this.ratio);
      if(i < this.penaltyCount) {
        this.scene.drawImage(
          this.penaltyOn.sprite.img,
          this.penaltyOn.sprite.x, //sx,
          this.penaltyOn.sprite.y, //sy,
          this.penaltyOn.sprite.w, //sw,
          this.penaltyOn.sprite.h, //sh,
          this.penaltyOn.x + x + this.x + dx, //dx,
          this.penaltyOn.y + y + this.y + dy, //dy,
          this.penaltyOn.w, //dw,
          this.penaltyOn.h //dh
        );
      } else {
        this.scene.drawImage(
          this.penaltyOff.sprite.img,
          this.penaltyOff.sprite.x, //sx,
          this.penaltyOff.sprite.y, //sy,
          this.penaltyOff.sprite.w, //sw,
          this.penaltyOff.sprite.h, //sh,
          this.penaltyOff.x + x + this.x + dx, //dx,
          this.penaltyOff.y + y + this.y + dy, //dy,
          this.penaltyOff.w, //dw,
          this.penaltyOff.h //dh
        );
      }
    }

  }

  handleMatchUpdate(value)
  {
    this.candiesLeftText.setText(value.toString());
  }

  handleDropTimerUpdate(value)
  {
    this.gameTimer.handleDropTimerUpdate(value);
  }

  handlePenaltyUpdate(value)
  {
    this.penaltyCount = value;
  }

  handleMenuSelect(event)
  {
    console.log('handle menu');
  }

}

export default GameUiVert;
