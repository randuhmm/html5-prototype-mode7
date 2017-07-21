
import BaseView from 'app/display/BaseView';
import ViewEvent from 'app/event/ViewEvent';
import MainMenuButton from 'app/display/component/MainMenuButton';
import ResourceType from 'app/resource/ResourceType';
import minibot from 'minibot';

var ButtonEvent = minibot.event.ButtonEvent,
    DisplayObject = minibot.display.DisplayObject,
    Sprite = minibot.display.scene.Sprite,
    Rect = minibot.display.scene.Rect,
    Container = minibot.display.scene.Container,
    Color = minibot.graphics.Color,
    Utils = minibot.core.Utils;

class Title extends BaseView
{

  constructor(data)
  {
    super(data);

    var rect = new Rect(this.w, this.h, "", Color.FromHex("#CCCCCC"));
    this.addChild(rect);

    var buttonExit = new MainMenuButton("x", this.w*0.1, this.h*0.2);
    this.addChild(buttonExit);
    buttonExit.x = this.w*0.8;
    buttonExit.y = this.h*0.1;
    buttonExit.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleExitSelect, this));

    var button1 = new MainMenuButton("LEVEL 1", this.w*0.6, this.h*0.2);
    this.addChild(button1);
    button1.x = this.w*0.1;
    button1.y = this.h*0.1;
    button1.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleLevelSelect, this, 1));

    var button1 = new MainMenuButton("LEVEL 1", this.w*0.6, this.h*0.2);
    this.addChild(button1);
    button1.x = this.w*0.1;
    button1.y = this.h*0.1;
    button1.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleLevelSelect, this, 1));

    var button2 = new MainMenuButton("LEVEL 2", this.w*0.6, this.h*0.2);
    this.addChild(button2);
    button2.x = this.w*0.1;
    button2.y = (this.h*0.2) + (button2.h*1);
    button2.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleLevelSelect, this, 2));

    var button3 = new MainMenuButton("LEVEL 3", this.w*0.6, this.h*0.2);
    this.addChild(button3);
    button3.x = this.w*0.1;
    button3.y = (this.h*0.3) + (button3.h*2);
    button3.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleLevelSelect, this, 3));

  }

  handleLevelSelect(event, level)
  {
    console.log('Title:handleLevelSelect - ' + level);
    var viewEvent = new ViewEvent(ViewEvent.LEVEL_SELECTED, level);
    this.dispatchEvent(viewEvent);
  }

  handleExitSelect(event)
  {
    var viewEvent = new ViewEvent(ViewEvent.EXIT_SELECTED);
    this.dispatchEvent(viewEvent);
  }

}

DisplayObject.AddResource(Title, ResourceType.SPRITE, 'ui.title.bg');

export default Title
