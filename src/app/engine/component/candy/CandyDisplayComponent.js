
import EngineConstants from 'app/engine/EngineConstants';
import DisplayComponent from 'app/engine/component/core/DisplayComponent';
import ComponentMessage from 'app/engine/component/core/ComponentMessage';
import ComponentType from 'app/engine/enum/ComponentType';
import minibot from 'minibot';
import Engine from 'app/engine/Engine';
import ResourceType from 'app/resource/ResourceType';
import CandyType from 'app/engine/enum/CandyType';
import GridFlag from 'app/engine/enum/GridFlag';

class CandyDisplayComponent extends DisplayComponent
{

  // sprite: null,

  // sprite_016: null,
  // sprite_032: null,
  // sprite_064: null,
  // sprite_128: null,

  constructor()
  {
    super();
  }

  onAddedToObject()
  {

  }

  onAddedToSystem()
  {

  }

  onResourcesLoaded()
  {
    var id = "";
    switch(this.getProperty("candyType")) {
      case CandyType.A:
        id = "object.candy.01";
        break;
      case CandyType.B:
        id = "object.candy.02";
        break;
      case CandyType.C:
        id = "object.candy.03";
        break;
      case CandyType.D:
        id = "object.candy.04";
        break;
      case CandyType.E:
        id = "object.candy.05";
        break;
      case CandyType.F:
        id = "object.candy.06";
        break;
      case CandyType.G:
        id = "object.candy.07";
        break;
    }

    this.sprite = this.getResource(ResourceType.SPRITE, id)

    this.sprite_016 = this.getResource(ResourceType.SPRITE, id + ".016");
    this.sprite_032 = this.getResource(ResourceType.SPRITE, id + ".032");
    this.sprite_064 = this.getResource(ResourceType.SPRITE, id + ".064");
    this.sprite_128 = this.getResource(ResourceType.SPRITE, id + ".128");

  }

  update(dt)
  {

  }

  render(dt, x, y)
  {

    var zoom = 10 - this.system.getZoomLevel();
    var viewport = this.system.getViewport();
    var scene = this.system.getScene();

    var a = this.getProperty("a");
    var h = this.getProperty("h") + zoom;

    var s = EngineConstants.WorldToScreenS(h);
    var r = EngineConstants.WorldToScreenR(h);

    var selected = ((this.getProperty("flags") >> GridFlag.SELECTED) % 2 != 0)
    if(selected) s *= 1.2;

    x += (viewport.w/2) + (r * Math.cos(a)) - s/2;
    y += (viewport.h/2) - (r * Math.sin(a)) - s/2;

    var sprite = this.sprite;
    if(s <= 16) {
      //sprite = this.sprite_016
    } else if(s <= 32) {
      //sprite = this.sprite_032
    } else if(s <= 64) {
      //sprite = this.sprite_064
    } else if(s <= 128) {
      //sprite = this.sprite_128
    }

    scene.drawImage(
      sprite.img,
      sprite.x, //sx,
      sprite.y, //sy,
      sprite.w, //sw,
      sprite.h, //sh,
      x, //dx,
      y, //dy,
      s, //dw,
      s //dh
    );

  }

}

export default CandyDisplayComponent;


