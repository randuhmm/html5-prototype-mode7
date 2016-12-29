
var app = {};

// App
app.ApplicationFacade = require('app/ApplicationFacade').default;
app.ApplicationConstants = require('app/ApplicationConstants').default;

// Common
app.common = {};
//app.common = require('app/common').default;

// Display
app.display = {};
app.display.Shell = require('app/display/Shell').default;

// Controller
app.controller = {};
app.controller.ManagerPrepCommand = require('app/controller/ManagerPrepCommand').default;
app.controller.ModelPrepCommand = require('app/controller/ModelPrepCommand').default;
app.controller.StartupCommand = require('app/controller/StartupCommand').default;
app.controller.ViewPrepCommand = require('app/controller/ViewPrepCommand').default;

// Models
app.model = {};
app.model.DataProxy = require('app/model/DataProxy').default;
app.model.ResourceProxy = require('app/model/ResourceProxy').default;

// Views
app.view = {};
app.view.ShellMediator = require('app/view/ShellMediator').default;

export default app;
