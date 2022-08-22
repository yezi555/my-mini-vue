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
//   h("div",{key:"C"},"C"),
//   h("div",{key:"D"},"D"),
//   h("div",{key:"E"},"E"),
//   h("div",{key:"F"},"F"),
//   h("div",{key:"G"},"G"),
// ];
// const nextChildren = [
//   h("div",{key:'A'},"A"),
//   h("div",{key:"B"},"B"),
//   h("div",{key:"E"},"E"),
//   h("div",{key:"C"},"C"),
//   h("div",{key:"D"},"D"),
//   h("div",{key:"F"},"F"),
//   h("div",{key:"G"},"G"),
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
//   h("p",{key:"C"},"C"),
//   h("p",{key:"E"},"E"),
//   h("p",{key:"F"},"F"),
//   h("p",{key:"G"},"G")

// ]

// const nextChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("p",{key:"E"},"E"),
//   h("p",{key:"C"},"C"),
//   h("p",{key:"D"},"D"),
//   h("p",{key:"F"},"F"),
//   h("p",{key:"G"},"G")
// ];

//左侧
//（a b）
//c （a b）
//i = 0 ，e1 = -1 ，e2 = 0

// const prevChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
// ]

// const nextChildren = [
//   h("p",{key:"D"},"D"),
//   h("p",{key:"C"},"C"),
//   h("p",{key:'A'},"A"),
//   h("p",{key:"B"},"B"),
// ];

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


//5.对比中间部分
//删除老的，在老的里面存在，新的不存在
//5.1
//a b （c d） f g
// a ( e c ) f g
//d节点在新的里面没有-需要删除
//c节点也发生了变化

// const prevChildren = [
//     h('p',{key:"A"},"A"),
//     h('p',{key:"B"},"B"),
//     h("p",{key:"C",id:"c-prev"},"C"),
//     h("p",{key:"D"},"D"),
//     h("p",{key:"F"},"F"),
//     h("p",{key:"G"},"G"),
// ]

// const nextChildren = [
//     h('p',{key:"A"},"A"),
//     h('p',{key:"B"},"B"),
//     h("p",{key:"E"},"E"),
//     h("p",{key:"C",id:"c-next"},"C"),
//     h("p",{key:"F"},"F"),
//     h("p",{key:"G"},"G"),
// ];


//5.1.1
//a b ( c d e ) f g
// a b ( e c )  f g 
//中间部分老的比新的多，多出来的可以被删除，（优化删除逻辑）

// const prevChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("p",{key:"C",id:"c-prev"},"C"),
//   h("p",{key:"E"},"E"),
//   h("p",{key:"D"},"D"),
//   h("p",{key:"F"},"F"),
//   h("p",{key:"G"},"G"),
// ]

// const nextChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("p",{key:"E"},"E"),
//   h("p",{key:"C",id:"c-next"},"C"),
//   h("p",{key:"F"},"F"),
//   h("p",{key:"G"},"G"),
// ];


//综合例子

// const prevChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("p",{key:"C"},"C"),
//   h("p",{key:"D"},"D"),
//   h("p",{key:"E"},"E"),
//   h("p",{key:"Z"},"Z"),
//   h("p",{key:"F"},"F"),
//   h("p",{key:"G"},"G")

// ]

// const nextChildren = [
//   h('p',{key:"A"},"A"),
//   h('p',{key:"B"},"B"),
//   h("p",{key:"D"},"D"),
//   h("p",{key:"C"},"C"),
//   h("p",{key:"Y"},"Y"),
//   h("p",{key:"E"},"E"),
//   h("p",{key:"F"},"F"),
//   h("p",{key:"G"},"G")
// ];

const prevChildren = [
  h('p',{key:"A"},"A"),
  h("p",{},"C"),
  h('p',{key:"B"},"B"),
  h("p",{key:"D"},"D"),

]

const nextChildren = [
  h('p',{key:"A"},"A"),
  h('p',{key:"B"},"B"),
  h("p",{},"C"),
  h("p",{key:"D"},"D"),
];

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