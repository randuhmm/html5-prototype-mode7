
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
      case ViewEvent.LEVEL_SELECTED:
        this.handleLevelSelected();
        break;
      case ViewEvent.EXIT_SELECTED:
        this.handleExitSelected();
        break;
      default:
        break;
    }
  }

  handleLevelSelected()
  {
    // this.sendNotification(ApplicationConstants.LOAD_GAME);
    // this.facade.removeMediator(this.getMediatorName());
  }

  handleExitSelected()
  {
    console.log('TitleMediator::handleExitSelected');
    this.sendNotification(ApplicationConstants.EXIT_APP);
    //this.facade.removeMediator(this.getMediatorName());
  }

}

TitleMediator.NAME = "TitleMediator";

export default TitleMediator;

