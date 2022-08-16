export const extend = Object.assign;

//
export const isObject = (val:any)=>{
  return val !== null && typeof val === 'object'
}

//
export const hasChanged = (val,newValue)=>{
  return  !Object.is(val,newValue)
}

//检测对象是否有否个属性
export   const hasOwn = (val:any,key:any)=>Object.prototype.hasOwnProperty.call(val,key);


export const camlize = (str:string)=>{
  return  str.replace(/-(\w)/g,(_,c:string)=>{
     return c?c.toUpperCase():'';
   })
 }

export const  capitalize = (str:string)=>{
   return str.charAt(0).toUpperCase() + str.slice(1);
  }
export const toHandlerKey = (str:string)=>{
   return str ? `on${capitalize(str)}` :'';
  }