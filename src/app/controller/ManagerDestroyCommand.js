
import puremvc from 'puremvc';
import minibot from 'minibot';
import ApplicationConstants from 'app/ApplicationConstants';
import DataProxy from 'app/model/DataProxy';
import ResourceProxy from 'app/model/ResourceProxy';
import SoundProxy from 'app/model/SoundProxy';

var Utils = minibot.core.Utils;

class ManagerDestroyCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    console.log('App::ManagerDestroyCommand');
    // var data = notification.getBody();

    // var progressCallback = data.progressCallback;
    // var completeCallback = data.completeCallback;

    // // Load and initialize the data
    // var dataProxy = this.facade.retrieveProxy(DataProxy.NAME);
    // if(!dataProxy.isManagerLoaded) {
    //   dataProxy.initDataManager(Utils.Bind(function() {
    //     console.log('App::ManagerDestroyCommand - Finished Prepping Data');
    //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
    //   }, this), progressCallback);
    //   return;
    // }

    // // Load and initialize the resources
    // var resourceProxy = this.facade.retrieveProxy(ResourceProxy.NAME);
    // if(!resourceProxy.isManagerLoaded) {
    //   resourceProxy.initResourceManager(Utils.Bind(function() {
    //     console.log('App::ManagerDestroyCommand - Finished Prepping Resources');
    //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
    //   }, this), progressCallback);
    //   return;
    // }

    // // Load and initialize the sounds
    // // var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
    // // if(!soundProxy.isManagerLoaded) {
    // //   soundProxy.initSoundManager(function() {
    // //     console.log('App::ManagerDestroyCommand - Finished Prepping Sounds');
    // //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
    // //   }.bind(this), progressCallback);
    // //   return;
    // // }

    // this.sendNotification(ApplicationConstants.LOAD_TITLE);

    // // This will let the loader know that the app has completed loading
    // // and the loading screen will be removed.

    // Stop the system
    minibot.system.Stop();

    // Utils.Defer(completeCallback, this);
  }
}

export default ManagerDestroyCommand;


