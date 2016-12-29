import minibot from 'minibot';
import ResourceType from  'app/resource/ResourceType';


var Ajax = minibot.network.Ajax,
    Utils = minibot.core.Utils;


class TemplateResource extends  minibot.resource.Resource
{

  constructor(id, data)
  {
    super(id);
    this.src = null;
    this.data = null;
    if(data !== undefined || data !== null) {
      this.data = data;
      this.src = data.src;
    }
  }

  load(manager, callback)
  {
    this.loaded = true;
    if(this.src !== null) {
      new Ajax.Request(this.src, {
          method: 'get',
          evalJS: false,
          evalJSON: false,
          onSuccess: Utils.BindAsEventListener(this.onSuccess, this, callback),
          onFailure: Utils.BindAsEventListener(this.onFailure, this, callback)
      });
    } else {
      callback();
    }
  }

  onSuccess(response, callback)
  {
    this.data = response.responseText;
    callback();
  }

  onFailure(response, callback)
  {
    console.log('TemplateResource: Failed to template - ' + this.src);
    callback();
  }

}


export default TemplateResource;
