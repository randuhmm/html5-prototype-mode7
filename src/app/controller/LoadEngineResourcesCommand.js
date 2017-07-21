
import puremvc from 'puremvc';
import ResourceProxy from 'app/model/ResourceProxy';
import ApplicationConstants from 'app/ApplicationConstants';

class LoadEngineResourcesCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    var engine = notification.getBody();
    var resources = engine.getResources();

    var resourceProxy = this.facade.retrieveProxy(ResourceProxy.NAME);

    for(var type in resources) {
      for(var id in resources[type]) {
        if(resources[type][id] == null) {
          resources[type][id] = resourceProxy.getResource(type, id);
        }
      }
    }

    engine.onResourcesLoaded();

  }

}

export default LoadEngineResourcesCommand;


