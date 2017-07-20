
import BaseView from 'app/display/BaseView';
import ViewEvent from 'app/event/ViewEvent';
import MainMenuButton from 'app/display/component/MainMenuButton';
import minibot from 'minibot';

var ButtonEvent = minibot.event.ButtonEvent,
    Rect = minibot.display.scene.Rect,
    Color = minibot.graphics.Color,
    Utils = minibot.core.Utils;

class Options extends BaseView
{

  // backBtn: null,

  constructor(data)
  {
    super(data);

    var rect = new Rect(this.w, this.h, "", Color.FromHex("#1D96FE"));
    this.addChild(rect);

    var button1 = new MainMenuButton("BACK HI (1)", this.w*0.8, this.h*0.1);
    this.addChild(button1);
    button1.x = this.w*0.1;
    button1.y = this.h*0.1;
    button1.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleBackSelect, this));


    var button2 = new MainMenuButton("BACK (2)", this.w*0.8, this.h*0.1);
    this.addChild(button2);
    button2.x = this.w*0.1;
    button2.y = (this.h*0.2) + (button2.h*1);
    button2.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleBackSelect, this));

    var button3 = new MainMenuButton("BACK (3)", this.w*0.8, this.h*0.1);
    this.addChild(button3);
    button3.x = this.w*0.1;
    button3.y = (this.h*0.3) + (button3.h*2);
    button3.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleBackSelect, this));

  }

  handleBackSelect(event)
  {
    var viewEvent = new ViewEvent(ViewEvent.BACK_SELECTED);
    this.dispatchEvent(viewEvent);
  }

}

export default Options;


