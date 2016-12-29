
import BaseMediator from 'app/view/BaseMediator';
import ApplicationConstants from 'app/ApplicationConstants';
import ViewEvent from 'app/event/ViewEvent';

class TitleMediator extends BaseMediator
{

  constructor(viewComponent)
  {
    super(TitleMediator.NAME, viewComponent);
  }

  handleViewEvent(event)
  {
    var eventName = event.eventName;
    var data = event.data;
    switch(eventName) {
      case ViewEvent.PLAY_SELECTED:
        this.handlePlaySelected();
        break;
      case ViewEvent.OPTIONS_SELECTED:
        this.handleOptionsSelected();
        break;
      default:
        break;
    }
  }

  handlePlaySelected()
  {
    this.sendNotification(ApplicationConstants.LOAD_GAME);
    this.facade.removeMediator(this.getMediatorName());
  }

  handleOptionsSelected()
  {
    this.sendNotification(ApplicationConstants.LOAD_OPTIONS);
    this.facade.removeMediator(this.getMediatorName());
  }

}

TitleMediator.NAME = "TitleMediator";

export default TitleMediator;

