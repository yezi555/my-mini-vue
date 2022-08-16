import { track ,trigger} from "./effect";
import { mutableHandlers ,readonlyHandlers ,shallowReaconlyHandlers} from "./baseHandler";
import { isObject } from "../shared";

export const enum ReactiveFlags{
  IS_REACTIVE = "_v_isReactive",
  IS_READONLY = "_v_isReadonly"

}
export function reactive(raw:any){
 return createActiveObject(raw,mutableHandlers)

}

//
export function readonly(raw:any){
  return createActiveObject(raw,readonlyHandlers)
}

export function shallowReadonly(raw){
  return createActiveObject(raw,shallowReaconlyHandlers)

}

export function isReactive(value:any){
 return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value:any){
 return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value:any){
  return isReactive(value) || isReadonly(value)
}

function createActiveObject(target:any,baseHandlers:any){
if(!isObject(target)){
  console.warn(`target ${target} 必须是一个对象`)
}

  return new Proxy(target,baseHandlers);
}

