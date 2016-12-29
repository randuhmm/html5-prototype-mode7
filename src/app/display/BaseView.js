
import minibot from 'minibot';

class BaseView extends minibot.display.scene.Container
{

  // data: null,

  constructor(data)
  {
    super();
    this.setWidth(BaseView.WIDTH);
    this.setHeight(BaseView.HEIGHT);
    this.resizable = false;
    this.scalable = false;
    this.data = data;
  }

}

export default BaseView;


