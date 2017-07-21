
import minibot from 'minibot';
import ComponentType from './enum/ComponentType';
import KartInputSystem from './system/KartInputSystem';
import KartDisplaySystem from './system/KartDisplaySystem';
import KartPhysicsSystem from './system/KartPhysicsSystem';
import ObjectFactory from './factory/ObjectFactory';
import GameObjectType from './enum/GameObjectType';

var Engine = minibot.engine.Engine


class KartEngine extends Engine
{

  constructor()
  {
    var systems = [
      new KartInputSystem(),
      new KartPhysicsSystem(),
      new KartDisplaySystem()
    ];
    super(systems, KartEngine.UPDATE_ORDER);

    // Add an object
    var obj = ObjectFactory.Create(
      GameObjectType.KART,
      {
        "x": 0,
        "y": 0
      }
    );
    this.addObject(obj);
  }

  render(dt, x, y)
  {
    x += this.viewport.x;
    y += this.viewport.y;
    this.systemsByType[ComponentType.DISPLAY].render(dt, x, y);
  }

}

KartEngine.UPDATE_ORDER = [];
KartEngine.UPDATE_ORDER.push(ComponentType.INPUT);
KartEngine.UPDATE_ORDER.push(ComponentType.PHYSICS);
KartEngine.UPDATE_ORDER.push(ComponentType.DISPLAY);

export default KartEngine;
