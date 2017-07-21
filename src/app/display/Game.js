
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
import MainMenuButton from 'app/display/component/MainMenuButton';
import GameUiHorz from 'app/display/game/GameUiHorz';
import GameUiVert from 'app/display/game/GameUiVert';
import Bat from 'app/display/game/Bat';
import GameWin from 'app/display/game/GameWin';
import GameFail from 'app/display/game/GameFail';


var MouseEvent = minibot.event.MouseEvent,
    TouchEvent = minibot.event.TouchEvent,
    DisplayObject = minibot.display.DisplayObject,
    Sprite = minibot.display.scene.Sprite,
    Rect = minibot.display.scene.Rect,
    Rectangle = minibot.geom.Rectangle,
    MouseEvent = minibot.event.MouseEvent,
    Color = minibot.graphics.Color,
    BindAsEventListener = minibot.core.Utils.BindAsEventListener;

class Game extends BaseView
{

  constructor(data)
  {
    super(data);

    // var rect = new Rect(this.w, this.h, "", Color.FromHex("#CCCCCC"));
    // this.addChild(rect);
    // var buttonExit = new MainMenuButton("x", this.w*0.1, this.h*0.2);
    // this.addChild(buttonExit);
    // buttonExit.x = this.w*0.8;
    // buttonExit.y = this.h*0.1;

    this.viewport = null;
    this.engine = data.engine;

    // Add mouse event listeners
    this.addEventListener(MouseEvent.MOUSE_DOWN, BindAsEventListener(this.handleMouseDown, this));
    this.addEventListener(MouseEvent.MOUSE_MOVE, BindAsEventListener(this.handleMouseMove, this));
    this.addEventListener(MouseEvent.MOUSE_UP, BindAsEventListener(this.handleMouseUp, this));

    // Add touch event listeners
    this.addEventListener(TouchEvent.TOUCH_START, BindAsEventListener(this.handleTouchStart, this));
    this.addEventListener(TouchEvent.TOUCH_MOVE, BindAsEventListener(this.handleTouchMove, this));
    this.addEventListener(TouchEvent.TOUCH_END, BindAsEventListener(this.handleTouchEnd, this));
  }

  onAddedToScene()
  {
    super.onAddedToScene();
    var size = Math.min(this.getWidth(), this.getHeight());
    this.viewport = new Rectangle(0,0,size,size);
    this.engine.setScene(this.getScene());
    this.engine.setViewport(this.viewport);
    this.engine.start();
  }

  render(dt, x, y)
  {
    this.engine.render(dt, x, y);
    super.render(dt, x, y);
  }

  handleMouseDown(event)
  {
    this.sendEngineInput(InputType.ADD_PIECE, this.toAngle(event.x, event.y));
  }

  handleMouseUp(event)
  {
    //
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


export default Game;


