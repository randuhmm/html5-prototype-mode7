
import puremvc from 'puremvc';
import LevelVO from './vo/LevelVO';
// import CandyType from 'app/engine/enum/CandyType';

class DataProxy extends puremvc.Proxy
{
  // completeCallback: null,
  // progressCallback: null,
  // isManagerLoaded: false,

  constructor()
  {
    super(DataProxy.NAME, DataProxy.DATA);
  }

  initDataManager(completeCallback, progressCallback)
  {
    this.isManagerLoaded = true;
    this.completeCallback = completeCallback;
    this.progressCallback = progressCallback;

    this.completeCallback();

    //this.loadStageData();
  }

  getStages()
  {
    var stages = [];
    this.data["Stages"].each(function(pair) {
      stages.push(pair.value);
    }.bind(this));

    return stages;
  }

  getLevel(levelNum)
  {
    /*
      Level Data Struct
      - level
      - candyTypes
      - initialRows
      - matches
      - tickSpeed
    */
    // var candyTypeEnd = 4;
    // if(levelNum < 5) {
    //   candyTypeEnd += levelNum - 1;
    // } else {
    //   candyTypeEnd = 8;
    // }
    // var candyTypes = [
    //   CandyType.A,
    //   CandyType.B,
    //   CandyType.C,
    //   CandyType.D,
    //   CandyType.E,
    //   CandyType.F,
    //   CandyType.G
    // ].slice(0, candyTypeEnd);

    // var initialRows = 3;
    // if(levelNum < 6) {
    //   initialRows += Math.floor(levelNum/2);
    // } else {
    //   initialRows = 6
    // }

    var levelData = {
  //     'level': levelNum,
  //     'candyTypes': candyTypes,
  //     'initialRows': initialRows,
  //     'matches': 15 + (levelNum*5),
      'tickSpeed': 800
    };

    return new LevelVO(levelData);

  }

  /*
  getNextStage(stageId)
  {
    return this.getStage(stageId+1);
  }

  loadStageData()
  {
    var url = DataProxy.PATH + DataProxy.STAGE_DATA;
    new Ajax.Request(url, {
  //       method: 'get',
  //       evalJS: false,
  //       evalJSON: false,
  //       onSuccess: this.onLoadStageDataSuccess.bindAsEventListener(this),
        onFailure: this.onLoadStageDataFailure.bindAsEventListener(this)
    });
  }

  onLoadStageDataSuccess(transport)
  {
    this.updateProgress(0.03);
    var stagesArray = transport.responseText.evalJSON(true);
    for(var i = 0; i < stagesArray.length; i++) {
      var stageData = stagesArray[i];
      stageData.src = DataProxy.PATH + stageData.src;
      var stage = new StageVO(stageData);
      this.data["Stages"].set(stage.id, stage);
      this.updateProgress(0.04 / stagesArray.length);
    }

    this.loadStageFiles();
  }

  onLoadStageDataFailure()
  {
  }

  loadStageFiles()
  {
    this.data["Stages"].each(function(pair) {
      var stage = pair.value;
      this.loadStageFile(stage);
    }.bind(this));
  }

  loadStageFile(stage)
  {
    var url = stage.src;
    new Ajax.Request(url, {
  //       method: 'get',
  //       evalJS: false,
  //       evalJSON: false,
  //       onSuccess: this.onLoadStageFileSuccess.bindAsEventListener(this, stage),
        onFailure: this.onLoadStageFileFailure.bindAsEventListener(this, stage)
    });
  }

  onLoadStageFileSuccess(transport, stage)
  {
    var data = transport.responseText.evalJSON(true);
    stage.setStageData(data);
    this.isStageFileLoadingComplete();
  }

  onLoadStageFileFailure(transport, stage)
  {
    // ERROR
    stage.setStageData({});
    this.isStageFileLoadingComplete();
  }

  isStageFileLoadingComplete()
  {
    var complete = true;
    this.data["Stages"].each(function(pair) {
      var stage = pair.value;
      if(stage.loaded == false) {
        complete = false;
      }
    }.bind(this));

    if(complete) {
      this.completeCallback();
    }
  }
  */
  updateProgress(progress)
  {
    this.progressCallback(progress);
  }

}

DataProxy.NAME = "DataProxy";
DataProxy.PATH = 'data/';
DataProxy.STAGE_DATA = 'stages.json';
DataProxy.DATA = {
  'Stages': {}
};

export default DataProxy;


