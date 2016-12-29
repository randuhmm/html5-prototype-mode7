
import puremvc from 'puremvc';
import ModelPrepCommand from 'loader/controller/ModelPrepCommand';
import ViewPrepCommand from 'loader/controller/ViewPrepCommand';

class StartupCommand extends puremvc.MacroCommand
{

  initializeMacroCommand()
  {
    this.addSubCommand(ModelPrepCommand);
    this.addSubCommand(ViewPrepCommand);
  }

}

export default StartupCommand;


