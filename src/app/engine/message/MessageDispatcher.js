
var MessageDispatcher = {};

MessageDispatcher.Decorate = function(klass) {
  klass.addMethods(MessageDispatcher.Methods);
}

MessageDispatcher.Methods = {

  recieve: function(m)
  {
    if(this.recievers == undefined) return;
    if(this.recievers[m.type] == undefined) return;
  },

  addReciever: function()
  {
    //
  }


};

export default MessageDispatcher;
