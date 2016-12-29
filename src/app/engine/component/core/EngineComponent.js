
import SigSlt from 'app/engine/message/SigSlt';

class EngineComponent
{
  
  // type: null,
  
  // object: null,
  
  // system: null,
  
  // listeners: null,

  // signals: null,
  
  constructor(type)
  {
    this.type = type;
    
    this.listeners = {};
    this.signals = {};
    this.slots = {};
  }

  destroy()
  {
    for(var i = 0; i < this.signals.length; i++) {
      this.signals[i].disconnect_all();
    }
    this.signals = null;
    this.slots = null;
    this.listeners = null;
    this.system = null;
    this.object = null;
  }
  
  getType()
  {
    return this.type;
  }

  setProperty(key, value)
  {
    this.object.setProperty(key, value);
  }

  getProperty(key)
  {
    return this.object.getProperty(key);
  }

  hasProperty(key)
  {
    return this.object.hasProperty(key);
  }
  
  setObject(object)
  {
    this.object = object;
  }
  
  onAddedToObject()
  {
    //-- OVERRIDE
  }

  onComponentsAdded()
  {
    //-- OVERRIDE
  }
  
  setSystem(system)
  {
    this.system = system;
  }
  
  getSystem()
  {
    return this.system;
  }
  
  onAddedToSystem()
  {
    //-- OVERIDE?
  }

  sendMessage(message)
  {
    this.object.sendMessage(message);
  }

  addListener(type, func, obj)
  {
    if(obj == null) obj = this.listeners;
    obj[type] = func;
  }
  
  addResource(type, id)
  {
    if(this.system == null) return;
    this.system.addResource(type, id);
  }
  
  getResource(type, id)
  {
    if(this.system == null) return;
    return this.system.getResource(type, id);
  }
  
  onResourcesLoaded()
  {
    
  }

  callListener(type, listeners, params)
  {
    var f = listeners[type];
    if(f == null) return;
    f(params)
  }

  receiveMessage(message)
  {
    this.callListener(message.type, this.listeners, message)
  }

  update(dt)
  {
    //-- OVERRIDE
  }

  connect(sender, signal, slot)
  {
    var c = this.object.getComponent(sender);
    if(!c) return;
    SigSlt.Connect(c, signal, this, slot);
  }
  
}

export default EngineComponent;


