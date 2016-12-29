
import puremvc from 'puremvc';
import ApplicationConstants from 'loader/ApplicationConstants';

class LoaderMediator extends puremvc.Mediator
{

  constructor(viewComponent)
  {
    super(LoaderMediator.NAME, viewComponent);
  }

  listNotificationInterests()
  {
    return [
      ApplicationConstants.UPDATE_PROGRESS
    ];
  }

  handleNotification(notification)
  {
    var name = notification.getName();
    var body = notification.getBody();
    switch(name) {
      case ApplicationConstants.UPDATE_PROGRESS:
        this.handleUpdateProgress(body);
    }
  }

  handleUpdateProgress(data)
  {
    this.viewComponent.update(data.progress);
  }
}

export default LoaderMediator;


