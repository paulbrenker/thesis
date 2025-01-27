import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import { JsonPath } from '@stoplight/types'
import { Inversion } from 'src/invert/invert'

class SpectralResultHandler {
  handleResults(results: Inversion[]): string[] {
    return results.map(it => it.toString().replace(';', ','))
  }
}

class SpectralCSVObject {
  code: string
  message: string
  severity: number
  path: JsonPath

  constructor(fromISpectralDiagnostic: ISpectralDiagnostic) {
    this.code = fromISpectralDiagnostic.code.toString()
    this.message = fromISpectralDiagnostic.message
    this.severity = fromISpectralDiagnostic.severity.valueOf()
    this.path = fromISpectralDiagnostic.path
  }

  toString(): string {
    return JSON.stringify({
      code: this.code,
      message: this.message,
      severity: this.severity,
      path: this.path
    })
  }
}

export { SpectralCSVObject, SpectralResultHandler }
