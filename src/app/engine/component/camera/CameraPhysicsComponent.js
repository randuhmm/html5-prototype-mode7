import minibot from 'minibot';
import EngineConstants from 'app/engine/KartEngineConstants';
import ComponentType from 'app/engine/enum/ComponentType';
import ResourceType from 'app/resource/ResourceType';

var EngineComponent = minibot.engine.EngineComponent;

class KartPhysicsComponent extends EngineComponent {

  constructor() {
    super(ComponentType.PHYSICS);
  }

}

export default KartPhysicsComponent;