import { h ,createTextVnode} from '../../lib/guide-mini-vue.esm.js'
import  { Foo } from './Foo.js'


export const App = {
  name:"App",
  render(){
   const app = h("div",{},"App");
   const foo = h(Foo,{} , {
    header:({age})=>[
      h("p",{}, "header " + age), 
      createTextVnode("你好哈哈哈哈")
    ],
    footer:()=>h('p',{},'footer')
  });

   return h("div",{},[app,foo]);
  },
  setup(){
    return {

    }
  }
}