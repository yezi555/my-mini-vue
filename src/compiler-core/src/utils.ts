import { NodeTypes } from "./ats";


export   function isText(node:any){
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION 
}