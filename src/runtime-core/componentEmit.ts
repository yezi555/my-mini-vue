import {toHandlerKey,camlize} from '../shared'

export function emit(instance:any,event:any,...args){

  console.log('emit event',event)

  const { props } = instance;

  //TPP 开发模式：
  //先去写一个特定的行为， -》 重构成通用的行为
  //add
 
  const handlerName = toHandlerKey(camlize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}