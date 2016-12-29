
import EngineConstants from 'app/engine/EngineConstants';
import SoundComponent from 'app/engine/component/core/SoundComponent';
import ComponentMessage from 'app/engine/component/core/ComponentMessage';
import ComponentType from 'app/engine/enum/ComponentType';
import minibot from 'minibot';
import Engine from 'app/engine/Engine';
import ResourceType from 'app/resource/ResourceType';
import CandyType from 'app/engine/enum/CandyType';
import GridFlag from 'app/engine/enum/GridFlag';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import SigSlt from 'app/engine/message/SigSlt';

class CandySoundComponent extends SoundComponent
{


  constructor()
  {
    $super();
  }
  
  onAddedToObject()
  {
    $super();

    if(this.hasProperty('fromCursor')) {
      SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_SHOT_END, this.candyShotEnd);
    }
    
    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_DROP_END, this.candyDropEnd);
    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_SHATTER_START, this.candyShatterStart);
  }

  onComponentsAdded()
  {
    if(this.hasProperty('fromCursor')) {
      this.connect(ComponentType.PHYSICS, EngineComponent.SIG_CANDY_SHOT_END, EngineComponent.SLT_CANDY_SHOT_END);
    }
    this.connect(ComponentType.PHYSICS, EngineComponent.SIG_CANDY_DROP_END, EngineComponent.SLT_CANDY_DROP_END);
    this.connect(ComponentType.LOGIC, EngineComponent.SIG_CANDY_SHATTER_START, EngineComponent.SLT_CANDY_SHATTER_START);
  }
  
  onAddedToSystem()
  {
    
  }
  
  onResourcesLoaded()
  {

  }

  candyShotEnd()
  {
    var sound = this.system.playSound(this.getRandomCandyHitSfx());
  }

  candyDropEnd()
  {
    var sound = this.system.playSound(this.getRandomCandyHitSfx());
  }

  candyShatterStart(count)
  {
    var sound = '';
    switch(count) {
      case 1:
        sound = this.system.playSound('sfx.candy.shatter.01');
        break;
      case 2:
        sound = this.system.playSound('sfx.candy.shatter.02');
        break;
      case 3:
        sound = this.system.playSound('sfx.candy.shatter.03');
        break;
      default:
        sound = this.system.playSound('sfx.candy.shatter.04');
        break;
    }

  }

  getRandomCandyHitSfx()
  {
    var l = CandySoundComponent.CANDY_HIT_SFX.length;
    var i = Math.floor(Math.random()*l);
    return CandySoundComponent.CANDY_HIT_SFX[i];
  }
  
}

export default CandySoundComponent;


