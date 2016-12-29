
import EngineSystem from 'app/engine/system/EngineSystem';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineEvent from 'app/event/EngineEvent';
import EngineConstants from 'app/engine/EngineConstants';

class GridSystem extends EngineSystem
{
  
  // width: null,
  // height: null,
  // length: null,
  
  // objects: null,
  // flags: null,
  
  // maxDepth: null,
  
  constructor(width, height)
  {
    $super(ComponentType.GRID);
    
    this.width = width;
    this.height = height;
    this.length = width * height;
    
    this.objects = [];
    this.flags = [];
    
    for(var i = 0; i < this.length; i++) {
      this.objects[i] = null;
      this.flags[i] = 0;
    }
    
  }
  
  onInitialized()
  {
    $super();
    this.findMaxDepth();
  }
  
  addObject(obj)
  {
    var c = $super(obj);
    
    if(c != null) {
      var x = c.getProperty("x");
      var y = c.getProperty("y");
      if(x != null && y != null) {
        this.setAt(
          x,
          y,
          c
        );
      }
    }
    
    return c;
  }
  
  removeObject(obj)
  {
    var c = $super(obj);
    
    if(c != null) {
      var x = c.getProperty("x");
      var y = c.getProperty("y");
      if(x != null && y != null) {
        this.deleteAt(
          x,
          y
        );
      }
    }
    
    return c;
  }

  onAddedToEngine()
  {
    this.engine.addEventListener(EngineEvent.DEL_SEC_FLAGS, this.handleDelSecFlags.bindAsEventListener(this));
    this.engine.addEventListener(EngineEvent.SET_SEC_FLAGS, this.handleSetSecFlags.bindAsEventListener(this));
    this.engine.addEventListener(EngineEvent.DEL_ROW_FLAGS, this.handleDelRowFlags.bindAsEventListener(this));
    this.engine.addEventListener(EngineEvent.SET_ROW_FLAGS, this.handleSetRowFlags.bindAsEventListener(this));
  }
  
  update(dt)
  {
    
  }
  
  inGrid(x, y)
  {
    if(x < 0 || x >= this.width) return false;
    if(y < 0 || y >= this.height) return false;
    return true;
  }
  
  hasAt(x, y)
  {
    return (this.getAt(x, y) != null);
  }
  
  getAt(x, y)
  {
    if(!this.inGrid(x, y)) return null;
    return this.objects[x + (y*this.width)];
  }
  
  setAt(x, y, value)
  {

    // Detect End Game!
    if(y >= this.height) {
      this.engine.stop();
      var event = new EngineEvent(EngineEvent.GAME_FAIL, null, null, null);
      this.dispatchEvent(event)
    }

    if(!this.inGrid(x, y)) return;
    this.objects[x + (y*this.width)] = value;
    this.deleteFlagsAt(x, y);
  }
  
  deleteAt(x, y)
  {
    this.setAt(x, y, null);
    this.deleteFlagsAt(x, y);
  }
  
  getFlagAt(x, y, bit)
  {
    if(!this.inGrid(x, y)) return null;
    return ((this.flags[x + (y*this.width)] >> bit) % 2 != 0);
  }
  
  setFlagAt(x, y, bit)
  {
    if(!this.inGrid(x, y)) return;
    var i = x + (y*this.width);
    this.flags[i] = this.flags[i] | 1 << bit;
    if(this.objects[i] != null)
      this.objects[i].setProperty('flags', this.flags[i]);
  }
  
  deleteFlagAt(x, y, bit)
  {
    if(!this.inGrid(x, y)) return;
    var i = x + (y*this.width);
    this.flags[i] = this.flags[i] & ~(1 << bit);
    if(this.objects[i] != null)
      this.objects[i].setProperty('flags', this.flags[i]);
  }
  
