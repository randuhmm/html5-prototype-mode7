
import minibot from 'minibot';
import ComponentType from 'app/engine/enum/ComponentType';

var InputSystem = minibot.engine.system.InputSystem;

class KartInputSystem extends InputSystem
{

  constructor()
  {
    super(ComponentType.INPUT);
  }

}

export default KartInputSystem;
