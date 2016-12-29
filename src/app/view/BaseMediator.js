
import puremvc from 'puremvc';
import minibot from 'minibot';
import ViewEvent from 'app/event/ViewEvent';

var Utils = minibot.core.Utils;


class BaseMediator extends puremvc.Mediator
{

  constructor(name, viewComponent) {
    super(name, viewComponent);
    this.viewEventBfx = Utils.Bind(this.handleViewEvent, this);
  }


  onRegister()
  {
    this.viewComponent.addEventListener(ViewEvent.EVENT_TYPE, this.viewEventBfx);
  }

  onRemove()
  {
    this.viewComponent.removeEventListener(ViewEvent.EVENT_TYPE, this.viewEventBfx);
    this.viewEventBfx = null;
    this.viewComponent = null;
  }

  handleViewEvent(event)
  {
    var eventName = event.eventName;
    var data = event.data;
    switch(eventName) {
      default:
        break;
    }
  }

}

export default BaseMediator;
