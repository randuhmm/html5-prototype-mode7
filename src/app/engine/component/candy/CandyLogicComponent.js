
import EngineConstants from 'app/engine/EngineConstants';
import LogicComponent from 'app/engine/component/core/LogicComponent';
import ComponentMessage from 'app/engine/component/core/ComponentMessage';
import ComponentType from 'app/engine/enum/ComponentType';
import minibot from 'minibot';
import Engine from 'app/engine/Engine';
import ResourceType from 'app/resource/ResourceType';
import CandyType from 'app/engine/enum/CandyType';
import GridFlag from 'app/engine/enum/GridFlag';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import SigSlt from 'app/engine/message/SigSlt';

class CandyLogicComponent extends LogicComponent
{


  constructor()
  {
    super();
  }

  onAddedToObject()
  {
    super.onAddedToObject();

    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_MATCH, this.candyMatch);
    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_NONMATCH, this.candyNonmatch);
    SigSlt.AddSignal(this, EngineComponent.SIG_CANDY_SHATTER_START);
  }

  onComponentsAdded()
  {
    this.connect(ComponentType.GRID, EngineComponent.SIG_CANDY_MATCH, EngineComponent.SLT_CANDY_MATCH);
    this.connect(ComponentType.GRID, EngineComponent.SIG_CANDY_NONMATCH, EngineComponent.SLT_CANDY_NONMATCH);
  }

  onAddedToSystem()
  {

  }

  onResourcesLoaded()
  {

  }

  candyMatch(matches)
  {
    this.system.handleMatch(matches.length);

    SigSlt.Emit(this, EngineComponent.SIG_CANDY_SHATTER_START, this.system.getComboCount());
  }

  candyNonmatch()
  {
    this.system.handleNonmatch();
  }

}

export default CandyLogicComponent;


