
class BaseVO
{
  constructor(data)
  {
    for(var key in data) {
      if(this[key] !== undefined) {
        this[key] = data[key];
      }
    }
  }

}

export default BaseVO
