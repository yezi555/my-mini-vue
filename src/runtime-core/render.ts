import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options: any) {

  const { createElement:hostCreateElement, pathProp:hostPathProp, insert:hostInsert } = options


  function render(vnode: any, container: any,) {
    //
    path(vnode, container, null)
  }
  //shapeFlags 
  //vnode ->flag
  function path(vnode: any, container: any, parentComponent: any) {

    //去处理组件  
    //判断vnode 是不是应该element
    //如果是那么就处理element ，
    //如果是component就处理component
    const { type, shapeFlag } = vnode
    //Fragment ->只渲染children

    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {

          processElement(vnode, container, parentComponent)

        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {

          processComponent(vnode, container, parentComponent);

        }
        break;
    }

  }

  function processFragment(vnode: any, container: any, parentComponent: any) {
    mountChildren(vnode, container, parentComponent)
  }

  function processText(vnode: any, container: any) {

    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processElement(vnode: any, container: any, parentComponent: any) {
    //init
    mountElement(vnode, container, parentComponent)

  }

  function mountElement(vnode: any, container: any, parentComponent: any) {

    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {

      el.textContent = children;

    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }
    //props
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      hostPathProp(el, key, val);
    }
    // container.append(el);
    hostInsert(el, container);

  }

  function mountChildren(vnode: any, container: any, parentComponent: any) {
    vnode.children.forEach((v: any) => {
      path(v, container, parentComponent);
    })
  }

  function processComponent(vnode: any, container: any, parentComponent: any) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVNode: any, container: any, parentComponent: any) {
    const instance =(initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ));

    setupComponent(instance);
    setupRenderEffect(instance, container, initialVNode)
  }

  function setupRenderEffect(instance: any, container: any, initialVNode: any) {
    const { proxy } = instance

    const subTree = instance.render.call(proxy);

    path(subTree, container, instance);
    initialVNode.el = subTree.el
  }
  return{
    createApp:createAppAPI(render)
  }
}