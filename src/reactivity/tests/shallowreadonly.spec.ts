
import { isReactive ,isReadonly,readonly,shallowReadonly} from '../reactive'
describe('shallowReadonly',()=>{
  test('should not make non-reactice properties reactive',()=>{
    const props = shallowReadonly({ n : {foo :1 } } );
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });
  it('should call console.warn when set ',()=>{
    console.warn = jest.fn();
    const user = shallowReadonly({
      age:0
    });
    user.age = 11;
    expect(console.warn).toHaveBeenCalled();
  })
})