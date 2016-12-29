import minibot from 'minibot' ;
import puremvc from 'puremvc';
import ResourceProxy from 'app/model/ResourceProxy';
import ApplicationConstants from 'app/ApplicationConstants';


class LoadViewResourcesCommand extends  puremvc.SimpleCommand
{
  execute(notification)
  {
    var klass = notification.getBody();

    var resourceProxy = this.facade.retrieveProxy(ResourceProxy.NAME);

    if(klass.RESOURCES != undefined) {
      for(var type in klass.RESOURCES) {
        for(var id in klass.RESOURCES[type]) {
          if(klass.RESOURCES[type][id] == null) {
            klass.RESOURCES[type][id] = resourceProxy.getResource(type, id);
          }
        }
      }
    }

    if(klass.OBJECTS != undefined) {
      for(var i = 0; i < klass.OBJECTS.length; i++) {
        var klassObject = klass.OBJECTS[i];
        this.sendNotification(ApplicationConstants.LOAD_VIEW_RESOURCES, klassObject);
      }
    }

  }
}


export default LoadViewResourcesCommand
