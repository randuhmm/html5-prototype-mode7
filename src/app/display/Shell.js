
import minibot from 'minibot';

class Shell
{
  
  // scene: null,
  
  // currentView: null,
  
  constructor(scene)
  {
    this.scene = scene;
  }
  
  addChild(view)
  {
    if(this.currentView == null) {
      this.scene.addChild(view);
      this.currentView = view;
    } else {
      
      // TODO: Add code to transition the current view out and load the new view in...
      // perhaps some cool canvas effect?? YES, try to use purple meta balls in a canvas to
      // fill the screen randomly, then pop them off the screen. maybe like a 0.5 second animation
      this.scene.removeChild(this.currentView);
      this.currentView = view;
      this.scene.addChild(view);
    }
    
    // This should already be done in BaseView
    //this.currentView.setWidth(this.scene.getWidth());
    //this.currentView.setHeight(this.scene.getHeight());
    
  }
  
}

export default Shell;


