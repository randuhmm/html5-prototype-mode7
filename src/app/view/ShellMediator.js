
import puremvc from 'puremvc';
import ApplicationConstants from 'app/ApplicationConstants';

class ShellMediator extends puremvc.Mediator
{

  constructor(viewComponent, options)
  {
    console.log("ShellMediator::constructor");
    super(ShellMediator.NAME, viewComponent);
    this.options = options;
  }

  listNotificationInterests()
  {
    return [
      ApplicationConstants.SHOW_VIEW,
      ApplicationConstants.EXIT_APP
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
      case ApplicationConstants.EXIT_APP:
        this.handleExitApp(body);
        break;
    }
  }

  handleShowView(view)
  {
    this.viewComponent.addChild(view);
  }

  handleExitApp(body)
  {
    console.log('ShellMediator::handleExitApp');
    if('exitCallback' in this.options) {
      this.options.exitCallback();
    }
  }

}

export default ShellMediator;


