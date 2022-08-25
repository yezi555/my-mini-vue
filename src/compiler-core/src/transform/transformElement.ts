import { createVnodeCall, NodeTypes } from "../ats";


export function transformEelement(node:any,context:any){

  if(node.type === NodeTypes.ELEMENT){
    return ()=>{

        //tag
        const vnodeTag = `"${node.tag}"`;

        //props
        let  vnodeprops;

        const children = node.children;
        let vnodeCHildren = children[0];

        node.codegenNode = createVnodeCall(context,vnodeTag,vnodeprops,vnodeCHildren)
    }
  } 
}

