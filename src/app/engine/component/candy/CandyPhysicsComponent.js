
import GridSystem from 'app/engine/system/GridSystem';
import EngineConstants from 'app/engine/EngineConstants';
import ComponentType from 'app/engine/enum/ComponentType';
import GameObjectType from 'app/engine/enum/GameObjectType';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import PhysicsComponent from 'app/engine/component/core/PhysicsComponent';
import EngineEvent from 'app/event/EngineEvent';
import SigSlt from 'app/engine/message/SigSlt';
import minibot from 'minibot';

class CandyPhysicsComponent extends PhysicsComponent
{

  // dropping: null,

  // shooting: null,
  // shootingSection: null,

  constructor()
  {
    super();
    this.shooting = false;
    this.dropping = false;
  }

  onAddedToObject()
  {
    if(this.hasProperty('fromCursor')) {
      this.shooting = true;
      this.shootingSection = this.getProperty('sec');
      SigSlt.AddSignal(this, EngineComponent.SIG_CANDY_SHOT_END);
    }

    SigSlt.AddSignal(this, EngineComponent.SIG_CANDY_DROP_END);
    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_DROP_START, this.candyDropStart);
  }

  onAddedToSystem()
  {

  }

  onComponentsAdded()
  {
    this.connect(ComponentType.GRID, EngineComponent.SIG_CANDY_DROP_START, EngineComponent.SLT_CANDY_DROP_START);
  }

  onResourcesLoaded()
  {

  }

  update(dt)
  {
    if(this.shooting) {
      var h = this.getProperty('h');
      h -= dt/40;
      this.setProperty('h', h);
      var sec = this.getProperty('sec');

      if(h <= (sec%2)) {
        this.shooting = false;
        this.setProperty('h', (sec%2));
        SigSlt.Emit(this, EngineComponent.SIG_CANDY_SHOT_END, this);
      } else {
        var gridSystem = this.system.engine.getSystem(ComponentType.GRID);
        gridSystem.iterateBySection(this.shootingSection, function(x, y) {
          if(gridSystem.hasAt(x, y)) {
            var t = EngineConstants.GridToWorldH(x, y) + 2;
            if(h <= t) {
              this.shooting = false;
              this.setProperty('h', t);
              SigSlt.Emit(this, EngineComponent.SIG_CANDY_SHOT_END, this);
              throw GridSystem.$break;
            }
          }
        }.bind(this));
      }
    } else if(this.dropping) {
      var h = this.getProperty('h');
      h -= dt/80;
      this.setProperty('h', h);
      var sec = this.getProperty('sec');

      if(h <= (sec%2)) {
        this.dropping = false;
        this.setProperty('h', (sec%2));
        SigSlt.Emit(this, EngineComponent.SIG_CANDY_DROP_END, this);
      } else {
        var gridSystem = this.system.engine.getSystem(ComponentType.GRID);
        gridSystem.iterateBySection(sec, function(x, y) {
          if(gridSystem.hasAt(x, y)) {
            var t = EngineConstants.GridToWorldH(x, y) + 2;
            if(h <= t) {
              this.dropping = false;
              this.setProperty('h', t);
              SigSlt.Emit(this, EngineComponent.SIG_CANDY_DROP_END, this);
              throw GridSystem.$break;
            }
          }
        }.bind(this));
      }
    }
  }

  candyDropStart()
  {
    console.log("DROPPING");
    this.dropping = true;
  }

}

export default CandyPhysicsComponent;


