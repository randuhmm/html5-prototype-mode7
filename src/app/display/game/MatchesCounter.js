
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';

class MatchesCounter extends minibot.display.scene.Container
{

  // matches: null,
  // text: null,

  constructor(matches)
  {
    super();

    this.matches = matches;

    var style = new TextStyle("proxima-nova", 30, new Color(Color.RGB, 0, 0, 0), "left", "800");
    this.text = new Text(matches, style);
    this.text.y = 18;
    this.addChild(this.text);

  }

  handleMatchUpdate(value)
  {
    this.text.setText(value.toString());
  }

}

export default MatchesCounter;


