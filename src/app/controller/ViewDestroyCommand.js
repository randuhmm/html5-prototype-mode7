
import puremvc from 'puremvc';
import minibot from 'minibot';
import ShellMediator from 'app/view/ShellMediator';
import Shell from 'app/display/Shell';
import BaseView from 'app/display/BaseView';

var Utils = minibot.core.Utils;

class ViewDestroyCommand extends puremvc.SimpleCommand
{

  execute(notification)
  {
    console.log('App::ViewDestroyCommand');
    // var data = notification.getBody();

    // var sceneOptions = {};
    // if(data['sceneOptions'] != undefined) {
    //   sceneOptions = data.sceneOptions;
    // }

    // var scene = minibot.system.CreateScene(sceneOptions);
    // this.facade.setScene(scene);
    // minibot.system.SetRenderCallback(Utils.Bind(this.facade.render, this.facade));

    // var shell = new Shell(scene);
    // this.facade.registerMediator(new ShellMediator(shell));

    // BaseView.WIDTH = scene.getWidth();
    // BaseView.HEIGHT = scene.getHeight();
  }

}

export default ViewDestroyCommand;


