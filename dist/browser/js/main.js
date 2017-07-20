(function(global) {

  var settings = null

  var init = function(_settings) {
    settings = _settings;
    var startButton = document.getElementById('startButton');
    var started = false;
    startButton.onclick = function(event) {
      startButton.style = "display: none;";
      start();
    };
  };

  var start = function() {
    var minibot = require('minibot').default;
    var loader = require('loader').default;
    var app = require('app').default;
    //var puremvc = require('puremvc').default;

    var loaderApp;
    var loaderView;

    var shellApp;
    var shellView;

    var element = document.createElement('div');
    var head = document.head;
    var base = document.getElementById('wrapper');

    var platformType = minibot.system.GetPlatformType();
    var platformName = minibot.system.GetPlatformName();

    var width = 320;
    var height = 200;
    var ratio = 1;
    var eventTypes = minibot.display.scene.Scene.MOUSE_EVENTS;

    var onLoaderLoaded = function()
    {
      console.log('onLoaderLoaded - called');
      setTimeout(minibot.core.Utils.Bind(loaderApp.loadScripts, loaderApp, onScriptsLoaded), 500);
    };

    var onScriptsLoaded = function()
    {
      console.log('onScriptsLoaded - called');

      shellApp = app.ApplicationFacade.getInstance(app.ApplicationFacade.KEY);

      var canvas = document.createElement('canvas');
      base.appendChild(canvas);

      // Scale the canvas to fit
      var rect = base.getBoundingClientRect();
      if(rect.width <= rect.height) {
        ratio = width / rect.width;
        canvas.style.marginTop = (rect.height - (height / ratio)) / 2 + 'px';
      } else {
        ratio = height / rect.height;
        canvas.style.marginLeft = (rect.width - (width / ratio)) / 2 + 'px';
      }

      var options = {
        "progressCallback": minibot.core.Utils.Bind(loaderView.update, loaderView),
        "completeCallback": onShellLoaded,
        "sceneOptions": {
          "element": canvas,
          "width": ((settings.width !== undefined)?(settings.width):(width)),
          "height": ((settings.height !== undefined)?(settings.height):(height)),
          "ratio": ratio,
          "eventTypes": eventTypes
        }
      };

      shellApp.startup(
        options
      );
    };

    var onShellLoaded = function()
    {
      console.log('onShellLoaded - called');
      var parent = loaderView.element.parentElement;
      minibot.core.Utils.Defer(parent.removeChild, parent, loaderView.element);
    };

    var Loader = function(div, onReadyCallback) {
      this.onReadyCallback = onReadyCallback;
      this.element = div;
      this.element.setAttribute('id', 'splash_div');
      this.progressWrap = document.createElement('div');
      this.progressWrap.setAttribute('id', 'progressWrap_div');
      this.progressBar = document.createElement('div');
      this.progressBar.setAttribute('id', 'progressBar_div');
      this.progress = 0;

      this.element.appendChild(this.progressWrap);
      this.progressWrap.appendChild(this.progressBar);

      onReadyCallback();
    };

    Loader.prototype.update = function(progress)
    {
      this.progress += progress;
      this.progressBar.style.width = parseFloat(this.progress * 100) + "%";
    };

    var main = function()
    {
      console.log("main - called");
      loaderApp = loader.ApplicationFacade.getInstance(loader.ApplicationFacade.KEY);

      loaderView = new Loader(element, minibot.core.Utils.Bind(function() {
        base.appendChild(element);
        loaderApp.startup(
          // viewComponent
          loader,
          // <head> element
          head,
          // scripts
          [],
          // callback
          onLoaderLoaded
        );
        if(platformType == minibot.system.PlatformType.MOBILE) {
          window.scrollTo(0, 1);
        }
      }, this));
    };

    var onFullscreenChange = function(event) {
      if(document.webkitIsFullScreen) {
        base.style.width = '100%';
        base.style.height = '100%';
        base.style.backgroundColor = '#000000';
        console.log("Enter Fullscreen");
      } else {
        // TODO: Destroy the game
        var startButton = document.getElementById('startButton');
        startButton.style = "display: visible;";
        while(base.children.length) {
          base.children[0].remove();
        }
        shellApp.shutdown();
        app.ApplicationFacade.removeCore(app.ApplicationFacade.KEY);
        console.log("Exit Fullscreen");
      }
    };

    // Request fullscreen
    if (base.webkitRequestFullscreen) {
      document.addEventListener('webkitfullscreenchange', onFullscreenChange);
      base.webkitRequestFullscreen();
    }

    if(platformType == minibot.system.PlatformType.MOBILE) {
      if(platformName == minibot.system.PlatformName.IOS) {
        head.innerHTML +=
          '<meta name="viewport" content="minimal-ui, width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
          '<meta name="format-detection" content="telephone=no">' +
          '<meta name="apple-mobile-web-app-capable" content="yes">' +
          '<meta name="apple-mobile-web-app-status-bar-style" content="yes">' +
          '<link rel="apple-touch-icon-precomposed" href="your_icon.png">';

        // function handleOrientationChange(event) {
        // }
        //window.addEventListener("orientationchange", hideMobileBrowser, false);

        window.addEventListener("touchstart", function (event) {
          // Disable page swipe scrolling
          event.preventDefault();
          // If the address bar was visible, bring the game back into full view
          //window.scrollTo(-1, 0);
        }, false);

        var htmlStyle = document.documentElement.style;
        // Ensure the page is tall enough to scroll
        htmlStyle.minHeight = "9001px";
        // Force a scroll, hiding the address bar
        window.scrollTo(-1, 0);
        // Wait until the address bar has been scrolled away... A more
        // sophisticated version might repeatedly check on a rapid
        // interval rather than waiting a full half a second
        window.setTimeout(function () {
          htmlStyle.minHeight = "";
          // Resize the canvas to the new viewport size (at true pixel scale)
          ratio = window.devicePixelRatio;
          width = Math.ceil(ratio*window.innerWidth);
          height = Math.ceil(ratio*window.innerHeight);
          eventTypes = minibot.display.scene.Scene.TOUCH_EVENTS;

          main();
        }.bind(this), 500);

      } else if(platformName == minibot.system.PlatformName.ANDROID) {
        head.innerHTML +=
          '<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">' +
          '<meta name="format-detection" content="telephone=no">';

        // disable scrolling
        var preventDefault = function(e){
          e.preventDefault();
        };

        window.addEventListener('touchstart',  preventDefault, false);
        window.addEventListener('touchend',    preventDefault,   false);


        var htmlStyle = document.documentElement.style;
        // Ensure the page is tall enough to scroll
        htmlStyle.minHeight = "9001px";
        // Force a scroll, hiding the address bar
        //window.scrollTo(-1, 0);
        // Wait until the address bar has been scrolled away... A more
        // sophisticated version might repeatedly check on a rapid
        // interval rather than waiting a full half a second
        window.setTimeout(function () {
          htmlStyle.minHeight = "";
          // Resize the canvas to the new viewport size (at true pixel scale)
          ratio = window.devicePixelRatio;
          width = Math.ceil(ratio*window.innerWidth);
          height = Math.ceil(ratio*window.innerHeight);
          eventTypes = minibot.display.scene.Scene.TOUCH_EVENTS;

          main();
        }.bind(this), 500);

      }
    } else {
      main();
    }
  };

  global.init = init;

})(window);
