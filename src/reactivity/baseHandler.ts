
import { track ,trigger} from "./effect";
import {reactive, ReactiveFlags, readonly } from './reactive'
import { extend, isObject} from '../shared'
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReaconlyGet =  createGetter(true,true);

//抽离公共的get方法
function createGetter(isReadonly = false,shallow = false){
  return function get(target,key){
    if(key === ReactiveFlags.IS_REACTIVE){
      return !isReadonly;
    }else if(key === ReactiveFlags.IS_READONLY){
      return isReadonly;

    }

    const res = Reflect.get(target,key)

    if(shallow){
      return res
    }

    if(isObject(res)){
      return isReadonly?readonly(res) :reactive(res);
    }
    if(!isReadonly){
      track(target,key)
    }
    return res
  } 
}

//抽离公共的set方法
function createSetter(){
  return function set(target,key,value){
    const res = Reflect.set(target,key,value)

    //触发依赖
    trigger(target,key);
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get:readonlyGet,
  set(target,key ,value){
    const res = Reflect.set(target,key,value)
    console.warn(`key:${key} set 失败 因为 target 是 readonly`,target)
    return res
  }
}

export const shallowReaconlyHandlers = extend({},readonlyHandlers,{
  get:shallowReaconlyGet,

}) 