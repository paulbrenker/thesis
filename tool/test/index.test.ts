import { logHello } from '../src'
import { HelloWorld } from '../src/hello_world/HelloWorld'

describe('logHello', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })
  it('logs "Hello World!"', () => {
    const log = jest.spyOn(console, 'log')
    jest.spyOn(HelloWorld, 'sayHello').mockReturnValue('Hello World!')

    logHello()

    expect(log).toHaveBeenCalledWith('Hello World!')
    log.mockRestore()
  })
})
