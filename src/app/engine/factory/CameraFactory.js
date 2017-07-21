import Camera from 'app/engine/object/Camera';
import CameraDisplayComponent from 'app/engine/component/Camera/CameraDisplayComponent';

var CameraFactory = {};

CameraFactory.Create = function()
{
  var camera = new Camera();
  camera:addComponent(new CameraDisplayComponent());
  return camera;
};

return CameraFactory;
