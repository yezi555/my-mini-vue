import { effect ,} from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { createAppAPI } from "./createApp";
import { queueJobs } from "./scheduler";
import { Fragment, Text } from "./vnode";


export function createRenderer(options: any) {

  const { 
    createElement: hostCreateElement,
     patchProp: hostPatchProp, 
     insert: hostInsert,
     remove:hostRemove,
     setElementText:hostSetElementText
     } = options


  function render(vnode: any, container: any,) {
    //
    patch(null, vnode, container, null,null)
  }
  //shapeFlags 
  //vnode ->flag
  //n1 -》旧节点
  //n2 -》新节点
  function patch(n1: any, n2: any, container: any, parentComponent: any,anthor:any) {

    //去处理组件  
    //判断vnode 是不是应该element
    //如果是那么就处理element ，
    //如果是component就处理component
    const { type, shapeFlag } = n2
    //Fragment ->只渲染children

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent,anthor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {

          processElement(n1, n2, container, parentComponent,anthor)

        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {

          processComponent(n1, n2, container, parentComponent,anthor);

        }
        break;
    }

  }

  function processFragment(n1: any, n2: any, container: any, parentComponent: any,anthor:any) {
    mountChildren(n2.children, container, parentComponent,anthor)
  }

  function processText(n1: any, n2: any, container: any) {

    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processElement(n1: any, n2: any, container: any, parentComponent: any,anthor:any) {
    //init
    if (!n1) {
      mountElement(n2, container, parentComponent,anthor)
    } else {
      patchElement(n1, n2, container, parentComponent,anthor)
    }
  }

  function patchElement(n1: any, n2: any, container: any, parentComponent: any,anthor:any) {
    console.log('patchElement');
    console.log('n1', n1);
    console.log('n2', n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el);
    patchChildren(n1,n2,el,parentComponent,anthor);
    patchProps(el, oldProps, newProps);

  }

  function patchChildren(n1:any,n2:any,container:any,parentComponent:any,anthor:any){

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
        mountChildren(c2, container, parentComponent,anthor)
      }else{
        //array diff array
        patchKeyedChildren(c1,c2,container,parentComponent,anthor);
      }

    }

  }
