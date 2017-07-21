import GameObjectType from 'app/engine/enum/GameObjectType';
import EngineObject from 'app/engine/object/EngineObject';
import CandyGridComponent from 'app/engine/component/candy/CandyGridComponent';
import CandyDisplayComponent from 'app/engine/component/candy/CandyDisplayComponent';
import CandyPhysicsComponent from 'app/engine/component/candy/CandyPhysicsComponent';
import CursorPhysicsComponent from 'app/engine/component/cursor/CursorPhysicsComponent';
import CursorInputComponent from 'app/engine/component/cursor/CursorInputComponent';
import CursorDisplayComponent from 'app/engine/component/cursor/CursorDisplayComponent';

var ObjectFactory = {};

ObjectFactory.Create = function(type, data)
{

  var object = new EngineObject(type, data);
  switch(type) {
    case GameObjectType.CANDY:
      object.addComponent(new CandyGridComponent());
      object.addComponent(new CandyDisplayComponent());
      object.addComponent(new CandyPhysicsComponent());
      break;
    case GameObjectType.CURSOR:
      object.addComponent(new CursorPhysicsComponent());
      object.addComponent(new CursorInputComponent());
      object.addComponent(new CursorDisplayComponent());
      break;
  }

  object.onComponentsAdded();

  return object;
};

export default ObjectFactory;
