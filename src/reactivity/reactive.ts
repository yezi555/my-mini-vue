import { track ,trigger} from "./effect";
import { mutableHandlers ,readonlyHandlers} from "./baseHandler";

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

export function isReactive(value){
 return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value){
 return !!value[ReactiveFlags.IS_READONLY]

}
function createActiveObject(raw:any,baseHandlers:any){
  return new Proxy(raw,baseHandlers);
}

