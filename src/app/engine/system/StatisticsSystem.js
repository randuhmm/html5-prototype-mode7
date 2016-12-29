
import EngineSystem from 'app/engine/system/EngineSystem';
import EngineEvent from 'app/event/EngineEvent';
import ComponentType from 'app/engine/enum/ComponentType';

class StatisticsSystem extends EngineSystem
{
  
  constructor()
  {
    $super(ComponentType.STATISTICS);
  }

  onAddedToEngine()
  {

  }
  
  update(dt)
  {
    //this.updateComponents(dt);
  }

}

export default StatisticsSystem;


