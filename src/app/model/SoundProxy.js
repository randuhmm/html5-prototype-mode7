
import puremvc from 'puremvc';
//import SoundJS from 'SoundJS';

class SoundProxy extends puremvc.Proxy
{

  // completeCallback: null,
  // progressCallback: null,
  // isManagerLoaded: false,

  // soundCount: 0,
  // loadCount: 0,

  // bgm: null,

  constructor()
  {
    super(SoundProxy.NAME, SoundProxy.DATA);
  }

  hasSound(id)
  {
    return (id in SoundProxy.DATA['Sounds']);
  }

  playSound(id, options)
  {
    if(!this.hasSound(id)) return;
    if(options == undefined) options = {};
    return SoundJS.play(id, options);
  }

  stopSound(id)
  {
    var sound = this.getSound(id);
    if(sound == undefined) return;
    sound.stop();
  }

  setBgm(id)
  {
    if(!this.hasSound(id)) return;

    // Stop the current BGM
    if(this.bgm != null) {
      if(this.bgm.id != id) {
        this.fadeOutBgm(this.bgm, 0.6);
      } else {
        return;
      }
    }

    var options = {};
    options.loop = -1;
    options.volume = 0;

    this.bgm = SoundJS.play(id, options);
    this.fadeInBgm(this.bgm, 0);
  }

  fadeOutBgm(sound, vol)
  {
    vol -= 0.02;
    sound.setVolume(vol);
    if(vol <= 0) {
      sound.setVolume(0);
      sound.pause();
    } else {
      this.fadeOutBgm.bind(this, sound, vol).delay(0.1);
    }
  }

  fadeInBgm(sound, vol)
  {
    vol += 0.02;
    sound.setVolume(vol);
    if(vol >= 0.6) {
      sound.setVolume(0.6);
    } else {
      this.fadeInBgm.bind(this, sound, vol).delay(0.1);
    }
  }

  initSoundManager(completeCallback, progressCallback)
  {
    this.isManagerLoaded = true;
    this.completeCallback = completeCallback;
    this.progressCallback = progressCallback;

    SoundJS.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
    SoundJS.alternateExtensions = ["mp3"];

    this.loadSoundData();
    /*
    SoundManager.setup({
  //     url: SoundProxy.PATH_TO_SWF,
      flashVersion: 9, // optional: shiny features (default = 8)
      useFlashBlock: false, // optionally, enable when you're ready to dive in
      /**
      * read up on HTML5 audio support, if you're feeling adventurous.
      * iPad/iPhone and devices without flash installed will always attempt to use it.

      onready()
      {
        this.loadSoundData();
      }.bind(this)
    });
    */
  }

  loadSoundData()
  {
    var url = SoundProxy.SOUND_DATA;
    new Ajax.Request(url, {
  //       method: 'get',
  //       evalJS: false,
  //       evalJSON: false,
  //       onSuccess: this.onLoadSoundDataSuccess.bindAsEventListener(this),
        onFailure: this.onLoadSoundDataFailure.bindAsEventListener(this)
    });
  }

  onLoadSoundDataSuccess(transport)
  {
    var sounds = transport.responseText.evalJSON();

    this.soundCount = sounds.length;

    SoundJS.addEventListener("fileload", this.onLoadSoundFile.bindAsEventListener(this));

    for(var i = 0; i < sounds.length; i++) {
      var sound = sounds[i];
      SoundJS.registerSound(sound.src, sound.id);
      /*
      var object;
      if(sound.type == SoundProxy.SFX_TYPE) {
        object = SoundManager.createSound({
  //         id: sound.id,
  //         url: sound.src,
  //         onload: this.onLoadSoundFile.bind(this),
          autoLoad: true
        });
      } else {
        object = SoundManager.createSound({
  //         id: sound.id,
          url: sound.src
        });
        this.loadCount++;
      }
      this.data['Sounds'].set(sound.id, object);
      */
    }

  }

  onLoadSoundDataFailure()
  {
    // TODO: Error
  }

  onLoadSoundFile(event)
  {
    // This is fired for each sound that is registered.
    //var instance = createjs.Sound.play(event.src);  // play using id.  Could also use full source path or event.src.
    //instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
    this.data['Sounds'][event.id] = true;

    //instance.volume = 0.5;
    this.loadCount++;
    console.log(this.loadCount);
    if(this.loadCount == this.soundCount) {
      this.completeCallback();
    }
  }

  updateProgress(progress)
  {
    this.progressCallback(progress);
  }

}

export default SoundProxy;


