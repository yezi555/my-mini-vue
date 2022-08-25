import { CREARE_ELEMENT_VNODE } from "./runtimeHelpers";

export enum NodeTypes{
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION
}

export function createVnodeCall(context:any,tag:any,props:any,children:any){
  context.helper(CREARE_ELEMENT_VNODE);

  return{
    type:NodeTypes.ELEMENT,
    tag,
    props,
    children
  }
}