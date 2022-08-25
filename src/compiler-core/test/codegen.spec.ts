import { baseParse } from "../src/parse"
import { generate } from "../src/codegen"
import { transform } from "../src/transform";
import { transformExpression } from "../src/transform/transformExpression";
import { transformEelement } from "../src/transform/transformElement";
import { transformText } from "../src/transform/transformText";



describe('codegen',()=>{

    it('string',()=>{
      const ast = baseParse('hi');
      transform(ast);

      const {code} = generate(ast);

      //快照
      //1.抓bug
      //2.有意
      expect(code).toMatchSnapshot();
    });

    it("interpolation",()=>{
      const ast = baseParse('{{message}}');
      transform(ast,{
        nodeTransforms:[transformExpression]
      });

      const {code} = generate(ast);

      //快照
      //1.抓bug
      //2.有意
      expect(code).toMatchSnapshot();
    });
    
    it("element",()=>{
      const ast:any = baseParse('<div>hi,{{message}}</div>');
      transform(ast,{
        nodeTransforms:[transformExpression,transformEelement,transformText]
      });

      console.log('ast------',ast,ast.codegenNode.children);
      
      const {code} = generate(ast);
      //快照
      //1.抓bug
      //2.有意
      expect(code).toMatchSnapshot();
    })

})