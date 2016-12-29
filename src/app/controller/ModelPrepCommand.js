
import puremvc from 'puremvc';
import DataProxy from 'app/model/DataProxy';
import ResourceProxy from 'app/model/ResourceProxy';
import SoundProxy from 'app/model/SoundProxy';

class ModelPrepCommand extends puremvc.SimpleCommand
{
  
  execute(notification)
  {
    this.facade.registerProxy(new DataProxy());
    this.facade.registerProxy(new ResourceProxy());
    this.facade.registerProxy(new SoundProxy());
    
  }
  
}

export default ModelPrepCommand;


