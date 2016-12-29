

class EngineSystem
{
  
  // type: null,
  
  // components: null,
  
  // componentsByObject: null,
  
  // engine: null,
  
  // initialized: null,
  
  constructor(type)
  {
    this.type = type;
    
    this.components = [];
    
    this.componentsByObject = {};
    
    this.initialized = false;
  }

  destroy()
  {
    for(var i = 0; i < this.components.length; i++) {
      this.components[i].destroy();
    }
    this.components = null;
    this.componentsByObject = null;
    this.engine = null;
  }
  
  onInitialized()
  {
    this.initialized = true;
  }
  
  getType()
  {
    return this.type;
  }
  
  addObject(obj)
  {
    if(obj.hasComponent(this.type)) {
      var c = obj.getComponent(this.type);
      this.components.push(c);
      this.componentsByObject[obj] = c;
      
      c.setSystem(this);
      c.onAddedToSystem();
      
      return c;
    }
    
    return null;
  }
  
  addResource(type, id)
  {
    if(!this.engine) return;
    this.engine.addResource(type, id);
  }
  
  getResource(type, id)
  {
    if(!this.engine) return;
    return this.engine.getResource(type, id);
  }
  
  removeObject(obj)
  {
    if(obj.hasComponent(this.type)) {
      var c = obj.getComponent(this.type);

      var i = this.components.indexOf(c);
      if(i != -1) this.components.splice(i, 1);

      if(this.componentsByObject[obj] != undefined) {
        delete this.componentsByObject[obj];
      }

      return c;
    }

    return null;
  }
  
  setEngine(engine)
  {
    this.engine = engine;
  }

  onAddedToEngine()
  {
    //-- OVERRIDE
  }
  
  onResourcesLoaded()
  {
    
  }
  
  update(dt)
  {
    //-- OVERRIDE
  }
  
  // Helper function to update all components of the system
  updateComponents(dt)
  {
    for(var i = 0; i < this.components.length; i++) {
      this.components[i].update(dt);
    }
  }
  
  dispatchEvent(event)
  {
    this.engine.dispatchEvent(event);
  }

  addEventListener(type, callback)
  {
    this.engine.addEventListener(type, callback);
  }
  
}

export default EngineSystem;


