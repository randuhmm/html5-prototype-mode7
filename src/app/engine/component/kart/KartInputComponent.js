
import minibot from 'minibot';
import EngineConstants from 'app/engine/KartEngineConstants';
import ComponentType from 'app/engine/enum/ComponentType';
import ResourceType from 'app/resource/ResourceType';

var InputComponent = minibot.engine.component.InputComponent;

class KartInputComponent extends InputComponent
{

  constructor()
  {
    super(ComponentType.INPUT);
    // SigSlt.AddSignal(this, EngineComponent.SIG_INPUT_MOVE);
    // SigSlt.AddSignal(this, EngineComponent.SIG_INPUT_ADD);
  }

}

export default KartInputComponent;


