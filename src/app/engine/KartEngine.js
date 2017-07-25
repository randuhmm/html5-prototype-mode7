import minibot from 'minibot';
import ComponentType from './enum/ComponentType';
import KartInputSystem from './system/KartInputSystem';
import KartDisplaySystem from './system/KartDisplaySystem';
import KartPhysicsSystem from './system/KartPhysicsSystem';
import ObjectFactory from './factory/ObjectFactory';
import GameObjectType from './enum/GameObjectType';

var Engine = minibot.engine.Engine


class KartEngine extends Engine {

  constructor() {
    
    // Create the player
    var player = ObjectFactory.Create(
      GameObjectType.KART, {
        "x": 0,
        "y": 0,
        "a": 0,
        "av": 0,
        "lv": 0
      }
    );

    var systems = [
      new KartInputSystem(),
      new KartPhysicsSystem(),
      new KartDisplaySystem(player)
    ];
    super(systems, KartEngine.UPDATE_ORDER);

    this.player = player;
    this.addObject(this.player);
  }

  render(dt, x, y) {
    x += this.viewport.x;
    y += this.viewport.y;
    this.systemsByType[ComponentType.DISPLAY].render(dt, x, y);
  }

  getPlayer() {
    return this.player;
  }

  getCamera() {
    return this.camera;
  }

}

KartEngine.UPDATE_ORDER = [];
KartEngine.UPDATE_ORDER.push(ComponentType.INPUT);
KartEngine.UPDATE_ORDER.push(ComponentType.PHYSICS);
KartEngine.UPDATE_ORDER.push(ComponentType.DISPLAY);

export default KartEngine;