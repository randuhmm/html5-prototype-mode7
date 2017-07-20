
import puremvc from 'puremvc';
import ApplicationConstants from 'app/ApplicationConstants';

class ShellMediator extends puremvc.Mediator
{

  constructor(viewComponent)
  {
    console.log("ShellMediator::constructor");
    super(ShellMediator.NAME, viewComponent);
  }

  listNotificationInterests()
  {
    return [
      ApplicationConstants.SHOW_VIEW
    ];
  }

  handleNotification(notification)
  {
    var name = notification.getName();
    var body = notification.getBody();
    switch(name) {
      case ApplicationConstants.SHOW_VIEW:
        this.handleShowView(body);
        break;
    }
  }

  handleShowView(view)
  {
    this.viewComponent.addChild(view);
  }

}

export default ShellMediator;


