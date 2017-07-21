
var EngineConstants = {};

// Grid constants
EngineConstants.SECTIONS = 8;
EngineConstants.DEPTH = 10;

// World constants
EngineConstants.SECTION_ANGLE = Math.PI / EngineConstants.SECTIONS;

// Screen constants
EngineConstants.Si = 20;
EngineConstants.A = 1.0;
EngineConstants.B = 6;
EngineConstants.C = 32;
EngineConstants.R = 800;
EngineConstants.BASE_R = 800;

EngineConstants.ScreenS = {};
EngineConstants.ScreenR = {};

EngineConstants.GridToWorldH = function(x,y)
{
  return y;
};

EngineConstants.GridToWorldA = function(x,y)
{
  return ((2*x + y) * EngineConstants.SECTION_ANGLE) % (2*Math.PI);
};

EngineConstants.WorldToScreenS = function(h)
{
  if(EngineConstants.ScreenS[h] == undefined) {
    EngineConstants.ScreenS[h] = (EngineConstants.Si + Math.pow(h+1, 2)/2) * EngineConstants.R;
  }
  return EngineConstants.ScreenS[h];
};

EngineConstants.WorldToScreenR = function(h)
{
  if(EngineConstants.ScreenR[h] == undefined) {
    EngineConstants.ScreenR[h] = (EngineConstants.C + h*EngineConstants.B + EngineConstants.A*Math.pow(h, 2)) * EngineConstants.R;
  }
  return EngineConstants.ScreenR[h];
};

EngineConstants.INPUT_ADD_PIECE = 1;
EngineConstants.INPUT_MOVE_CURSOR = 2;

export default EngineConstants;