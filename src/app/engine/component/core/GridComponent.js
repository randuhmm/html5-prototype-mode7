
import GridSystem from 'app/engine/system/GridSystem';
import EngineComponent from 'app/engine/component/core/EngineComponent';
import ComponentType from 'app/engine/enum/ComponentType';
import EngineConstants from 'app/engine/EngineConstants';

class GridComponent extends EngineComponent
{
  
  constructor()
  {
    $super(ComponentType.GRID);
  }
  
  onAddedToObject()
  {
    //if(!this.hasProperty("x")) this.setProperty("x", 0);
    //if(!this.hasProperty("y")) this.setProperty("y", 0);
    if(!this.hasProperty("flags")) this.setProperty("flags", 0);
    
    var x = this.getProperty("x");
    var y = this.getProperty("y");
    
    if(x != null && y != null) {
      this.setProperty("h", EngineConstants.GridToWorldH(x,y));
      this.setProperty("a", EngineConstants.GridToWorldA(x,y));
    }
  }
  
  getFlag(flag)
  {
    return this.system.getFlagAt(
      this.getProperty("x"),
      this.getProperty("y"),
      flag
    );
  }
  
  setFlag(flag)
  {
    return this.system.setFlagAt(
      this.getProperty("x"),
      this.getProperty("y"),
      flag
    );
  }
  
}

export default GridComponent;