  deleteFlagsAt(x, y)
  {
    if(!this.inGrid(x, y)) return;
    var i = x + (y*this.width);
    this.flags[i] = 0;
    if(this.objects[i] != null)
      this.objects[i].setProperty('flags', this.flags[i]);
  }
  
  getMatches(x, y, compare)
  {
    var matches = [];
    if(!this.hasAt(x, y)) return matches;
    var objA = this.getAt(x, y);
    
    var checked = [];
    for(var i = 0; i < this.length; i++) {
      checked[i] = false;
    }
    this.getMatchesAt(x, y, matches, checked, function(objB) {
      return compare(objA, objB);
    }.bind(this));
    return matches;
  }

  getMatchesAt(x, y, matches, checked, compare)
  {
    if(x < 0) x += this.width;
    if(x >= this.width) x -= this.width;
    if(y < 0) y += this.height;
    if(y >= this.height) y -= this.height;
    
    if(checked[x + (y*this.width)]) return;
      checked[x + (y*this.width)] = true;
    if(!this.hasAt(x, y)) return;
    var obj = this.getAt(x, y);
    if(!compare(obj)) return;
    
    //if(getFlagAt(x, y, MATCHING_FLAG)) return;
    
    matches.push(obj);
    
    this.getMatchesAt(x+1, y-1, matches, checked, compare);
    this.getMatchesAt(x-1, y+1, matches, checked, compare);
    this.getMatchesAt(x, y+1, matches, checked, compare);
    this.getMatchesAt(x, y-1, matches, checked, compare);
    this.getMatchesAt(x-1, y+2, matches, checked, compare);
    this.getMatchesAt(x+1, y-2, matches, checked, compare);
  }
  
  fallPiecesAt(ix, iy)
  {
    var sec = EngineConstants.GridToWorldSec(ix, iy);
    this.iterateBySection(sec, function(x, y) {
      if(y > iy) {
        if(this.hasAt(x, y)) {
          var c = this.getAt(x, y);
          c.drop();
        }
      }
    }.bind(this));
  }

  findMaxDepth()
  {
    var depth = 0;
    for(var y = 0; y < this.height; y++) {
      for(var x = 0; x < this.width; x++) {
        if(this.hasAt(x,y)) {
          depth = y;
          break;
        }
      }
    }
    
    // We need to update the zoom!
    if(this.maxDepth != depth) {
      this.maxDepth = depth;
      
      var event = new EngineEvent(EngineEvent.DEPTH_CHANGED, null, null, depth);
      this.dispatchEvent(event);
      
    }
  }
  
  iterateBySection(section, each)
  {
    var y = 0;
    var x = Math.floor(section/2);
    if(section%2) y = 1;
      try {
      while(y < EngineConstants.DEPTH) {
        each(x, y);
        y += 2
        x -= 1;
        if(x < 0) x += EngineConstants.SECTIONS;
      }
    } catch (e) {
      if (e != GridSystem.$break) throw e;
    }
  }
  
  iterateByRing(ring, each)
  {
    var y = ring;
    var x = 0;
      try {
      while(x < (EngineConstants.SECTIONS)) {
        each(x, y);
        x += 1;
      }
    } catch (e) {
      if (e != GridSystem.$break) throw e;
    }
  }
  
  setFlagsOnSection(section, flag)
  {
    this.iterateBySection(section, function(x, y) {
      this.setFlagAt(x, y, flag);
    }.bind(this));
  }
  
  deleteFlagsOnSection(section, flag)
  {
    this.iterateBySection(section, function(x, y) {
      this.deleteFlagAt(x, y, flag);
    }.bind(this));
  }

  /**
   *
   */
  handleSetSecFlags(event)
  {
    this.setFlagsOnSection(event.data.sec, event.data.flag);
  }

  handleDelSecFlags(event)
  {
    this.deleteFlagsOnSection(event.data.sec, event.data.flag);
  }

  handleSetRowFlags(event)
  {

  }

  handleDelRowFlags(event)
  {

  }
  
}

export default GridSystem;


