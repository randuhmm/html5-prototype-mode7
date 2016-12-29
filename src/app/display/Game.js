
import BaseView from 'app/display/BaseView';
import ViewEvent from 'app/event/ViewEvent';
import EngineEvent from 'app/event/EngineEvent';
import ResourceType from 'app/resource/ResourceType';
import InputType from 'app/engine/enum/InputType';
import minibot from 'minibot';
import ComponentType from 'app/engine/enum/ComponentType';
import GameTimer from 'app/display/game/GameTimer';
import ComboMeter from 'app/display/game/ComboMeter';
import MatchesCounter from 'app/display/game/MatchesCounter';
import GameUiHorz from 'app/display/game/GameUiHorz';
import GameUiVert from 'app/display/game/GameUiVert';
import Bat from 'app/display/game/Bat';
import GameWin from 'app/display/game/GameWin';
import GameFail from 'app/display/game/GameFail';

class MouseEvent extends BaseView
{

  // bgColor: null,

  // engine: null,
  // viewport: null,

  // gameTimer: null,
  // comboMeter: null,

  // gameSize: null,
  // uiSize: null,
  // uiType: null,

  // gameUi: null,

  // bat: null,

  // gameWin: null,
  // gameFail: null,

  constructor(data)
  {
    super(data);

    this.engine = data.engine;
    this.level = data.level;

    this.bgColor =  Color.FromHex("#1D96FE");

    this.setLayoutVars();

    if(this.uiType == Game.UI_TYPE_HORZ) {
      //
      this.gameUi = new GameUiHorz(this.w, this.h, this.uiSize, this.level.matches, 0, 0);
    } else if(this.uiType == Game.UI_TYPE_VERT) {
      this.gameUi = new GameUiVert(this.w, this.h, this.uiSize, this.level.matches, 0, 0);
    }
    this.addChild(this.gameUi);

    this.cloudBg = new Sprite(DisplayObject.GetResource(Game, ResourceType.SPRITE, 'ui.game.clouds.bg'));
    this.cloudBg.w = this.gameSize;
    this.cloudBg.h = this.gameSize;
    this.cloudBgA = 0;
    this.cloudFg = new Sprite(DisplayObject.GetResource(Game, ResourceType.SPRITE, 'ui.game.clouds.fg'));
    this.cloudFg.w = this.gameSize;
    this.cloudFg.h = this.gameSize;
    this.cloudFgA = 0;

    this.bat = new Bat(this.gameSize);
    this.addChild(this.bat);

    this.gameWin = new GameWin(this.gameSize);
    this.addChild(this.gameWin);

    this.gameFail = new GameFail(this.gameSize);
    this.addChild(this.gameFail);

    /*
    this.matchesCounter = new MatchesCounter(this.level.matches);
    this.matchesCounter.x = 0;
    this.matchesCounter.y = 40;
    this.addChild(this.matchesCounter);
    */

    // connect timer & combo meter
    this.engine.getSystem(ComponentType.LOGIC).setDropTimerCallback(this.gameUi.handleDropTimerUpdate.bind(this.gameUi));
    this.engine.getSystem(ComponentType.LOGIC).setMatchesCallback(this.gameUi.handleMatchUpdate.bind(this.gameUi));
    this.engine.getSystem(ComponentType.LOGIC).setPenaltyCallback(this.gameUi.handlePenaltyUpdate.bind(this.gameUi));

    // Add mouse event listeners
    this.mouseDownFx = this.handleMouseDown.bindAsEventListener(this);
    this.mouseMoveFx = this.handleMouseMove.bindAsEventListener(this);
    this.mouseUpFx = this.handleMouseUp.bindAsEventListener(this);
    this.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownFx);
    this.addEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveFx);
    this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpFx);

    // Add touch event listeners
    this.touchStartFx = this.handleTouchStart.bindAsEventListener(this);
    this.touchMoveFx = this.handleTouchMove.bindAsEventListener(this);
    this.touchEndFx = this.handleTouchEnd.bindAsEventListener(this);
    this.addEventListener(TouchEvent.TOUCH_START, this.touchStartFx);
    this.addEventListener(TouchEvent.TOUCH_MOVE, this.touchMoveFx);
    this.addEventListener(TouchEvent.TOUCH_END, this.touchEndFx);

    this.engine.addEventListener(EngineEvent.NEXT_STAGE, this.handleNextStage.bindAsEventListener(this));
    this.engine.addEventListener(EngineEvent.GAME_EXIT, this.handleGameExit.bindAsEventListener(this));

    this.engine.addEventListener(EngineEvent.GAME_WIN, this.handleGameWin.bindAsEventListener(this));
    this.engine.addEventListener(EngineEvent.GAME_FAIL, this.handleGameFail.bindAsEventListener(this));

  }

  onAddedToScene()
  {
    $super();
    //var size = Math.min(this.getWidth(), this.getHeight());
    var gx = 0
      ,  gy = 0
      , gs = this.gameSize;

    switch(this.uiType) {
      case Game.UI_TYPE_HORZ:
        gy = this.h - (this.h / 2 - this.uiSize / 2) - this.gameSize / 2;
        break;
      case Game.UI_TYPE_VERT:
        gy =  this.h - (this.h / 2 - this.uiSize / 8) - this.gameSize / 2;
        gx =  (this.w / 2 - this.uiSize * 3 / 8) - this.gameSize / 2;
        break;
    }

    this.viewport = new Rectangle(gx, gy, gs, gs);
    this.engine.setScene(this.getScene());
    this.engine.setSoundProxy(this.data.soundProxy);
    this.engine.setViewport(this.viewport);
    this.engine.start();

    this.cloudBg.x = gx;
    this.cloudBg.y = gy;
    this.cloudFg.x = gx;
    this.cloudFg.y = gy;

    this.bat.x = this.viewport.x + this.gameSize/2;
    this.bat.y = this.viewport.y + this.gameSize/2;
  }

  render(dt, x, y)
  {
    // Fill BG
    this.scene.setFillColor(this.bgColor);
    this.scene.drawRect('', 0, 0, this.w, this.h);

    this.cloudBgA += 0.0002;
    this.scene.save();
    this.scene.translate(x + this.cloudBg.x + this.cloudBg.w/2, y + this.cloudBg.y + this.cloudBg.h/2);
    this.scene.rotate(this.cloudBgA);
    // draw bg clouds
    this.scene.drawImage(
      this.cloudBg.sprite.img,
      this.cloudBg.sprite.x, //sx,
      this.cloudBg.sprite.y, //sy,
      this.cloudBg.sprite.w, //sw,
      this.cloudBg.sprite.h, //sh,
      this.cloudBg.w/-2, //dx,
      this.cloudBg.h/-2, //dy,
      this.cloudBg.w, //dw,
      this.cloudBg.h  //dh,
    );
    this.scene.restore();

    this.cloudFgA -= 0.0005;
    if(this.cloudFgA <= 0) {
      this.cloudFgA = Math.PI * 2;
    }
    this.scene.save();
    this.scene.translate(x + this.cloudFg.x + this.cloudFg.w/2, y + this.cloudFg.y + this.cloudFg.h/2);
    this.scene.rotate(this.cloudFgA);
    // draw fg clouds
    this.scene.drawImage(
      this.cloudFg.sprite.img,
      this.cloudFg.sprite.x, //sx,
      this.cloudFg.sprite.y, //sy,
      this.cloudFg.sprite.w, //sw,
      this.cloudFg.sprite.h, //sh,
      this.cloudFg.w/-2, //dx,
      this.cloudFg.h/-2, //dy,
      this.cloudFg.w, //dw,
      this.cloudFg.h  //dh,
    );
    this.scene.restore();

    this.engine.render(dt, x, y);
    $super(dt, x, y);
  }

  setLayoutVars()
  {
    if(this.h >= (this.w * 5 / 4)) {
      // HORIZONTAL MENU
      this.gameSize = this.w;
      this.uiType = Game.UI_TYPE_HORZ;
      console.log('horizontal - ' + this.gameSize);
    } else {
      // VERTICAL MENU
      var gs1 = this.w * 13 / 16;
      if(gs1 * 17 / 16 <= this.h) {
        this.gameSize = gs1;
      } else {
        this.gameSize = this.h * 15 / 16;
      }
      this.uiType = Game.UI_TYPE_VERT;
      console.log('vertical - ' + this.gameSize);
    }

    this.gameSize = Math.floor(this.gameSize/4) * 4;
    this.uiSize = this.gameSize / 4;

  }

  handleMouseDown(event)
  {

  }

  handleMouseUp(event)
  {
    //
    this.sendEngineInput(InputType.ADD_PIECE, this.toAngle(event.x, event.y));
  }

  handleMouseMove(event)
  {
    this.sendEngineInput(InputType.MOVE_CURSOR, this.toAngle(event.x, event.y));
  }

  handleTouchStart(event)
  {
    this.sendEngineInput(InputType.MOVE_CURSOR, this.toAngle(event.x, event.y));
  }

  handleTouchEnd(event)
  {
    this.sendEngineInput(InputType.ADD_PIECE, this.toAngle(event.x, event.y));
  }

  handleTouchMove(event)
  {
    this.sendEngineInput(InputType.MOVE_CURSOR, this.toAngle(event.x, event.y));
  }

  handleNextStage(event)
  {
    var viewEvent = new ViewEvent(ViewEvent.NEXT_STAGE, this.level);
    this.dispatchEvent(viewEvent);
  }

  handleGameExit(event)
  {
    var viewEvent = new ViewEvent(ViewEvent.GAME_EXIT);
    this.dispatchEvent(viewEvent);
  }

  handleGameWin(event)
  {
    // Display win screen.
    this.gameWin.show();
    this.disconnectListeners();

    this.addEventListener(MouseEvent.MOUSE_UP, this.handleNextStage.bindAsEventListener(this));
    this.addEventListener(TouchEvent.TOUCH_END, this.handleNextStage.bindAsEventListener(this));
  }

  handleGameFail(event)
  {
    // Display win screen.
    console.log("FAIL")
    this.gameFail.show();
    this.disconnectListeners();

    this.addEventListener(MouseEvent.MOUSE_UP, this.handleGameExit.bindAsEventListener(this));
    this.addEventListener(TouchEvent.TOUCH_END, this.handleGameExit.bindAsEventListener(this));
  }

  disconnectListeners()
  {
    this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownFx);
    this.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveFx);
    this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpFx);

    // Add touch event listeners
    this.removeEventListener(TouchEvent.TOUCH_START, this.touchStartFx);
    this.removeEventListener(TouchEvent.TOUCH_MOVE, this.touchMoveFx);
    this.removeEventListener(TouchEvent.TOUCH_END, this.touchEndFx);
  }

  destroyEngine()
  {
    this.engine.destroy();
  }

  toAngle(x, y)
  {
    x = (x - (this.viewport.x + this.viewport.w/2));
    y = ((this.viewport.y + this.viewport.h/2) - y);
    var a = Math.atan2(y, x);
    if(a < 0) a += 2 * Math.PI;
    return a;
  }

  sendEngineInput(type, data)
  {
    this.engine.dispatchEvent(new EngineEvent(EngineEvent.INPUT, null, null, {type: type, data: data}));
  }

}

export default MouseEvent;


