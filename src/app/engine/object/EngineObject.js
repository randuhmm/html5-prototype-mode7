

class EngineObject
{

  // type: null,
  // components: null,
  // data: null,
  // engine: null,
  
  constructor(type, data)
  {
    this.type = type;
    this.components = {};
    
    if(data == undefined) data = {};
    this.data = data;
  }

  destroy()
  {
    this.components = null;
    this.engine = null;
  }
  
  getType()
  {
    return this.type;
  }

  addComponent(component)
  {
    var type = component.getType()
    if(this.components[type] == undefined) {
      this.components[type] = component;
      component.setObject(this);
      component.onAddedToObject();
    }
  }

  onComponentsAdded()
  {
    for(var c in this.components) {
      this.components[c].onComponentsAdded();
    }
  }

  removeComponent(component)
  {

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
    for(var c in this.components) {
      this.components[c].onResourcesLoaded();
    }
  }

  getComponent(type)
  {
    if(this.components[type] != undefined)
    {
      return this.components[type];
    }
    return null;
  }

  hasComponent(type)
  {
    return (this.components[type] != undefined)
  }

  update(dt)
  {
    for(var c in this.components) {
      this.components[c].update(dt);
    }
  }

  setProperty(key, value)
  {
    this.data[key] = value;
  }

  getProperty(key)
  {
    return this.data[key];
  }

  hasProperty(key)
  {
    return (this.data[key] != undefined);
  }

  sendMessage(message)
  {
    for(var c in this.components) {
      this.components[c].receiveMessage(message);
    }
  }
  
}

export default EngineObject;


