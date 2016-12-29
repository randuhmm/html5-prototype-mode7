
import puremvc from 'puremvc';
import ScriptsProxy from 'loader/model/ScriptsProxy';

class ModelPrepCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    var data = notification.getBody();

    var head = data.head;
    var scriptsArray = data.scriptsArray;

    // Load and initialize the data
    if(!this.facade.hasProxy(ScriptsProxy.NAME)) {
      var scriptsProxy = new ScriptsProxy(head, scriptsArray);
      this.facade.registerProxy(scriptsProxy);
    }

  }

}

export default ModelPrepCommand;


