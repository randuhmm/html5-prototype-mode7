
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import ViewEvent from 'app/event/ViewEvent';

class MouseEvent extends Container
{
  
  // length: null,
  // position: null,
  // count: null,
  // comboText: null,

  constructor(width, height, length)
  {
    $super();

    this.length = length;
    this.position = 0;
    this.count = 0;

    var style = new TextStyle("proxima-nova", 10, new Color(Color.RGB, 0, 0, 0), "left", "800");
    this.comboText = new Text("", style);
    this.comboText.hide();
    this.comboText.y = 18;
    this.addChild(this.comboText);

  }

  handleComboUpdate: function(value, count) 
  {
    this.position = value;
    this.count = count;
    if(count == 0) {
      this.comboText.hide();
    } else {
      this.comboText.show();
      this.comboText.setText("x" + count);
    }
  }

  render(dt, x, y)
  {
    $super(dt, x, y);
    for(var i = 0; i < this.length; i++) {
      if(i < this.position) {
        this.scene.setFillColor(Color.FromHex('#00AAAA'));
        this.scene.drawRect('', x + this.x + (10*i), y + this.y, 8, 8);
      } else {
        this.scene.setFillColor(Color.FromHex('#000000'));
        this.scene.drawRect('', x + this.x + (10*i), y + this.y, 8, 8);
      }
    }
  }

}

export default MouseEvent;


