
import minibot from 'minibot';

class EngineEvent extends minibot.event.EngineEvent
{

  constructor(type, object, component, data)
  {
    super(type, object, component, data);
  }

}

export default EngineEvent;


