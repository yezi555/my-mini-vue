import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options: any) {

  const { 
    createElement: hostCreateElement,
     patchProp: hostPathProp, 
     insert: hostInsert,
     remove:hostRemove,
     setElementText:hostSetElementText
     } = options


  function render(vnode: any, container: any,) {
    //
    path(null, vnode, container, null)
  }
  //shapeFlags 
  //vnode ->flag
  //n1 -》旧节点
  //n2 -》新节点
  function path(n1: any, n2: any, container: any, parentComponent: any) {

    //去处理组件  
    //判断vnode 是不是应该element
    //如果是那么就处理element ，
    //如果是component就处理component
    const { type, shapeFlag } = n2
    //Fragment ->只渲染children

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {

          processElement(n1, n2, container, parentComponent)

        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {

          processComponent(n1, n2, container, parentComponent);

        }
        break;
    }

  }

  function processFragment(n1: any, n2: any, container: any, parentComponent: any) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processText(n1: any, n2: any, container: any) {

    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processElement(n1: any, n2: any, container: any, parentComponent: any) {
    //init
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function patchElement(n1: any, n2: any, container: any, parentComponent: any) {
    console.log('patchElement');
    console.log('n1', n1);
    console.log('n2', n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el);
    patchChildren(n1,n2,el,parentComponent);
    patchProps(el, oldProps, newProps);

  }

  function patchChildren(n1:any,n2:any,container:any,parentComponent:any){

    const prevShapeFlag = n1.shapeFlag;
    const c1 = n1.children;

    const { shapeFlag } = n2;
    const c2 = n2.children;

    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
        if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
          //1.把老的清空
          unmountChildren(n1.children)
        }
        //2.设置text
        if(c1 !== c2 ){
          hostSetElementText(container,c2)
        }
    }else{
      //new Array
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
        //1.把老的清空
        hostSetElementText(container,"");
        mountChildren(c2, container, parentComponent)
      }
    }

  }


  function unmountChildren(children:any){

    for(let i = 0;i <  children.length; i++){
      const el = children[i].el;
      //remove
      hostRemove(el);
    }
  }


  function patchProps(el: any, oldProps: any, newProps: any) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        if (prevProp !== nextProp) {
          hostPathProp(el, key, prevProp, nextProp);
        }
      }

      if(oldProps !== EMPTY_OBJ){
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPathProp(el, key, oldProps[key], null);
  
          }
        }
      }
     
    }

  }


  function mountElement(vnode: any, container: any, parentComponent: any) {

    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {

      el.textContent = children;

    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
    }
    //props
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      hostPathProp(el, key, null, val);
    }
    // container.append(el);
    hostInsert(el, container);

  }

  function mountChildren(children: any, container: any, parentComponent: any) {
    children.forEach((v: any) => {
      path(null, v, container, parentComponent);
    })
  }

  function processComponent(n1: any, n2: any, container: any, parentComponent: any) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode: any, container: any, parentComponent: any) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ));

    setupComponent(instance);
    setupRenderEffect(instance, container, initialVNode)
  }

  //生成虚拟节点
  function setupRenderEffect(instance: any, container: any, initialVNode: any) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");

        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy));

        path(null, subTree, container, instance);
        initialVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        // console.log('subTree',subTree,prevSubTree);
        path(prevSubTree, subTree, container, instance);

      }

    })

  }
  return {
    createApp: createAppAPI(render)
  }
}