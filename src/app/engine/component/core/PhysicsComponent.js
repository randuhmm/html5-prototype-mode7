
import PhysicsSystem from 'app/engine/system/PhysicsSystem';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import ComponentType from 'app/engine/enum/ComponentType';

class PhysicsComponent extends EngineComponent
{

  constructor()
  {
    super(ComponentType.PHYSICS);
  }

  onAddedToObject()
  {

  }

  update(dt)
  {

  }

  render()
  {
    //-- OVERRIDE
  }

}

export default PhysicsComponent;


