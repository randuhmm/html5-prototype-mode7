import minibot from 'minibot';
import GameObjectType from '../enum/GameObjectType';
import KartDisplayComponent from '../component/kart/KartDisplayComponent';
import KartInputComponent from '../component/kart/KartInputComponent';
import KartPhysicsComponent from '../component/kart/KartPhysicsComponent';
import CameraPhysicsComponent from '../component/camera/CameraPhysicsComponent';
import CameraDisplayComponent from '../component/Camera/CameraDisplayComponent';

var EngineObject = minibot.engine.EngineObject;

var ObjectFactory = {};

ObjectFactory.Create = function (type, data) {

  var object = new EngineObject(type, data);
  switch (type) {
    case GameObjectType.KART:
      object.addComponent(new KartDisplayComponent());
      object.addComponent(new KartInputComponent());
      object.addComponent(new KartPhysicsComponent());
      break;
    case GameObjectType.CAMERA:
      object.addComponent(new CameraPhysicsComponent());
      object.addComponent(new CameraDisplayComponent());
      break;
  }

  object.onComponentsAdded();

  return object;
};

export default ObjectFactory;