// import { render } from "./render";
import { createVnode } from "./vnode";

export function createAppAPI(render:any){
  return function createApp(rootComponent:any){

    return {
  
      mount(rootContainer:any){
        //先vnode
        //component -》vnode
        //所有的逻辑基于vnode微处理
        const vnode = createVnode(rootComponent);
        
        render(vnode,rootContainer);
      }
    
    }
  
  }
}
