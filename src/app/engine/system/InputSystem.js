
import minibot from 'minibot';
import EngineSystem from 'app/engine/system/EngineSystem';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineEvent from 'app/event/EngineEvent';
import InputType from 'app/engine/enum/InputType';

var BindAsEventListener = minibot.core.Utils.BindAsEventListener;

class InputSystem extends EngineSystem
{

  // inputQueue: null,

  // inputHandlers: null,

  constructor()
  {
    super(ComponentType.INPUT);

    this.inputQueue = [];
    this.inputHandlers = {};
  }

  onAddedToEngine()
  {
    this.addEventListener(EngineEvent.INPUT, BindAsEventListener(this.handleInput, this));
  }

  update(dt)
  {
    while(this.inputQueue.length) {
      var q = this.inputQueue.shift();
      while(this.inputQueue.length && this.inputQueue[0].type == q.type) {
        q = this.inputQueue.shift();
      }
      var c = this.inputHandlers[q.type];
      if(c != null) {
        c.input(q.type, q.data);
      }
    }
  }

  handleInput(event)
  {
    this.inputQueue.push(event.data);
  }

  addInputHandler(component, type)
  {
    if(this.inputHandlers[type] != null) {
      // THROW AN ERROR HERE or change to array type...
      alert('hey fix this so it can use multiple handlers');
    } else {
      this.inputHandlers[type] = component;
    }
  }

  removeInputHandler(component, type)
  {

  }

}

export default InputSystem;


