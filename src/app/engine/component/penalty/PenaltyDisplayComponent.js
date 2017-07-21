
import minibot from 'minibot';
import EngineConstants from 'app/engine/EngineConstants';
import DisplayComponent from 'app/engine/component/core/DisplayComponent';
import ComponentMessage from 'app/engine/component/core/ComponentMessage';
import Engine from 'app/engine/Engine';
import ResourceType from 'app/resource/ResourceType';

class PenaltyDisplayComponent extends DisplayComponent
{


  constructor()
  {
    super();

  }

  onAddedToObject()
  {
    this.setProperty("dLocation", 0);
  }

  onAddedToSystem()
  {

  }

  onResourcesLoaded()
  {

  }

  update(dt)
  {

  }

  render(dt, x, y)
  {

  }

}

export default PenaltyDisplayComponent;


