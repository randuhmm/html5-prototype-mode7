
import EngineComponent from 'app/engine/component/core/EngineComponent';
import ComponentType from 'app/engine/enum/ComponentType';

class LogicComponent extends EngineComponent
{
  
  constructor()
  {
    $super(ComponentType.LOGIC);
  }
  
}

export default LogicComponent;


