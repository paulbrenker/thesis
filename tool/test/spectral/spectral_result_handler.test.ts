import { InverseStatus } from '../../src/invert/config'
import { SpectralResultHandler } from '../../src/spectral/spectral_result_handler'
import { Inversion } from '../../src/invert/invert'

describe('SpectralResultHandler', () => {
  it('should map successfully to JSON string', () => {
    const handler = new SpectralResultHandler()

    const invertedSpec = [new Inversion(0, 0, InverseStatus.OPENAPI_2_X, 0, [])]
    const expected = [invertedSpec[0].toString()]
    const result = handler.handleResults(invertedSpec)
    expect(result).toEqual(expected)
  })
})
