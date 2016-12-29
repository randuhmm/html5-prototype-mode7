
import puremvc from 'puremvc';
import minibot from 'minibot';
import ResourceType from 'app/resource/ResourceType';
import TemplateResource from 'app/resource/TemplateResource';
import http from 'http'


var ResourceManager = minibot.resource.ResourceManager,
  ImageResource = minibot.resource.ImageResource,
  SpriteResource = minibot.resource.SpriteResource,
  AnimationResource = minibot.resource.AnimationResource,
  Utils = minibot.core.Utils,
  Ajax = minibot.network.Ajax;

class ResourceProxy extends puremvc.Proxy
{

  // resourceManager: null,

  // completeCallback: null,
  // progressCallback: null,
  // isManagerLoaded: false,

  constructor()
  {
    super(ResourceProxy.NAME, null);
    this.resourceManager = ResourceManager.getInstance(ResourceProxy.RESOURCE_KEY);
  }

  getResource(type, id)
  {
    return this.resourceManager.getResource(type, id);
  }

  getTemplate(id)
  {
    return this.resourceManager.getResource(ResourceType.TEMPLATE, id);
  }

  initResourceManager(completeCallback, progressCallback)
  {
    this.isManagerLoaded = true;
    this.progressCallback = progressCallback;
    this.completeCallback = completeCallback;

    this.resourceManager.addType(
      ResourceType.TEMPLATE,
      TemplateResource
    );
    this.resourceManager.addType(
      ResourceType.IMAGE,
      ImageResource
    );
    this.resourceManager.addType(
      ResourceType.SPRITE,
      SpriteResource
    );
    this.resourceManager.addType(
      ResourceType.ANIMATION,
      AnimationResource
    );

    this.loadTemplateData();

    //this.completeCallback();
  }

  loadTemplateData()
  {
    var url = 'data/templates.json';
    new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadTemplateDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadTemplateDataFailure, this)
    });
  }

  onLoadTemplateDataSuccess(transport)
  {

    // Strip inline comments before evaluating the JSON
    var templates = JSON.parse(this.stripComments(transport.responseText));

    for (var i = 0; i < templates.length; i++) {
      var template = templates[i];
      template.src = ResourceProxy.TEMPLATE_URL + template.src;
      var id = template.id;
      this.resourceManager.addResource(
        ResourceType.TEMPLATE,
        id,
        template
      );
    }

    this.loadImageData();
  }

  onLoadTemplateDataFailure()
  {
    // TODO: Error
  }

  loadImageData()
  {
    var url = 'data/images.json';
    new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadImageDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadImageDataFailure, this)
    });
  }

  onLoadImageDataSuccess(transport)
  {
    var images = JSON.parse(transport.responseText);

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      var id = image.id;
      this.resourceManager.addResource(
        ResourceType.IMAGE,
        id,
        image
      );
    }
    this.loadSpriteData();
  }

  onLoadImageDataFailure()
  {

  }

  loadSpriteData()
  {
    var url = 'data/sprites.json';
    new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadSpriteDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadSpriteDataFailure, this)
    });
  }

  onLoadSpriteDataSuccess(transport)
  {
    var sprites = JSON.parse(transport.responseText);

    for (var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      var id = sprite.id;
      this.resourceManager.addResource(
        ResourceType.SPRITE,
        id,
        sprite
      );
    }

    this.loadAnimationData();
  }

  onLoadSpriteDataFailure()
  {

  }

  loadAnimationData()
  {
    var url = 'data/animations.json';
    new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadAnimationDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadAnimationDataFailure, this)
    });
  }

  onLoadAnimationDataSuccess(transport)
  {
    var animations = JSON.parse(transport.responseText);

    for (var i = 0; i < animations.length; i++) {
      var animation = animations[i];
      var id = animation.id;
      this.resourceManager.addResource(
        ResourceType.ANIMATION,
        id,
        animation
      );
    }

    this.loadAllResources();
  }

  onLoadAnimationDataFailure()
  {

  }

  loadAllResources()
  {
    this.resourceManager.loadAll(
      Utils.Bind(function(progress) {
        this.progressCallback(progress);
      }, this),
      Utils.BindAsEventListener(this.handleLoadAllResourcesComplete, this)
    );
  }

  handleLoadAllResourcesComplete()
  {
    this.completeCallback();
  }

  /**
   *  Utility Functions
   */

  stripComments(str)
  {
    // strips inline comments only
    str = str.replace(/\/\/.*\n/g, '');
    return str;
  }

}

ResourceProxy.NAME = "ResourceProxy";
ResourceProxy.RESOURCE_KEY = "ResourceKey";
ResourceProxy.LOADED = false;
ResourceProxy.TEMPLATE_JSON = "data/templates.json";
ResourceProxy.TEMPLATE_URL = "tpl/";

export default ResourceProxy;
