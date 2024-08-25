import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import {
  SpectralResultHandler,
  SpectralCSVObject
} from '../../src/spectral/spectral_result_handler'

describe('SpectralResultHandler', () => {
  it.each([
    {
      description: 'one message per rule',
      spectralMessages: [
        {
          code: 'test-rule',
          message: 'test message',
          severity: 1
        } as ISpectralDiagnostic
      ],
      rules: ['test-rule', 'unmatched-rule'],
      expected: [
        JSON.stringify([
          new SpectralCSVObject({
            code: 'test-rule',
            message: 'test message',
            severity: 1
          } as ISpectralDiagnostic).toString()
        ]),
        ''
      ]
    },
    {
      description: 'multiple messages per rule',
      spectralMessages: [],
      rules: ['test-rule', 'unmatched-rule'],
      expected: ['', '']
    },
    {
      description: 'no message to undefined',
      spectralMessages: [
        {
          code: 'test-rule',
          message: 'first message',
          severity: 1
        } as ISpectralDiagnostic,
        {
          code: 'test-rule',
          message: 'second message',
          severity: 1
        } as ISpectralDiagnostic
      ],
      rules: ['test-rule', 'unmatched-rule'],
      expected: [
        JSON.stringify([
          new SpectralCSVObject({
            code: 'test-rule',
            message: 'first message',
            severity: 1
          } as ISpectralDiagnostic).toString(),
          new SpectralCSVObject({
            code: 'test-rule',
            message: 'second message',
            severity: 1
          } as ISpectralDiagnostic).toString()
        ]),
        ''
      ]
    }
  ])('should map $description successfully', input => {
    const handler = new SpectralResultHandler()
    const result = handler.handleResults(input.spectralMessages, input.rules)

    expect(result).toEqual(input.expected)
  })
})
