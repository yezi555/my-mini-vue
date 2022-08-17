import { createRenderer } from '../../lib/guide-mini-vue.esm.js';
import { App } from './App.js'

console.log('PIXI',PIXI);
const game = new PIXI.Application({
  width:500,
  height:500
})
document.body.append(game.view)
const renderer = createRenderer({
  createElement(type){
      if(type === 'react'){
        const react = new PIXI.Graphics();
        react.beginFill(0xff0000);
        react.drawRect(0,0,100,100);
        react.endFill();
        return react;
      }
  },
  pathProp(el,key,val){
    el[key] = val;
  },
  insert(el,parent){
    parent.addChild(el)
  }
})
renderer.createApp(App).mount(game.stage);
// const rootContainer = document.querySelector('#app')
// createApp(App).mount(rootContainer);