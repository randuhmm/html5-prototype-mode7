

class ComponentMessage
{
  
  // type: null,
  
  // data: null,
  
  constructor(type, data)
  {
    if(!data) data = {};
    this.type = type;
    this.data = data;
  }
  
}

export default ComponentMessage;


