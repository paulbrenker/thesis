import { HelloWorld } from '../../src/hello_world/HelloWorld'

describe('HelloWorld', () => {
  it('should return "Hello World!" when sayHello is called', () => {
    expect(HelloWorld.sayHello()).toBe('Hello World!')
  })
})
