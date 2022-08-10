


class ReactiveEffect{
  private _fn: any

  constructor(fn){
    this._fn = fn
  }
  run(){
    activeEffect = this;
    this._fn()
  }
}

//触发依赖
let activeEffect;

const targetMap = new Map()
export function track(target,key){
  //target ->key ->dep
  let depsMap =  targetMap.get(target)
  if(!depsMap){
    depsMap = new Map();
    targetMap.set(target,depsMap)
  }

  let dep = depsMap.get(key)
  if(!dep){
    dep = new Set()
    depsMap.set(key,dep)
  }
  dep.add(activeEffect);
}

//依赖收集
export function trigger(target,key){

  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for(const effect of dep){
    effect.run();
  }

}


export function effect(fn){
  //
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}