import minibot from 'minibot';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineEvent from 'app/event/EngineEvent';
import ResourceType from 'app/resource/ResourceType';

var BindAsEventListener = minibot.core.Utils.BindAsEventListener,
    DisplaySystem = minibot.engine.system.DisplaySystem;

class KartDisplaySystem extends DisplaySystem
{

  constructor()
  {
    super(ComponentType.DISPLAY);
  }

  onAddedToEngine()
  {
    this.addResource(ResourceType.SPRITE, 'object.bow');
  }

}

export default KartDisplaySystem;
