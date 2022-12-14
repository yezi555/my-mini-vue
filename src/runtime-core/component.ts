import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps} from './componentProps'
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";
import { proxyRefs } from "../reactivity";


export function createComponentInstance(vnode:any,parent:any){
  // console.log('createComponentInstance',parent)
   const component = {
     vnode,
     type:vnode.type,
     setupState:{},
     props:{},
     slots:{},
     provides:parent? parent.provides:{},
     parent,
     isMounted:false,
     subTree:{},
     emit:()=>{}
   }
   component.emit = emit.bind(null,component) as any;
   return component
}


export function setupComponent(instance:any){

    initProps(instance,instance.vnode.props);

    initSlots(instance,instance.vnode.children);

    setupStatefulComponent(instance);
}


function setupStatefulComponent(instance:any){
  const Component = instance.type;

  //ctx
  instance.proxy = new Proxy(
    {_:instance}, PublicInstanceProxyHandlers,
  );

  const {setup} = Component ;

  if(setup){
    setCurrenInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props),{
      emit:instance.emit
    });
    setCurrenInstance(null) ;
    handleSetupResult(instance,setupResult);
  }
}

function handleSetupResult(instance:any,setupResult: any) {
  //function object

  if(typeof setupResult ==='object'){
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  if(compiler && !Component.render){
    if(Component.template){
      Component.render = compiler(Component.template)
    }
  }

  instance.render = Component.render;

  // if(Component.render){
  //     instance.render = Component.render;
  // }
}

let currentInstance:any = null;

export function getCurrentInstance(){
  return currentInstance
}

export function setCurrenInstance(instance:any){
  currentInstance = instance
}

let compiler:any;

export function registerRuntimeCompiler(_compiler:any){
  compiler = _compiler
}