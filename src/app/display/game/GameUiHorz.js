
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';

class MouseEvent extends Container
{
  
  constructor(width, height, size, matches, ticks, score)
  {
    $super();

    this.setWidth(width);
    this.setHeight(height);
    this.resizable = false;

    this.matches = matches;

    var bg = new Rect(this.w, size, '');
    this.addChild(bg);

    var style = new TextStyle("proxima-nova", 30, new Color(Color.RGB, 0, 0, 0), "left", "800");
    this.text = new Text(matches, style);
    this.text.y = 18;
    this.addChild(this.text);

  }

  handleMatchUpdate: function(value) 
  {
    this.text.setText(value.toString());
  }

  handleDropTimerUpdate: function(value) 
  {
    //this.gameTimer.handleDropTimerUpdate(value);
  }

  handlePenaltyUpdate: function(value) 
  {
    //this.penaltyCount = value;
  }

  handleMenuSelect(event)
  {
    console.log('handle menu');
  }

}

export default MouseEvent;


