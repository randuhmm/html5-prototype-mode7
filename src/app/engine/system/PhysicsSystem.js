
import EngineSystem from 'app/engine/system/EngineSystem';
import EngineEvent from 'app/event/EngineEvent';
import ComponentType from 'app/engine/enum/ComponentType';

class PhysicsSystem extends EngineSystem
{

  constructor()
  {
    super(ComponentType.PHYSICS);

    this.updateStack = [];
  }

  onAddedToEngine()
  {

  }

  update(dt)
  {
    this.updateComponents(dt);
  }

}

export default PhysicsSystem;


