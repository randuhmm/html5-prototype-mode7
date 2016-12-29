
import puremvc from 'puremvc';
import ApplicationConstants from 'loader/ApplicationConstants';
import ScriptsProxy from 'loader/model/ScriptsProxy';
import StartupCommand from 'loader/controller/StartupCommand';

class ApplicationFacade extends puremvc.Facade
{

  constructor(key)
  {
    super(key);
  }

  initializeController()
  {
    super.initializeController();
    this.registerCommand(ApplicationConstants.STARTUP, StartupCommand);
  }

  startup(viewComponent, head, scriptsArray, startupCallback)
  {
    var data = {};
    data.viewComponent = viewComponent;
    data.head = head;
    data.scriptsArray = scriptsArray;
    data.startupCallback = startupCallback;

    this.sendNotification(ApplicationConstants.STARTUP, data);
  }

  loadScripts(scriptsLoadedCallback)
  {
    var scriptsProxy = this.retrieveProxy(ScriptsProxy.NAME);
    scriptsProxy.loadScripts(scriptsLoadedCallback);
  }

  updateProgress(progress)
  {
    this.sendNotification(ApplicationConstants.UPDATE_PROGRESS, {progress: progress});
  }

}

ApplicationFacade.getInstance = function(key)
{
  if (!puremvc.Facade.hasCore(key)) {
    new ApplicationFacade(key);
  }
  var retVal = puremvc.Facade.getInstance(key);
  return retVal;
};

ApplicationFacade.KEY = "Loader.Shell";


export default ApplicationFacade;


