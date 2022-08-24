import { NodeTypes } from "../src/ats";
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"

describe('',()=>{
    it('happy path',()=>{
      const ast = baseParse("<div>hi,{{message}}</div>");
      const plugin = (node:any)=>{
        if(node.type === NodeTypes.TEXT){
          node.content = node.content + 'mini-vue';
        }
        
      }
      transform(ast,{
        nodeTransforms:[plugin]
      });
      const nodeText = ast.children[0].children[0];
      expect(nodeText.content).toBe('hi,mini-vue');
    })
})