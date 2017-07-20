
import puremvc from 'puremvc';
import ModelDestroyCommand from 'app/controller/ModelDestroyCommand';
import ViewDestroyCommand from 'app/controller/ViewDestroyCommand';
import ManagerDestroyCommand from 'app/controller/ManagerDestroyCommand';

class StartupCommand extends puremvc.MacroCommand
{
  initializeMacroCommand()
  {
    this.addSubCommand(ModelDestroyCommand);
    this.addSubCommand(ViewDestroyCommand);
    this.addSubCommand(ManagerDestroyCommand);
  }

}

export default StartupCommand;


