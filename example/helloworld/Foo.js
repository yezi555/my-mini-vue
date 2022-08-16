import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props){

    console.log('props',props)
    props.count++
    console.log('props++',props)

  },
  render(){
    return h("div",{},"foo:" +this.count)
  }
}