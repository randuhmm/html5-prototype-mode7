
import EngineComponent from 'app/engine/component/core/EngineComponent';
import ComponentType from 'app/engine/enum/ComponentType';

class DisplayComponent extends EngineComponent
{
  
  constructor()
  {
    $super(ComponentType.DISPLAY);
  }
  
  getLayers()
  {
    return [0];
  }
  
  isVisible()
  {
    return true;
  }
  
  update(dt)
  {
    //-- OVERRIDE
  }
  
  render()
  {
    //-- OVERRIDE
  }
  
}

export default DisplayComponent;


