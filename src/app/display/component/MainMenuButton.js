
import minibot from 'minibot';


var Button = minibot.display.scene.Button,
    Text = minibot.display.scene.Text,
    TextStyle = minibot.display.scene.TextStyle,
    Rect = minibot.display.scene.Rect,
    Color = minibot.graphics.Color,
    Container = minibot.display.scene.Container;


class MainMenuButton extends Button
{
  constructor(text, w, h)
  {

    var style = new TextStyle("proxima-nova", h*0.70, new Color(Color.RGB, 0, 0, 0), "center", "900");

    var upText = new Text(text, style);
    upText.x = w*0.5;
    upText.y = h*0.8;
    var overText = new Text(text, style);
    overText.x = w*0.5;
    overText.y = h*0.8;
    var downText = new Text(text, style);
    downText.x = w*0.5;
    downText.y = h*0.8;

    var upRect = new Rect(w, h, "", Color.FromHex("#990000"));
    var overRect = new Rect(w, h, "", Color.FromHex("#CC0000"));
    var downRect = new Rect(w, h, "", Color.FromHex("#0000CC"));

    var upContainer = new Container();
    upContainer.addChild(upRect);
    upContainer.addChild(upText);

    var overContainer = new Container();
    overContainer.addChild(overRect);
    overContainer.addChild(overText);

    var downContainer = new Container();
    downContainer.addChild(downRect);
    downContainer.addChild(downText);

    super(upContainer, downContainer, overContainer);
  }

}

export default MainMenuButton;


