
import minibot from 'minibot';
import EngineConstants from 'app/engine/EngineConstants';
import ComponentType from 'app/engine/enum/ComponentType';
import GameObjectType from 'app/engine/enum/GameObjectType';
import CandyType from 'app/engine/enum/CandyType';
import InputSystem from 'app/engine/system/InputSystem';
import LogicSystem from 'app/engine/system/LogicSystem';
import GridSystem from 'app/engine/system/GridSystem';
import PhysicsSystem from 'app/engine/system/PhysicsSystem';
import DisplaySystem from 'app/engine/system/DisplaySystem';
import SoundSystem from 'app/engine/system/SoundSystem';
import StatisticsSystem from 'app/engine/system/StatisticsSystem';
import ObjectFactory from 'app/engine/factory/ObjectFactory';

class EventDispatcher extends EventDispatcher
{
  
  // List of all systems
  // systems: null,
  
  // List of all systems by type
  // systemsByType: null,
  
  // List of all objects
  // objects: null,
  
  // List of objects by type
  // objectsByType: null,
  
  // The primary camera
  // scene: null,
  // viewport: null,
  
  // The resource map
  // resources: null,
  // resourcesLoaded: null,
  
  // flags
  // running: false,
  // lastTime: null,
  // thisTime: null,
  
  // MOVETHIS TO GRID SYSTEM?

  // list of candy types
  // candyTypes: null,


  constructor(level)
  {
    $super();

    /*
    var defaultOptions = {};
    defaultOptions.level = 1;
    defaultOptions.initialRows = 3;
    defaultOptions.tickSpeed = 800;
    defaultOptions.matches = 20;
    defaultOptions.candyTypes = [CandyType.A, CandyType.B, CandyType.C, CandyType.D];
    if(options != undefined) {
      Object.extend(defaultOptions, options);
    }
    */
    this.level = level;
    
    this.resources = {};
    this.resourcesLoaded = false;
    
    this.systems = [];
    this.systemsByType = {};
    this.objects = [];
    this.objectsByType = {};

    this.inputQueue = [];
    
    // Set the candy types
    this.candyTypes = this.level.candyTypes;
    
    // Add the systems
    this.addSystem(new InputSystem());
    this.addSystem(new LogicSystem({
  //     tickSpeed: this.level.tickSpeed,
      matches: this.level.matches
    }));
    this.addSystem(new GridSystem(EngineConstants.SECTIONS, EngineConstants.DEPTH));
    this.addSystem(new PhysicsSystem());
    this.addSystem(new DisplaySystem());
    this.addSystem(new SoundSystem());
    this.addSystem(new StatisticsSystem());

    // Add cursor
    var cursor = ObjectFactory.Create(GameObjectType.CURSOR);
    this.addObject(cursor);
    
    // Add initial candies
    for(var y = 0; y < this.level.initialRows; y++) {
      for(var x = 0; x < EngineConstants.SECTIONS; x++) {
        var candy = ObjectFactory.Create(
          GameObjectType.CANDY,
          {
  //           "candyType": this.randomCandy(),
  //           "x": x,
            "y": y
          }
        );
        this.addObject(candy);
      }
    }
    
    for(i = 0; i < this.systems.length; i++) {
      this.systems[i].onInitialized();
    }
    
  }

  destroy()
  {
    this.running = false;
    for(i = 0; i < this.objects.length; i++) {
      this.objects.destroy();
    }
    for(i = 0; i < this.systems.length; i++) {
      this.systems.destroy();  
    }
    this.systems = null;
    this.objects = null;
    this.removeAllEventListeners();
  }
  
  getResources()
  {
    return this.resources;
  }
  
  getResource(type, id)
  {
    if(this.resources[type] == undefined) return null;
    if(this.resources[type][id] == undefined) return null;
    return this.resources[type][id];
  }
  
  addResource(type, id)
  {
    if(this.resources[type] == undefined) this.resources[type] = {};
    this.resources[type][id] = null;
  }
  
  onResourcesLoaded()
  {
    this.resourcesLoaded = true;
    var i;
    for(i = 0; i < this.systems.length; i++) {
      this.systems[i].onResourcesLoaded();
    }
    for(i = 0; i < this.objects.length; i++) {
      this.objects[i].onResourcesLoaded();
    }
  }
  
  start()
  {
    if(this.running) return;
    this.running = true;
  }
  
  stop()
  {
    this.running = false;
    // Stop each sub system?
  }

  update(dt)
  {
    
    // Check if we are running
    if(!this.running) return;

    // Update the Systems in preset order
    for(var s = 0; s < Engine.UPDATE_ORDER.length; s++) {
      this.systemsByType[Engine.UPDATE_ORDER[s]].update(dt);
    }
  }
  
