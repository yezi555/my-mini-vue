import { h ,getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'
import  { Foo } from './Foo.js'


export const App = {
  name:"Provider",
  render(){
    return h("div",{}, [h("div",{},"currentInstance demo"),h(Foo)]);
  },
  setup(){
      const instance = getCurrentInstance();
      console.log('"App :',instance)
  }
}