
import EngineEvent from 'app/event/EngineEvent';
import ComponentType from 'app/engine/enum/ComponentType';

class SoundSystem extends EngineSystem
{

  // soundProxy: null,

  constructor()
  {
    super(ComponentType.SOUND);
  }

  onAddedToEngine()
  {

  }

  setSoundProxy(soundProxy)
  {
    this.soundProxy = soundProxy;
  }

  update(dt)
  {
    //this.updateComponents(dt);
  }

  playSound(id, options)
  {
    return this.soundProxy.playSound(id, options);
  }

}

export default SoundSystem;