  render(dt, x, y)
  {
    x += this.viewport.x;
    y += this.viewport.y;
    this.systemsByType[ComponentType.DISPLAY].render(dt, x, y);
  }
  
  renderPhysics()
  {
    var object, component;
    for(var i = 0; i < this.objects.length; i++) {
      object = this.objects[i];
      if(!object.hasComponent(ComponentType.PHYSICS)) continue;
      component = object.getComponent(ComponentType.PHYSICS);
      component.render(this.context);
    }
  }
  
  setScene(scene)
  {
    this.scene = scene;
  }

  setSoundProxy(soundProxy)
  {
    this.systemsByType[ComponentType.SOUND].setSoundProxy(soundProxy);
  }
  
  setViewport(viewport)
  {
    this.viewport = viewport;
    EngineConstants.R = viewport.w / EngineConstants.BASE_R;
  }
  
  addObject(obj)
  {
    // Add to objects
    this.objects.push(obj);
    
    // Add to objectsByType
    var type = obj.getType();
    if(this.objectsByType[type] == undefined) {
      this.objectsByType[type] = [];
    }
    this.objectsByType[type].push(obj);
    
    // Add to systems if component is available
    for(var i = 0; i < this.systems.length; i++) {
      this.systems[i].addObject(obj);
    }
    
    obj.setEngine(this);
    obj.onAddedToEngine();
    
    if(this.resourcesLoaded) {
      obj.onResourcesLoaded();
    }
  }

  createObject(type, data)
  {
    return ObjectFactory.Create(type, data);
  }
  
  removeObject(obj)
  {
    var i = this.objects.indexOf(obj);
    if(i != -1) this.objects.splice(i, 1);

    var type = obj.getType();
    var arr = this.objectsByType[type];
    i = arr.indexOf(obj);
    if(i != -1) arr.splice(i, 1);

    for(var i = 0; i < this.systems.length; i++) {
      this.systems[i].removeObject(obj);
    }

    //obj.onRemovedFromEngine(this);

  }
  
  addSystem(sys)
  {
    // Get type
    var type = sys.getType();
    if(this.systemsByType[type] != undefined) {
      // ERROR?
      return;
    }
    
    // Add to systems
    this.systems.push(sys);
    
    // Add to systemsByType
    this.systemsByType[type] = sys;
    
    sys.setEngine(this);
    sys.onAddedToEngine();
  }

  getSystem(type)
  {
    return this.systemsByType[type];
  }
  
  removeSystem(sys)
  {
    
  }
  
  // +++++++++++++++++++++++++++++++++++++ REMOVE THESE FUNCTIONS!!

  /*
  // Input -->

  input(type, data)
  {
    this.inputQueue.push(
      {
  //       type: type,
        data: data
      }
    );
  }

  // <-- Input

  moveCursor(a)
  {
    this.cursorLocation = a;

    //var sec = Math.floor((this.cursorLocation + this.sectionAngle/2) / this.sectionAngle) % (this.sections*2);
    //if(sec != this.currentSection) {
    //  this.deleteFlagsOnSection(this.currentSection, GridFlags.SELECTED)
    //  this.setFlagsOnSection(sec, GridFlags.SELECTED);
    //  
    //  this.currentSection = sec;
    //}
    
  }

  processInputQueue()
  {
    // test
    while(this.inputQueue.length) {
      var q = this.inputQueue.shift();
      while(this.inputQueue.length && this.inputQueue[0].type == q.type) {
        q = this.inputQueue.shift();
      }
      switch(q.type) {
        case Engine.INPUT_ADD_PIECE:
          this.addPiece(q.data);
          break;
        case Engine.INPUT_MOVE_CURSOR:
          this.moveCursor(q.data);
          break;
      }
    }
  }, 
  */

  randomCandy()
  {
    var i = Math.floor(Math.random() * this.candyTypes.length);
    return this.candyTypes[i];
  }

  addPiece()
  {
    //if(this.isInserting) return;
    //this.isInserting = true;
    //this.insertLocation = a;
    
    
    var x = Math.floor(Math.random() * 8);
    var grid = this.systemsByType[ComponentType.GRID]
    for(var y = 0; y < EngineConstants.DEPTH; y++) {
      if(!grid.hasAt(x,y)) break;
    }
    
    var candy = ObjectFactory.Create(
      GameObjectType.CANDY,
      {
  //       "candyType": this.randomCandy(),
  //       "x": x,
        "y": y
      }
    );
    this.addObject(candy);
    
  }
  
}


export default EventDispatcher;


