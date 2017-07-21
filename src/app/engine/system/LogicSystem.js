
import EngineSystem from 'app/engine/system/EngineSystem';
import EngineEvent from 'app/event/EngineEvent';
import ComponentType from 'app/engine/enum/ComponentType';
import GameObjectType from 'app/engine/enum/GameObjectType';
import ObjectFactory from 'app/engine/factory/ObjectFactory';

class LogicSystem extends EngineSystem
{

  // 1 to length
  // dropTimerPosition: null,
  // dropTimerLength: null,
  // dropTimerLast: null,
  // dropTimerCallback: null,

  // 1 to length
  // comboMeterPosition: null,
  // comboMeterLength: null,
  // comboMeterLast: null,
  // comboCount: null,
  // comboMeterCallback: null,

  // The counter that counts consecutive non matches
  // voidCount: null,
  // voidLength: null,
  // voidCallback: null,

  //
  // penalizing: null,
  // penaltyPosition: null,
  // penaltyLast: null,
  // penaltyLocations: null,

  // matchesLeft: null,
  // matchesCallback: null,

  // isRunning: null,

  // tickSpeed: null,

  constructor(options)
  {
    super(ComponentType.LOGIC);

    this.dropTimerLength = LogicSystem.PENALTY_TIMER_TICKS;
    this.dropTimerPosition = LogicSystem.PENALTY_TIMER_TICKS;
    this.dropTimerLast = 0;

    this.comboMeterPosition = 0;
    this.comboMeterLength = LogicSystem.COMBO_METER_TICKS;
    this.comboMeterLast = 0;
    this.comboCount = 0;

    this.penalizing = false;
    this.penaltyPosition = 0;
    this.penaltyLast = 0;

    this.voidCount = 0;
    this.voidLength = 3;

    this.matchesLeft = options.matches;

    this.isRunning = true;

    this.tickSpeed = options.tickSpeed;

  }

  onAddedToEngine()
  {

  }

  update(dt)
  {
    if(!this.isRunning) return;

    var ticks;
    var s = this.tickSpeed;
    var cs = this.tickSpeed * 2;

    // Update the penalty timer
    this.dropTimerLast += dt;
    if(this.dropTimerLast >= s) {
      ticks = 0;

      while(this.dropTimerLast >= s) {
        ticks += 1;
        this.dropTimerLast -= s;
      }

      if(ticks > 0) {
        this.dropTimerPosition -= ticks;
        if(this.dropTimerPosition <= 0) {
          this.drop();
          this.dropTimerPosition = this.dropTimerLength;
        }
        if(this.dropTimerCallback) {
          this.dropTimerCallback(this.dropTimerPosition);
        }
      }

    }

    // Update the combo meter
    /*
    if(this.comboMeterPosition != 0) {
      this.comboMeterLast += dt;
      if(this.comboMeterLast >= cs) {
        ticks = 0;
        while(this.comboMeterLast >= cs) {
          ticks += 1;
          this.comboMeterLast -= cs;
        }

        if(ticks > 0) {
          this.comboMeterPosition -= ticks;
          if(this.comboMeterPosition <= 0) {
            this.comboMeterPosition = 0;
            this.comboCount = 0;
          }
          if(this.comboMeterCallback) {
            this.comboMeterCallback(this.comboMeterPosition, this.comboCount);
          }
        }
      }
    }
    */

  }

  stop()
  {
    this.isRunning = false;
  }

  start()
  {
    this.isRunning = true;
  }

  setDropTimerCallback(callback)
  {
    this.dropTimerCallback = callback;
  }

  setComboMeterCallback(callback)
  {
    this.comboMeterCallback = callback;
  }

  setMatchesCallback(callback)
  {
    this.matchesCallback = callback;
  }

  setPenaltyCallback(callback)
  {
    this.voidCallback = callback;
  }

  handleMatch(length)
  {

    // END GAME Detection
    if(this.matchesLeft <= length) {
      this.matchesLeft = 0;
      this.matchesCallback(this.matchesLeft);
      this.gameWin();
      return;
    }

    this.matchesLeft -= length;
    if(this.matchesCallback) {
      this.matchesCallback(this.matchesLeft);
    }

    this.voidCount = 0;
    // Send the updated void count
    if(this.voidCallback) {
      this.voidCallback(this.voidCount);
    }

    this.dropTimerPosition = this.dropTimerLength;
    if(this.dropTimerPosition > this.dropTimerLength) {
      this.dropTimerPosition = this.dropTimerLength;
    }
    if(this.dropTimerCallback) {
      this.dropTimerCallback(this.dropTimerPosition);
    }

    /*
    this.comboCount += 1;
    if(this.comboCount == 1) {
      // Start the combo timer
      this.comboMeterPosition = length;
      this.comboMeterLast = 0;
    } else {
      this.comboMeterPosition += length;
      if(this.comboMeterPosition > this.comboMeterLength) {
        this.comboMeterPosition = this.comboMeterLength;
      }
    }
    if(this.comboMeterCallback) {
      this.comboMeterCallback(this.comboMeterPosition, this.comboCount);
    }
    */
  }

  handleNonmatch()
  {
    this.voidCount += 1;
    if(this.voidCount >= this.voidLength) {
      // Penalty
      this.penalty();
      this.voidCount = 0;
    } else {
      //

    }

    // Send the updated void count
    if(this.voidCallback) {
      this.voidCallback(this.voidCount);
    }


  }

  penalty()
  {
    var gridSystem = this.engine.getSystem(ComponentType.GRID);
    var candies = LogicSystem.CANDY_PENALTY;
    var ring = 0;
    var spots;
    while(candies) {
      spots = [];
      gridSystem.iterateByRing(ring, function(x, y) {
        if(!gridSystem.hasAt(x, y)) {
          spots.push([x,y]);
        }
      });

      var added = 0;
      for(var i = 0; i < candies; i++) {
        if(spots.length == 0) break;
        var ri = Math.floor(Math.random() * spots.length);
        var spot = spots.splice(ri, 1)[0];
        var candy = ObjectFactory.Create(
          GameObjectType.CANDY,
          {
  //           "candyType": this.engine.randomCandy(),
  //           "x": spot[0],
            "y": spot[1]
          }
        );
        this.engine.addObject(candy);
        added += 1;
      }

      candies -= added;
      ring += 1;

    }

    gridSystem.findMaxDepth();

    var soundSystem = this.engine.getSystem(ComponentType.SOUND);
    soundSystem.playSound("sfx.time.penalty");


  }

  drop()
  {
    console.log("DROP CURSOR PIECE");
    var event = new EngineEvent(EngineEvent.FORCE_DROP);
    this.dispatchEvent(event);
  }

  getComboCount()
  {
    return this.comboCount;
  }

  gameWin()
  {
    // Logic to progress to the next level
    this.stop();
    var event = new EngineEvent(EngineEvent.GAME_WIN, null, null, null);
    this.dispatchEvent(event)
  }

}

export default LogicSystem;


