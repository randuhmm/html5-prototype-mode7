import minibot from 'minibot';
import EngineConstants from 'app/engine/KartEngineConstants';
import ComponentType from 'app/engine/enum/ComponentType';
import ResourceType from 'app/resource/ResourceType';

var DisplayComponent = minibot.engine.component.DisplayComponent;

class KartDisplayComponent extends DisplayComponent {

  constructor() {
    super(ComponentType.DISPLAY);
    this.setLayers([1]);
  }

  onResourcesLoaded() {
    this.sprite = this.getResource(ResourceType.SPRITE, 'level.mariocircuit');
  }

  update(dt) {

  }

  render(dt, layer, x, y) {
    var scene = this.system.getScene();
    scene.drawImage(
      this.sprite.img,
      this.sprite.x, //sx,
      this.sprite.y, //sy,
      this.sprite.w, //sw,
      this.sprite.h, //sh,
      0,
      0,
      this.sprite.w,
      this.sprite.h
    );
  }

}

export default KartDisplayComponent;