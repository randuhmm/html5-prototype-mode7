
import puremvc from 'puremvc';
import ApplicationConstants from 'app/ApplicationConstants';
import TitleMediator from 'app/view/TitleMediator';
import Title from 'app/display/Title';
import ResourceProxy from 'app/model/ResourceProxy';
		//SoundProxy from 'app/model/ResourceProxy'
		//'app/model/SoundProxy';

class LoadTitleCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    console.log('LoadTitleCommand::execute');

    // Load the view resources
    this.sendNotification(ApplicationConstants.LOAD_VIEW_RESOURCES, Title);

    //var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
    //soundProxy.setBgm('bgm.menu');

    var data = {};

    var view = new Title(data);
    this.facade.registerMediator(new TitleMediator(view));

    this.sendNotification(ApplicationConstants.SHOW_VIEW, view);

  }

}

export default LoadTitleCommand;


