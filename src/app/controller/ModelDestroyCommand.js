
import puremvc from 'puremvc';
import DataProxy from 'app/model/DataProxy';
import ResourceProxy from 'app/model/ResourceProxy';
import SoundProxy from 'app/model/SoundProxy';

class ModelDestroyCommand extends puremvc.SimpleCommand
{
  
  execute(notification)
  {
    console.log('App::ModelDestroyCommand');
    // this.facade.registerProxy(new DataProxy());
    // this.facade.registerProxy(new ResourceProxy());
    // this.facade.registerProxy(new SoundProxy());
    
  }
  
}

export default ModelDestroyCommand;


