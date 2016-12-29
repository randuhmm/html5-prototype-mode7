
import puremvc from 'puremvc';
import ModelPrepCommand from 'app/controller/ModelPrepCommand';
import ViewPrepCommand from 'app/controller/ViewPrepCommand';
import ManagerPrepCommand from 'app/controller/ManagerPrepCommand';

class StartupCommand extends puremvc.MacroCommand
{
  initializeMacroCommand()
  {
    this.addSubCommand(ModelPrepCommand);
    this.addSubCommand(ViewPrepCommand);
    this.addSubCommand(ManagerPrepCommand);
  }

}

export default StartupCommand;


