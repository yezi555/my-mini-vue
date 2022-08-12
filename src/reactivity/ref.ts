import { trackEffects ,triggerEffects ,isTracking} from './effect';
import { reactive } from './reactive';

import {hasChanged, isObject} from '../shared';

class RefImpl {
  private _value:any;
  public dep;
  private _rawValue:any;
  public _v_isRef = true;
  constructor(value){
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value(){
    trackRefValue(this)
    return   this._value;
  }
  set value(newValue){

    if(hasChanged(newValue,this._rawValue)){
      this._rawValue = newValue
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  
  }
}

function convert(value:any){
  return  isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref:any){
  if(isTracking()){
    trackEffects(ref.dep);
  }
}

export function ref(value:any){
    return new RefImpl(value)
}


export function isRef(ref:any){

  return !!ref._v_isRef

}

export function unRef(ref:any){

    return isRef(ref)? ref.value : ref;

}
export function proxyRefs(objectwithRefs:any){
  return new Proxy(objectwithRefs,{
     get(target,key){
        return unRef(Reflect.get(target,key));
     },
     set(target,key,value){
      if(isRef(target[key]) && !isRef(value)){
        return  target[key].value = value;
      }else{
        return Reflect.set(target,key ,value);
      }

     }
  })
}