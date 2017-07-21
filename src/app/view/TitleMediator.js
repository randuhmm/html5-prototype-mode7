
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
        this.handleLevelSelected(data);
        break;
      case ViewEvent.EXIT_SELECTED:
        this.handleExitSelected();
        break;
      default:
        break;
    }
  }

  handleLevelSelected(level)
  {
    this.sendNotification(ApplicationConstants.LOAD_GAME, level);
    this.facade.removeMediator(this.getMediatorName());
  }

  handleExitSelected()
  {
    console.log('TitleMediator::handleExitSelected');
    this.sendNotification(ApplicationConstants.EXIT_APP);
  }

}

TitleMediator.NAME = "TitleMediator";

export default TitleMediator;