function patchKeyedChildren(c1:any,c2:any,container:any,parentComponent:any,parentAnthor:any){
  const l2 = c2.length;
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    function isSomeVNodeType(n1:any,n2:any){
      return n1.type === n2.type && n1.key === n2.key;
    }
    //左侧
    while(i <= e1 && i <= e2 ){
      const n1 = c1[i];
      const n2 = c2[i];

      if(isSomeVNodeType(n1,n2)){
        patch(n1, n2, container, parentComponent,parentAnthor);
      }else{
        break;
      }
      i++;
    }

    // console.log('i',i)
    //右侧
    while(i <= e1 && i <= e2){
      const n1 = c1[e1];
      const n2 = c2[e2];
      if(isSomeVNodeType(n1,n2)){
        patch(n1, n2, container, parentComponent,parentAnthor);
      }else{
        break;
      }
      e1--;
      e2--;
    }
    //3.新的比老的多。创建
    if(i > e1){
      if(i <= e2){

        const nextPos = e2 + 1;
        const anthor = nextPos < l2 ? c2[nextPos].el :null ;
        while(i <= e2){
          patch(null, c2[i], container, parentComponent,anthor);
          i++;
        }

      }
    }else if(i > e2){
      while(i <= e1){
       hostRemove(c1[i].el);
       i++; 
      }
    }else{

      //中间对比
      let s1 = i;
      let s2 = i;
      const toBePatched = e2 - s2 +1; 
      let patched = 0;
      const keyToNextIndexMap = new Map();
      const newIndexToOldIndexMap = new Array(toBePatched);
      let moved = false;
      let maxNewIndexSpFar = 0;

      for(let i = 0; i < toBePatched ;i++)newIndexToOldIndexMap[i] = 0;

      for(let  i = s2;i <= e2; i++){
        const nextChild = c2[i];
        keyToNextIndexMap.set( nextChild.key,i);
      }
      

      for(let i = s1;i <= e1; i++){
        const prevChild = c1[i];

        if(patched >= toBePatched){
          hostRemove(prevChild.el);
        }
        let newIndex ;

        if(prevChild.key !== null){
           newIndex = keyToNextIndexMap.get(prevChild.key);
        }else{

          for(let j = s2; j <= e2; j++){
            if(isSomeVNodeType(prevChild,c2[j])){
              newIndex = j;

              break;
            }
          }
        }

        if(newIndex === undefined){
          hostRemove(prevChild.el);
        }else{
          if(newIndex >= maxNewIndexSpFar){
            maxNewIndexSpFar = newIndex;
          }else{
            moved = true;
          }

          newIndexToOldIndexMap[newIndex -  s2] = i + 1;
          patch(prevChild,c2[newIndex],container,parentComponent,null);
          patched++;
        }
      }

      const increasingNewIndexSequence =moved ? getSequence(newIndexToOldIndexMap):[];
      let j = increasingNewIndexSequence.length - 1;
      for(let i = toBePatched - 1; i >= 0; i--){
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 <l2?c2[nextIndex + 1].el:null;

        if(newIndexToOldIndexMap[i] === 0){

          patch(null,nextChild,container,parentComponent,anchor);

        }else if(moved){
          if(j < 0 || i !== increasingNewIndexSequence[j]){
            console.log('移动位置')
            hostInsert(nextChild.el,container,anchor);
          }else{
            j--
          }
        }
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
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      if(oldProps !== EMPTY_OBJ){
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
  
          }
        }
      }
     
    }

  }


  function mountElement(vnode: any, container: any, parentComponent: any,anthor:any) {

    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {

      el.textContent = children;

    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent,anthor)
    }
    //props
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    // container.append(el);
    hostInsert(el, container,anthor);

  }

  function mountChildren(children: any, container: any, parentComponent: any,anthor:any) {
    children.forEach((v: any) => {
      patch(null, v, container, parentComponent,anthor);
    })
  }

  function processComponent(n1: any, n2: any, container: any, parentComponent: any,anthor:any) {
    if(!n1){
      mountComponent(n2, container, parentComponent,anthor)
    }else[
      updateComponent(n1,n2)
    ]
  }

  function updateComponent(n1:any,n2:any){
    const instance = ( n2.component = n1.component) ;

    if(shouldUpdateComponent(n1,n2)){
      instance.next = n2;
      instance.update()
    }else{
      n1.el = n2.el;
      instance.vnode = n2;
    }
  }


  function mountComponent(initialVNode: any, container: any, parentComponent: any,anthor:any) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ));

    setupComponent(instance);
    setupRenderEffect(instance, container, initialVNode,anthor)
  }

  //生成虚拟节点
  function setupRenderEffect(instance: any, container: any, initialVNode: any,anthor:any) {
   instance.update =  effect(() => {
      if (!instance.isMounted) {
        console.log("init");

        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy,proxy));

        patch(null, subTree, container, instance,anthor);
        initialVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log("update");

        //需要一个更新完成之后的vnode；
        const { next ,vnode } = instance;
        if(next){
          next.el = vnode.el;
          updateComponentPreRender(instance,next);
        }

        const { proxy } = instance
        const subTree = instance.render.call(proxy,proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        // console.log('subTree',subTree,prevSubTree);
        patch(prevSubTree, subTree, container, instance,anthor);

      }

    },{
      scheduler(){
        console.log('update, - scheduler');
        queueJobs(instance.update);
      }
    })

  }
  return {
    createApp: createAppAPI(render)
  }
}

function updateComponentPreRender(instance:any,nextVNode:any){

  instance.vnode = nextVNode;
  instance.next = null;
  instance.props = nextVNode.props;
}


function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
