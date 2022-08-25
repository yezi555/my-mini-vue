import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformEelement } from "./transform/transformElement";
import { transformExpression } from "./transform/transformExpression";
import { transformText } from "./transform/transformText";

export function baseCompile(template:any){
  const ast:any = baseParse(template);
  transform(ast,{
    nodeTransforms:[transformExpression,transformEelement,transformText]
  });

  console.log('ast------',ast,ast.codegenNode.children);
  
  return generate(ast);
}