import { baseParse } from "../src/parse"
import { generate } from "../src/codegen"
import { transform } from "../src/transform";
import { transformExpression } from "../src/transform/transformExpression";
import { transformEelement } from "../src/transform/transformElement";



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
      const ast = baseParse('<div></div>');
      transform(ast,{
        nodeTransforms:[transformEelement]
      });

      const {code} = generate(ast);

      //快照
      //1.抓bug
      //2.有意
      expect(code).toMatchSnapshot();
    })

})