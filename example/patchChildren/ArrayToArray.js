import { h ,ref} from '../../lib/guide-mini-vue.esm.js'


//1，左侧的对比
//(a b ) c
//(a b ) d e

// const prevChildren = [
//   h("div",{key:'A'},"A"),
//   h("div",{key:"B"},"B"),
//   h("div",{key:"C"},"C")
// ];
// const nextChildren = [
//   h("div",{key:'A'},"A"),
//   h("div",{key:"B"},"B"),
//   h("div",{key:"D"},"D") ,
//   h("div",{key:"E"},"E")  
// ];

//2.右侧的对比
// a ( b c) 
//d e (b c)

// const prevChildren = [
//   h("div",{key:'A'},"A"),
//   h("div",{key:"B"},"B"),
//   h("div",{key:"C"},"C")
// ];
// const nextChildren = [
//   h("div",{key:"D"},"D"),
//   h("div",{key:"E"},"E"),
//   h("div",{key:"B"},"B"),
//   h("div",{key:"C"},"C") 
// ];

//3.新的比老的长
//创建新的 
//左侧
//（a b)
//（a b ）c
//i = 2，e1 = 1，e2 = 2

// const prevChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
// ]

// const nextChildren = [
//   h("p",{key:'A'},"A"),
//   h("p",{key:"B"},"B"),
//   h("p",{key:"C"},"C")
// ];

//左侧
//（a b）
//c （a b）
//i = 0 ，e1 = -1 ，e2 = 0

const prevChildren = [
  h('p',{key:"A"},"A"),
  h('p',{key:"B"},"B"),
]

const nextChildren = [
  h("p",{key:"D"},"D"),
  h("p",{key:"C"},"C"),
  h("p",{key:'A'},"A"),
  h("p",{key:"B"},"B"),
];

//4.老的比新的长
//删老的
//左侧
//（a b) c
//(a b )
//i = 2, e1 = 2, e2 = 1

// const prevChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("div",{key:"C"},"C"),
// ]

// const nextChildren = [
//   h("p",{key:'A'},"A"),
//   h("p",{key:"B"},"B"),
// ];

//右侧
//a（b 长、) 
//(b c)
//i = 2, e1 = 2, e2 = 1

// const prevChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("p",{key:"C"},"C"),
// ]

// const nextChildren = [
//   h("p",{key:"B"},"B"),
//   h("p",{key:"C"},"C"),
// ];



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