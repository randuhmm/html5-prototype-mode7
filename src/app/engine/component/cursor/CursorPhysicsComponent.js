
import EngineConstants from 'app/engine/EngineConstants';
import ComponentType from 'app/engine/enum/ComponentType';
import GameObjectType from 'app/engine/enum/GameObjectType';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import PhysicsComponent from 'app/engine/component/core/PhysicsComponent';
import EngineEvent from 'app/event/EngineEvent';
import SigSlt from 'app/engine/message/SigSlt';
import minibot from 'minibot';

class CursorPhysicsComponent extends PhysicsComponent
{
  
  // firingTime: null,

  // dispenserLocation: null,
  // cursorLocation: null,
  // insertLocation: null,
  // section: null,

  // currentSection: null,
  // dispenserSection: null,

  // moving: null,
  // inserting: null,
  // firing: null,
  // shooting: null,

  constructor()
  {
    $super();


    this.dispenserLocation = 0;
    this.cursorLocation = 0;
    this.insertLocation = 0;
    this.section = 0;

    this.currentSection = 0;
    this.dispenserSection = 0;
    this.insertSection = 0;

    this.moving = false;
    this.inserting = false;
    this.firing = false;
    this.shooting = false;

    SigSlt.AddSlot(this, EngineComponent.SLT_CURSOR_MOVE, this.cursorMove);
    SigSlt.AddSlot(this, EngineComponent.SLT_CURSOR_ADD, this.cursorAdd);

    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_SHOT_END, this.candyShotEnd);
  }
  
  onAddedToObject()
  {
    
  }
  
  onAddedToSystem()
  {
    this.setProperty('nextPiece', this.system.engine.randomCandy());

    this.system.engine.addEventListener(EngineEvent.FORCE_DROP, this.handleForceDrop.bindAsEventListener(this));
  }

  onComponentsAdded()
  {
    this.connect(ComponentType.INPUT, EngineComponent.SIG_INPUT_MOVE, EngineComponent.SLT_CURSOR_MOVE);
    this.connect(ComponentType.INPUT, EngineComponent.SIG_INPUT_ADD, EngineComponent.SLT_CURSOR_ADD);
  }
  
  onResourcesLoaded()
  {

  }
  
  update(dt)
  {
    this.moveDispenser(dt);
  }

  cursorMove(a)
  {
    var sec = Math.floor((a + EngineConstants.SECTION_ANGLE/2) / EngineConstants.SECTION_ANGLE) % (EngineConstants.SECTIONS*2);
    if(sec != this.currentSection) {
      this.moving = true;
      this.currentSection = sec;
    }
  }

  cursorAdd(a)
  {
    if(this.inserting || this.shooting) return;
    this.inserting = true;
    this.insertSection = Math.floor((a + EngineConstants.SECTION_ANGLE/2) / EngineConstants.SECTION_ANGLE) % (EngineConstants.SECTIONS*2);
  }

  handleForceDrop()
  {
    if(this.inserting || this.shooting) return;
    this.inserting = true;
    this.insertSection = this.currentSection;
  }

  moveDispenser(dt)
  {
    //if(this.shooting) return;
    // Move dispenser to insert location
    var MOVE_ANGLE = Math.PI/180;
    var MIN_ANGLE = Math.PI/4;
    var dest = null;

    if(this.moving) {
      if(this.inserting) {
        dest = this.insertSection * EngineConstants.SECTION_ANGLE;
      } else {
        dest = this.currentSection * EngineConstants.SECTION_ANGLE;
      }
      var d1 = dest - this.dispenserLocation;
      var d2;
      var dF = this.dispenserLocation;
      if(d1 < 0) {
        d2 = (2*Math.PI + d1);
      } else {
        d2 = -1*(2*Math.PI - d1);
      }
      if(Math.abs(d1) <= Math.abs(d2)) {
        dF = d1;
      } else {
        dF = d2;
      }
      
      if(Math.abs(dF) < MOVE_ANGLE) {
        this.dispenserLocation = dest;
        this.moving  = false;
        if(this.inserting) {
          this.firing = true;
        }
      } else {
        this.dispenserLocation = (this.dispenserLocation + (dF*dt/150))%(2*Math.PI)
        if(this.dispenserLocation < 0) this.dispenserLocation += 2*Math.PI;
      }
      this.setProperty("dLocation", this.dispenserLocation);
    } else if(this.inserting) {
      this.firing = true;
    }

    if(this.firing) {

      this.firing = false;
      this.inserting = false;
      this.shooting = true;

      var type = this.getProperty('nextPiece');
      this.setProperty('nextPiece', this.system.engine.randomCandy());

      var h = 13 - (10 - this.system.engine.getSystem(ComponentType.DISPLAY).getZoomLevel());
      var a = this.insertSection * EngineConstants.SECTION_ANGLE;

      var candy = this.system.engine.createObject(
        GameObjectType.CANDY,
        {
  //         "candyType": type,
  //         "fromCursor": true,
  //         "h": h,
  //         "a": a,
          "sec": this.insertSection
        }
      );

      SigSlt.Connect(candy.getComponent(ComponentType.PHYSICS), EngineComponent.SIG_CANDY_SHOT_END, this, EngineComponent.SLT_CANDY_SHOT_END);
      this.system.engine.addObject(candy);
    }

  }

  candyShotEnd(candy)
  {
    this.shooting = false;
    this.moving = true;
  }
  
}

export default CursorPhysicsComponent;


