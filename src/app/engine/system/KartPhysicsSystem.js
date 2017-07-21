
import minibot from 'minibot';
import ComponentType from 'app/engine/enum/ComponentType';

var EngineSystem = minibot.engine.EngineSystem;

class KartPhysicsSystem extends EngineSystem
{

  constructor()
  {
    super(ComponentType.PHYSICS);
  }

  update(dt)
  {
    this.updateComponents(dt);
  }

}

export default KartPhysicsSystem;
