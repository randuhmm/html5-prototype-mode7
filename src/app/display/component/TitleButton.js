
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';


var Button = minibot.display.scene.Button,
    Text = minibot.display.scene.Text,
    TextStyle = minibot.display.scene.TextStyle,
    Rect = minibot.display.scene.Rect,
    Color = minibot.graphics.Color,
    Container = minibot.display.scene.Container,
    DisplayObject = minibot.display.DisplayObject,
    Sprite = minibot.display.scene.Sprite;


class TitleButton extends Button
{
  constructor(type, w)
  {

    var barUp = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.bar'));
    var barDown = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.bar'));

    var textUp = null;
    var textDown = null;

    switch(type) {
      case TitleButton.START:
        textUp = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.start.up'));
        textDown = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.start.down'));
        break;
      case TitleButton.OPTIONS:
        textUp = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.options.up'));
        textDown = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.options.down'));
        break;
      case TitleButton.CREDITS:
        textUp = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.credits.up'));
        textDown = new Sprite(DisplayObject.GetResource(TitleButton, ResourceType.SPRITE, 'ui.title.credits.down'));
        break;
    }

    if(textUp === null || textDown === null) return;

    // Resize button
    var scale = w / barUp.getWidth();
    var barW = barUp.getWidth() * scale;
    var barH = barUp.getHeight() * scale;
    var textW = textUp.getWidth() * scale;
    var textH = textUp.getHeight() * scale;

    barUp.setWidth(barW);
    barUp.setHeight(barH);
    barDown.setWidth(barW);
    barDown.setHeight(barH);
    textUp.setWidth(textW);
    textUp.setHeight(textH);
    textDown.setWidth(textW);
    textDown.setHeight(textH);

    barUp.y = (textUp.getHeight() - barUp.getHeight()) / 2;
    barDown.y = (textDown.getHeight() - barDown.getHeight()) / 2;

    textUp.x = (barUp.getWidth() - textUp.getWidth()) / 2;
    textDown.x = (barDown.getWidth() - textDown.getWidth()) / 2;

    var upContainer = new Container();
    upContainer.addChild(barUp);
    upContainer.addChild(textUp);

    var downContainer = new Container();
    downContainer.addChild(barDown);
    downContainer.addChild(textDown);

    super(upContainer, downContainer, downContainer);
  }

}


TitleButton.START = "Start";
TitleButton.CREDITS = "Credits";
TitleButton.OPTIONS = "Options";

DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.bar');

DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.start.up');
DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.start.down');

DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.options.up');
DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.options.down');

DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.credits.up');
DisplayObject.AddResource(TitleButton, ResourceType.SPRITE, 'ui.title.credits.down');


export default TitleButton;


