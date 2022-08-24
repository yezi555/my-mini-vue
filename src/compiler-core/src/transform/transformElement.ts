import { NodeTypes } from "../ats";
import { CREARE_ELEMENT_VNODE } from "../runtimeHelpers";


export function transformEelement(node:any,context:any){

  if(node.type === NodeTypes.ELEMENT){

    context.helper(CREARE_ELEMENT_VNODE)
  }
}

