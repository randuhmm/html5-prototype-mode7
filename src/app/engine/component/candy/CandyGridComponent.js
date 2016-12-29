
import GridSystem from 'app/engine/system/GridSystem';
import GridComponent from 'app/engine/component/core/GridComponent';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import SigSlt from 'app/engine/message/SigSlt';
import EngineConstants from 'app/engine/EngineConstants';

class CandyGridComponent extends GridComponent
{
  
  constructor()
  {
    $super();

  }
  
  onAddedToObject()
  {
    $super();

    if(this.hasProperty('fromCursor')) {
      SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_SHOT_END, this.candyShotEnd);
    }
    
    SigSlt.AddSlot(this, EngineComponent.SLT_CANDY_DROP_END, this.candyDropEnd);
    SigSlt.AddSignal(this, EngineComponent.SIG_CANDY_DROP_START);
    SigSlt.AddSignal(this, EngineComponent.SIG_CANDY_MATCH);
    SigSlt.AddSignal(this, EngineComponent.SIG_CANDY_NONMATCH);
  }

  onComponentsAdded()
  {
    if(this.hasProperty('fromCursor')) {
      this.connect(ComponentType.PHYSICS, EngineComponent.SIG_CANDY_SHOT_END, EngineComponent.SLT_CANDY_SHOT_END);
    }
    this.connect(ComponentType.PHYSICS, EngineComponent.SIG_CANDY_DROP_END, EngineComponent.SLT_CANDY_DROP_END);
  }

  candyShotEnd(c)
  {
    var h = this.getProperty('h');
    var a = this.getProperty('a');

    var x = EngineConstants.WorldToGridX(a, h);
    var y = EngineConstants.WorldToGridY(a, h);

    this.setProperty("h", EngineConstants.GridToWorldH(x,y));
    this.setProperty("a", EngineConstants.GridToWorldA(x,y));
    this.setProperty("x", x);
    this.setProperty("y", y);

    this.system.setAt(x, y, this);

    var matches = this.system.getMatches(x, y, function(objA, objB) {
      return (objA.getProperty("candyType") == objB.getProperty("candyType"));
    });
    if(matches.length >= 3) {

      SigSlt.Emit(this, EngineComponent.SIG_CANDY_MATCH, matches);

      for(var i = 0; i < matches.length; i++) {
        matches[i].matched();
      }
    } else {
      console.log("NO MATCH");
      SigSlt.Emit(this, EngineComponent.SIG_CANDY_NONMATCH, matches);
    }

    this.system.findMaxDepth();
  }

  candyDropEnd(c)
  {
    var h = this.getProperty('h');
    var a = this.getProperty('a');

    var x = EngineConstants.WorldToGridX(a, h);
    var y = EngineConstants.WorldToGridY(a, h);

    this.setProperty("h", EngineConstants.GridToWorldH(x,y));
    this.setProperty("a", EngineConstants.GridToWorldA(x,y));
    this.setProperty("x", x);
    this.setProperty("y", y);

    this.system.setAt(x, y, this);
    this.system.findMaxDepth();
  }

  matched()
  {
    var x = this.getProperty("x");
    var y = this.getProperty("y");
    var o = this.object;
    var s = this.system;
    s.engine.removeObject(o);
    s.fallPiecesAt(x, y);
  }

  drop()
  {
    var x = this.getProperty("x");
    var y = this.getProperty("y");
    this.setProperty("sec", EngineConstants.GridToWorldSec(x, y));
    this.system.deleteAt(x, y);
    SigSlt.Emit(this, EngineComponent.SIG_CANDY_DROP_START, this);
  }
  
}

export default CandyGridComponent;


