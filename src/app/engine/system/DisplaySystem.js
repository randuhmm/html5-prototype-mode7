
import EngineSystem from 'app/engine/system/EngineSystem';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineEvent from 'app/event/EngineEvent';
import ResourceType from 'app/resource/ResourceType';

class DisplaySystem extends EngineSystem
{
  
  // layers: null,
  
  
  // maxDepth: null,
  
  // isZooming: null,
  // zoomLevel: null,
  // zoomLevelDest: null,
  
  constructor()
  {
    $super(ComponentType.DISPLAY);
    
    this.layers = [];
    this.isInserting = false;
    this.isZooming = false;
  }
  
  setup()
  {
    this.findMaxDepth();
    this.zoomLevel = this.maxDepth;
  }
  
  addObject(obj)
  {
    var c = $super(obj);
    if(c == null) return null;
    
    var l = c.getLayers();
    for(var i = 0; i < l.length; i++) {
      this.addToLayer(c, l[i]);
    }
  }
  
  removeObject(obj)
  {
    var c = $super(obj);
    if(c == null) return null;
    
    var l = c.getLayers();
    for(var i = 0; i < l.length; i++) {
      this.removeFromLayer(c, l[i]);
    }
  }
  
  addToLayer(component, layer)
  {
    while(!this.layers[layer]) {
      this.layers.push([]);
    }
    this.layers[layer].push(component);
  }
  
  removeFromLayer(component, layer)
  {
    var arr = this.layers[layer];
    var i = arr.indexOf(component);
    if(i != -1) arr.splice(i, 1);

  }

  onAddedToEngine()
  {
    this.engine.addEventListener(EngineEvent.DEPTH_CHANGED, this.handleDepthChanged.bindAsEventListener(this));
    
    this.addResource(ResourceType.SPRITE, 'object.candy.01');
    this.addResource(ResourceType.SPRITE, 'object.candy.02');
    this.addResource(ResourceType.SPRITE, 'object.candy.03');
    this.addResource(ResourceType.SPRITE, 'object.candy.04');
    this.addResource(ResourceType.SPRITE, 'object.candy.05');
    this.addResource(ResourceType.SPRITE, 'object.candy.06');
    this.addResource(ResourceType.SPRITE, 'object.candy.07');

    this.addResource(ResourceType.SPRITE, 'object.bow');
  }
  
  // update all of the components 
  update(dt)
  {
    
  }
  
  getZoomLevel()
  {
    if(this.zoomLevel < 2) return 2;
    return this.zoomLevel;
  }
  
  getViewport()
  {
    return this.engine.viewport;
  }
  
  getScene()
  {
    return this.engine.scene;
  }
  
  // render the scene layer by layer, check if each component is on screen first
  render(dt, x, y)
  {

    if(this.isZooming) {
      this.zoomLevel += (this.zoomLevelDest - this.zoomLevel) * 0.1;
      if(Math.abs(this.zoomLevelDest - this.zoomLevel) <= 0.01) {
        this.isZooming = false;
        this.zoomLevel = this.zoomLevelDest;
      }
    }
    
    var i, j, layer, component;
    for(i = 0; i < this.layers.length; i++) {
      layer = this.layers[i];
      for(j = 0; j < layer.length; j++) {
        component = layer[j];
        if(!component.isVisible()) continue;
        component.render(dt, x, y);
      }
    }
  }
  
  handleDepthChanged(event)
  {
    if(!this.isZooming) {
      this.isZooming = true;
      this.zoomLevelDest = event.data;
    }
  }
  
}

export default DisplaySystem;


