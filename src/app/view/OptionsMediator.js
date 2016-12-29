
import BaseMediator from 'app/view/BaseMediator';
import ApplicationConstants from 'app/ApplicationConstants';
import ViewEvent from 'app/event/ViewEvent';

class OptionsMediator extends BaseMediator
{

  constructor(viewComponent)
  {
    super(OptionsMediator.NAME, viewComponent);
  }

  handleViewEvent(event)
  {
    var eventName = event.eventName;
    var data = event.data;
    switch(eventName) {
      case ViewEvent.BACK_SELECTED:
        this.handleBackSelected();
        break;
      default:
        break;
    }
  }

  handleBackSelected()
  {
    this.sendNotification(ApplicationConstants.LOAD_TITLE);
    this.facade.removeMediator(this.getMediatorName());
  }

}

OptionsMediator.NAME = "OptionsMediator";

export default OptionsMediator;


