import { getCurrentInstance } from "./component";


//存
export function provide (key:any,value:any){

  //key value
  const currrentInstance:any = getCurrentInstance();

  if(currrentInstance){
    let { provides } = currrentInstance;
    const parentProvides = currrentInstance.parent.provides;

    if(provides === parentProvides){
      provides = currrentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}

//取
export function inject (key:any,defaultValue:any){

  const currrentInstance:any = getCurrentInstance();

  if(currrentInstance){
    const { parent } = currrentInstance;
    const parentProvides = currrentInstance.parent.provides;
    if(key in parentProvides){
      return parentProvides[key];
    }else if(defaultValue){

      if(typeof defaultValue === "function"){
        return defaultValue()
      }
      return defaultValue;
    }
  }

}