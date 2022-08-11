import {extend} from '../shared' 

let activeEffect;
let shouldTrack;
class ReactiveEffect{
  private _fn: any
  deps = [];
  active = true;
  onStop?:()=>void
  constructor(fn,public scheduler?){
    this._fn = fn
  }
  run(){

    if(!this.active){
      return  this._fn()
    }

    shouldTrack = true
    activeEffect = this;

    const result =  this._fn();

    shouldTrack = false
    return result

  }
  stop(){
    if(this.active){
      clearnupEffect(this);

      if(this.onStop){
        this.onStop();
      }
      this.active = false;
    }
  }
}
function clearnupEffect(effect:any){
  effect.deps.forEach((dep:any)=>{
    dep.delete(effect)
  })
  effect.deps.length = 0
}
//触发依赖


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
  if(!activeEffect) return
  if(!shouldTrack) return


  dep.add(activeEffect);
  activeEffect.deps.push(dep)
}

//依赖收集
export function trigger(target,key){

  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for(const effect of dep){
    if(effect.scheduler){
      effect.scheduler()
    }else{
      effect.run();
    }
  }

}


export function effect(fn:any,options :any={}){
  //fn
  const _effect = new ReactiveEffect(fn,options.scheduler)

  // _effect.onStop = options.onStop
  // Object.assign(_effect,options)

  extend(_effect,options)

  _effect.run()

  const runner:any =  _effect.run.bind(_effect)
  runner.effect = _effect;

  return runner
}

export function stop(runner:any){
  runner.effect.stop() 
}