
import BaseMediator from 'app/view/BaseMediator';
import ApplicationConstants from 'app/ApplicationConstants';
import ViewEvent from 'app/event/ViewEvent';

class GameMediator extends BaseMediator
{

  constructor(viewComponent)
  {
    super(GameMediator.NAME, viewComponent);
  }

  handleViewEvent(event)
  {
    var eventName = event.eventName;
    var data = event.data;
    switch(eventName) {
      case ViewEvent.EXIT_SELECTED:
        this.handlePlaySelected();
        break;
      case ViewEvent.NEXT_STAGE:
        this.handleNextStage(data);
        break;
      case ViewEvent.GAME_EXIT:
        this.handleGameExit();
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

  handleNextStage(level)
  {
    var nextLevel = level.level + 1;
    var tmpFacade = this.facade;
    this.facade.removeMediator(this.getMediatorName());

    tmpFacade.sendNotification(ApplicationConstants.LOAD_GAME, nextLevel);
  }

  handleGameExit()
  {
    this.sendNotification(ApplicationConstants.LOAD_TITLE);
    this.facade.removeMediator(this.getMediatorName());
  }

}

export default GameMediator;


