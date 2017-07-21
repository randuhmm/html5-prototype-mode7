
import puremvc from 'puremvc';
import minibot from 'minibot';
import ApplicationConstants from 'app/ApplicationConstants';
import GameMediator from 'app/view/GameMediator';
import Game from 'app/display/Game';
import Engine from 'app/engine/Engine';
import SoundProxy from 'app/model/SoundProxy';
import DataProxy from 'app/model/DataProxy';

class LoadGameCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    console.log('LoadGameCommand::execute');

    var levelNum = notification.getBody();
    if(!levelNum) levelNum = 1;

    // Load the Game view resources
    this.sendNotification(ApplicationConstants.LOAD_VIEW_RESOURCES, Game);

    var dataProxy = this.facade.retrieveProxy(DataProxy.NAME);
    var level = dataProxy.getLevel(levelNum);

    // Create the engine
    var engine = new Engine(level);

    var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
    // soundProxy.setBgm('bgm.game');

    // Add the engine to the update loop
    minibot.system.SetUpdateCallback(engine.update.bind(engine));

    // Load the Engine resources
    this.sendNotification(ApplicationConstants.LOAD_ENGINE_RESOURCES, engine);

    // Create the Game view
    var viewData = {};
    viewData.level = level;
    viewData.engine = engine;
    viewData.soundProxy = soundProxy;
    var view = new Game(viewData);

    // Register the Mediator
    this.facade.registerMediator(new GameMediator(view));

    // Show the new view
    this.sendNotification(ApplicationConstants.SHOW_VIEW, view);

  }

}

export default LoadGameCommand;


