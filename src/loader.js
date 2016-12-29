
var loader = {};

loader.ApplicationFacade = require('loader/ApplicationFacade').default;

// Controller
loader.controller = {};
loader.controller.ModelPrepCommand = require('loader/controller/ModelPrepCommand').default;
loader.controller.StartupCommand = require('loader/controller/StartupCommand').default;
loader.controller.ViewPrepCommand = require('loader/controller/ViewPrepCommand').default;

// Models
loader.model = {};
loader.model.ScriptsProxy = require('loader/model/ScriptsProxy').default;

// Views
loader.view = {};
loader.view.LoaderMediator = require('loader/view/LoaderMediator').default;

export default loader;
