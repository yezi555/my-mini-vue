
import { createRenderer } from '../runtime-core'

function createElement(type:any){
  console.log('createElement-------------')
    return document.createElement(type);
}

 function pathProp(el:any,key:any,val:any){
  console.log('pathProp-------------')

   const isOn = (key:string) =>/^on[A-Z]/.test(key);
    if(isOn(key)){
      const event = key.slice(2).toLocaleLowerCase();
      el.addEventListener(event,val)
    }else{
      el.setAttribute(key, val)

    }
}

 function insert(el:any,parent:any){
  console.log('insert-------------' ,parent)
    parent.append(el);
}

const render:any = createRenderer({
  createElement,
  pathProp,
  insert
})
export function createApp(...args:any){
  return render.createApp(...args)

}

export * from "../runtime-core";
