import { h ,ref} from '../../lib/guide-mini-vue.esm.js'

const prevChildren = [h("div",{},"A"),h("div",{},"B")];
const nextChildren = [h("div",{},"C"),h("div",{},"D")];

export const ArrayToArray = {
  name:"ArrayToArray",
  setup(){ 
    const isChange = ref(false);
    window.isChange = isChange;
    return{
      isChange
    }
  },
  render(){ 
    const self = this;
    return self.isChange === true
    ?h("div",{},nextChildren)
    :h("div",{}, prevChildren)
   }
}