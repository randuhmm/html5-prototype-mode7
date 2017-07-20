
import minibot from 'minibot';

class ViewEvent extends minibot.event.BaseEvent
{
  // eventName: null,

  // data: null,

  constructor(eventName, data)
  {
    super(ViewEvent.EVENT_TYPE);
    this.eventName = eventName;
    this.data = data;
  }
}

ViewEvent.EVENT_TYPE = "ViewEvent";

ViewEvent.LEVEL_SELECTED = "LevelSelected";
ViewEvent.PLAY_SELECTED = "PlaySelected";
ViewEvent.OPTIONS_SELECTED = "OptionsSelected";
ViewEvent.BACK_SELECTED = "BackSelected";
ViewEvent.EXIT_SELECTED = "ExitSelected";

ViewEvent.GAME_EXIT = "GameExit";
ViewEvent.NEXT_STAGE = "NextStage";

export default ViewEvent;


