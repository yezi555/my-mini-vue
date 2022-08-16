import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment ,Text} from "./vnode";


export function render(vnode: any, container: any) {
  //
  path(vnode, container)
}
//shapeFlags
//vnode ->flag
function path(vnode: any, container: any) {

  //去处理组件  
  //判断vnode 是不是应该element
  //如果是那么就处理element ，
  //如果是component就处理component
  const { type, shapeFlag } = vnode
//Fragment ->只渲染children

  switch(type){
    case Fragment:
      processFragment(vnode,container);
      break;
    case Text:
      processText(vnode,container);
      break;
    default:
        if (shapeFlag & ShapeFlags.ELEMENT) {

          processElement(vnode, container)
      
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      
          processComponent(vnode, container);
      
        }
      break;
  }

}

function processFragment(vnode: any, container: any){
   mountChildren(vnode, container)
}

function processText(vnode: any, container: any){

    const { children }  = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}

function processElement(vnode: any, container: any) {
  //init
  mountElement(vnode, container)

}

function mountElement(vnode: any, container: any) {

  const el = (vnode.el = document.createElement(vnode.type));

  const { children ,shapeFlag} = vnode;

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {

    el.textContent = children;

  } else if (shapeFlag  & ShapeFlags.ARRAY_CHILDREN ) {
    mountChildren(vnode, el)
  }
  //props
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    // console.log('propskey',key);
    const isOn = (key:string) =>/^on[A-Z]/.test(key);
    if(isOn(key)){
      const event = key.slice(2).toLocaleLowerCase();
      el.addEventListener(event,val)
    }else{
      el.setAttribute(key, val)

    }
  }
  container.append(el);

}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((v: any) => {
    path(v, container);
  })
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance);
  setupRenderEffect(instance, container, initialVNode)
}

function setupRenderEffect(instance: any, container: any, initialVNode: any) {
  const { proxy } = instance

  const subTree = instance.render.call(proxy);

  path(subTree, container);
  initialVNode.el = subTree.el
}
