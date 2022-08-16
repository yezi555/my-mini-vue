import { ShapeFlags } from "../shared/ShapeFlags";


export function initSlots(instance:any,children:any){
//检测是否需要slots
const {vnode} = instance;
if(vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN){
  normalizeObjectSlots(children,instance.slots)

}
  // instance.slots = Array.isArray(children)? children : [children] ;
}

function normalizeObjectSlots(children:any,slots:any){
  for(const key in children){

    const value = children[key]
    //slot
    slots[key] = (props)=> normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value:any){
  return Array.isArray(value)?value :[value];
}