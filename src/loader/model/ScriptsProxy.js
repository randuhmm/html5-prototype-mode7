
import minibot from 'minibot';
import puremvc from 'puremvc';

class ScriptsProxy extends puremvc.Proxy
{

  // index: 0,
  // scriptsLoadedCallback: null,
  // head: null,

  constructor(head, scriptsArray, scriptsLoadedCallback)
  {
    super(ScriptsProxy.NAME, scriptsArray);
    this.head = head;
    this.index = 0;
    this.scriptsLoadedCallback = scriptsLoadedCallback;
  }

  loadScripts(scriptsLoadedCallback)
  {
    this.scriptsLoadedCallback = scriptsLoadedCallback;
    this.loadScript();
  }

  loadScript()
  {
    if(this.index >= this.data.length) {
      this.scriptsLoadedCallback();
      return;
    }

    var url = this.data[this.index];
    var script = new Element('script', {
  //     type: 'text/javascript',
  //     charset: 'utf-8',
      src: url
    });
    script.observe('load', this.onScriptLoadSuccess.bindAsEventListener(this));
    this.head.appendChild(script);
  }

  onScriptLoadSuccess()
  {
    this.index += 1;
    var progress = (0.25 / this.data.length);
    this.sendNotification(ApplicationConstants.UPDATE_PROGRESS, {progress: progress});

    this.loadScript();
  }

}

export default ScriptsProxy;


