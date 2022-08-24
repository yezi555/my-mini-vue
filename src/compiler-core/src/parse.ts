import { NodeTypes } from "./ats";

const enum TagTypes {
  Start,
  End,
}

export function baseParse(content:string){

  const  context = createParseCountext(content);

  return createRoot(parseChildren(context,[]))
}


function parseChildren(context:any,ancestors:any){
  const nodes:any = []

  while(!isEnd(context,ancestors)){
    let  node;
    const s = context.source;
    if(s.startsWith("{{")){
      node = parseInterpolation(context)
    }else if(s[0] === '<'){
      if(/[a-z]/i.test(s[1])){
        node =  parseElement(context,ancestors)
      }
    }
    if(!node){
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}

function isEnd(context:any,ancestors:any){
  //2.遇到结束标签的时候
  const s = context.source;

  if(s.startsWith('</')){
    for (let i = ancestors.length - 1; i >=0; i--) {
      const tag = ancestors[i].tag;
      if(startsWithEndTagOpen(s,tag) ){
        return true
      }
    }
  }

  // if(parentTag && s.startsWith(`</${parentTag}>`)){
  //   return true
  // }
  //1.source有值的时候
  return !s;

}

function parseTextData(context:any,length:number){
  const content = context.source.slice(0, length)
  advanceBy(context, length);
  return content
}

function parseText(context:any){
  let endIndex = context.source.length;
  let endToken = [ "<","{{"];
  for (let i = 0; i < endToken.length; i++) {
    const index = context.source.indexOf(endToken[i]);
    if(index !== -1 && endIndex > index){
      endIndex = index;
    }
  }
  

  const content = parseTextData(context,endIndex);
  return{
    type:NodeTypes.TEXT,
    content
  }
}


function parseElement(context:any,ancestors:any){
  //解析tag
  //删除处理完成的代码
  const element:any =  parseTag(context,TagTypes.Start);
  ancestors.push(element);
  element.children = parseChildren(context,ancestors);
  ancestors.pop();

  if(startsWithEndTagOpen(context.source,element.tag)){
    parseTag(context,TagTypes.End);

  }else{
    throw new Error(`缺少结束标签:${element.tag}`)
  }

  return element;
}

function startsWithEndTagOpen(source:string,tag:string){
  return source.startsWith('<') && source.slice(2,2 + tag.length).toLowerCase() === tag.toLowerCase()
}

function parseTag(context:any,type:TagTypes){
  const match:any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context,match[0].length)
  advanceBy(context,1)

  if(type === TagTypes.End) return;
  return{
    type:NodeTypes.ELEMENT,
    tag
  }
}


function parseInterpolation(context:any){
//
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context,openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = parseTextData(context,rawContentLength) ;
  const content = rawContent.trim();

  advanceBy(context,closeDelimiter.length);


  return {
    type:NodeTypes.INTERPOLATION,
    content:{
      type:NodeTypes.SIMPLE_EXPRESSION,
      content:content
    }
  }
}

function advanceBy(context:any,length:number){

  context.source =  context.source.slice(length);
}

function createRoot(children:any){
  return {
    children,
  }
}

function createParseCountext(content:string):any{

  return {
    source:content
  }
}