
import puremvc from 'puremvc';
import ApplicationConstants from 'app/ApplicationConstants';
import OptionsMediator from 'app/view/OptionsMediator';
import Options from 'app/display/Options';
import ResourceProxy from 'app/model/ResourceProxy';
		//SoundProxy from 'app/model/ResourceProxy'
		//'app/model/SoundProxy';

class LoadOptionsCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    console.log('LoadOptionsCommand::execute');

    var resourceProxy = this.facade.retrieveProxy(ResourceProxy.NAME);

    //var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
    //soundProxy.setBgm('bgm.menu');

    var data = {};

    var view = new Options(data);
    this.facade.registerMediator(new OptionsMediator(view));

    this.sendNotification(ApplicationConstants.SHOW_VIEW, view);

  }

}

export default LoadOptionsCommand;


