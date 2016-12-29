
import EngineConstants from 'app/engine/EngineConstants';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import ComponentType from 'app/engine/enum/ComponentType';
import InputType from 'app/engine/enum/InputType';
import GridFlag from 'app/engine/enum/GridFlag';
import EngineEvent from 'app/event/EngineEvent';
import SigSlt from 'app/engine/message/SigSlt';
import minibot from 'minibot';

class CursorInputComponent extends EngineComponent
{
  
  // currentSection: null,

  constructor()
  {
    $super(ComponentType.INPUT);
    
    SigSlt.AddSignal(this, EngineComponent.SIG_INPUT_MOVE);
    SigSlt.AddSignal(this, EngineComponent.SIG_INPUT_ADD);
    //this.addSignal(EngineComponent.SIG_MOVE_CURSOR);
    //this.addSlot(CursorInputComponent.MOVE_CURSOR, function() {alert('moved')});
  }
  
  onAddedToObject()
  {
    // location properties
    //this.setProperty("dLocation", 0);
    //this.setProperty("cLocation", 0);
    //this.setProperty("iLocation", 0);
    //this.setProperty("section", 0);

    // flags
    //this.setProperty("moving", false);
    //this.setProperty("inserting", false);
    //this.setProperty("firing", false);
  }

  onComponentsAdded()
  {

  }
  
  onAddedToSystem()
  {
    this.system.addInputHandler(this, InputType.MOVE_CURSOR);
    this.system.addInputHandler(this, InputType.ADD_PIECE);
  }
  
  update(dt)
  {
    // Not allowed on input types
  }

  input(type, data)
  {
    switch(type) {
      case InputType.ADD_PIECE:
        this.addPiece(data);
        break;
      case InputType.MOVE_CURSOR:
        this.moveCursor(data);
        break;
    }
  }

  addPiece(a)
  {
    SigSlt.Emit(this, EngineComponent.SIG_INPUT_ADD, a);
    /*
    var inserting = this.getProperty("inserting");
    if(inserting) return;
    this.setProperty("inserting", true);
    this.setProperty("iLocation", a);
    */
  }

  moveCursor(a)
  {
    SigSlt.Emit(this, EngineComponent.SIG_INPUT_MOVE, a);
    /*
    var sec = Math.floor((a + EngineConstants.SECTION_ANGLE/2) / EngineConstants.SECTION_ANGLE) % (EngineConstants.SECTIONS*2);
    if(sec != this.currentSection) {
      this.system.dispatchEvent(new EngineEvent(EngineEvent.DEL_SEC_FLAGS, null, null, {"sec": this.currentSection, "flag": GridFlag.SELECTED}));
      this.system.dispatchEvent(new EngineEvent(EngineEvent.SET_SEC_FLAGS, null, null, {"sec": sec, "flag": GridFlag.SELECTED}));
      this.currentSection = sec;
      this.setProperty('section', this.currentSection);
    }
    */

  }
  
  
}

export default CursorInputComponent;


