
import BaseView from 'app/display/BaseView';
import ViewEvent from 'app/event/ViewEvent';
import TitleButton from 'app/display/component/TitleButton';
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

  // playBtn: null,
  // optionsBtn: null,
  // creditsBtn: null,

  constructor(data)
  {
    super(data);

    var rect = new Rect(this.w, this.h, "", Color.FromHex("#1D96FE"));
    this.addChild(rect);

    this.setupLogo();
    this.setupButtons();
  }

  setupLogo()
  {

    var w = this.w * 0.6;

    var container = new Container();
    var cloud = new Sprite(DisplayObject.GetResource(Title, ResourceType.SPRITE, 'ui.title.cloud'));
    var angel = new Sprite(DisplayObject.GetResource(Title, ResourceType.SPRITE, 'ui.title.angel'));
    var logo = new Sprite(DisplayObject.GetResource(Title, ResourceType.SPRITE, 'ui.title.logo'));

    angel.y = -240;

    container.addChild(cloud);
    container.addChild(angel);
    container.addChild(logo);

    container.setAlign(DisplayObject.ALIGN_HORZ_CENTER, [cloud, angel, logo]);
    container.setAlign(DisplayObject.ALIGN_VERT_CENTER, [cloud, logo]);

    container.setScale(w/container.getWidth());

    this.addChild(container);

    //container.y = this.getHeight()/2 - container.getHeight();
    this.setAlign(DisplayObject.ALIGN_HORZ_CENTER, [container]);
    this.setAlign(DisplayObject.ALIGN_VERT_CENTER, [container]);
    //container.y -= container.getHeight()/4;

  }

  setupButtons()
  {

    var BW = this.w*0.5;
    if(BW > 479) BW = 479;
    if(BW <= 300) BW = 300;

    this.playBtn = new TitleButton(TitleButton.START, BW);
    this.addChild(this.playBtn);

    this.optionsBtn = new TitleButton(TitleButton.OPTIONS, BW);
    this.addChild(this.optionsBtn);

    this.creditsBtn = new TitleButton(TitleButton.CREDITS, BW);
    this.addChild(this.creditsBtn);

    var BH = this.playBtn.getHeight();
    var BBX = (this.w - BW) / 2;
    var BBY = (BBX > BH/2)?(BH/2):(BBX);

    this.playBtn.x = BBX;
    this.playBtn.y = this.h - BH*3 - BBY*5;
    this.playBtn.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handlePlaySelect, this));

    this.optionsBtn.x = BBX;
    this.optionsBtn.y = this.h - BH*2 - BBY*4;
    this.optionsBtn.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleOptionsSelect, this));

    this.creditsBtn.x = BBX;
    this.creditsBtn.y = this.h - BH - BBY*3;
    this.creditsBtn.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(this.handleOptionsSelect, this));
  }

  handlePlaySelect(event)
  {
    var viewEvent = new ViewEvent(ViewEvent.PLAY_SELECTED);
    this.dispatchEvent(viewEvent);
  }

  handleOptionsSelect(event)
  {
    var viewEvent = new ViewEvent(ViewEvent.OPTIONS_SELECTED);
    this.dispatchEvent(viewEvent);
  }
}

DisplayObject.AddResource(Title, ResourceType.SPRITE, 'ui.title.logo');
DisplayObject.AddResource(Title, ResourceType.SPRITE, 'ui.title.angel');
DisplayObject.AddResource(Title, ResourceType.SPRITE, 'ui.title.cloud');
DisplayObject.AddResource(Title, ResourceType.SPRITE, 'ui.title.bg');

DisplayObject.AddObject(Title, TitleButton);

export default Title
