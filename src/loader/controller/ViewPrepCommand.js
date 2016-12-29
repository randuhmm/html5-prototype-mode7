
import puremvc from 'puremvc';
import LoaderMediator from 'loader/view/LoaderMediator';

class ViewPrepCommand extends puremvc.SimpleCommand
{
  
  execute(notification)
  {
    var data = notification.getBody();
    
    var viewComponent = data.viewComponent;
    var startupCallback = data.startupCallback;
    
    this.facade.registerMediator(new LoaderMediator(viewComponent));
    
    startupCallback();
  }
  
}

export default ViewPrepCommand;


