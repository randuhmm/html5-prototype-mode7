
import minibot from 'minibot';
import puremvc from 'puremvc';
import ApplicationConstants from 'app/ApplicationConstants';
import StartupCommand from 'app/controller/StartupCommand';
import ManagerPrepCommand from 'app/controller/ManagerPrepCommand';
import ShutdownCommand from 'app/controller/ShutdownCommand';
import LoadTitleCommand from 'app/controller/LoadTitleCommand';
import LoadGameCommand from 'app/controller/LoadGameCommand';
import LoadOptionsCommand from 'app/controller/LoadOptionsCommand';
import LoadViewResourcesCommand from 'app/controller/LoadViewResourcesCommand';
import LoadEngineResourcesCommand from 'app/controller/LoadEngineResourcesCommand';

class ApplicationFacade extends puremvc.Facade
{

  // scene: null,

  constructor(key)
  {
    super(key);
  }

  initializeController()
  {
    super.initializeController();
    this.registerCommand(ApplicationConstants.STARTUP, StartupCommand);
    this.registerCommand(ApplicationConstants.SHUTDOWN, ShutdownCommand);
    this.registerCommand(ApplicationConstants.MANAGER_PREP, ManagerPrepCommand);

    this.registerCommand(ApplicationConstants.LOAD_TITLE, LoadTitleCommand);
    this.registerCommand(ApplicationConstants.LOAD_GAME, LoadGameCommand);
    this.registerCommand(ApplicationConstants.LOAD_OPTIONS, LoadOptionsCommand);

    this.registerCommand(ApplicationConstants.LOAD_VIEW_RESOURCES, LoadViewResourcesCommand);
    this.registerCommand(ApplicationConstants.LOAD_ENGINE_RESOURCES, LoadEngineResourcesCommand);
  }

  startup(options)
  {
    this.sendNotification(ApplicationConstants.STARTUP, options);
  }

  shutdown(options) {
    this.sendNotification(ApplicationConstants.SHUTDOWN, options);
  }

  update(dt)
  {

  }

  render(dt)
  {
    this.scene.clear();
    this.scene.render(dt);
  }

  setScene(scene)
  {
    this.scene = scene;
  }

  getScene()
  {
    return scene;
  }

}

ApplicationFacade.getInstance = function(key)
{
  if(!puremvc.Facade.hasCore(key)) {
    new ApplicationFacade(key);
  }
  var retVal = puremvc.Facade.getInstance(key);
  return retVal;
};



ApplicationFacade.removeCore = function(key)
{
  puremvc.Facade.removeCore(key);
};

ApplicationFacade.KEY = "App.Shell";

export default ApplicationFacade;
