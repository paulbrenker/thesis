import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import { JsonPath } from '@stoplight/types'

class SpectralResultHandler {
  handleResults(results: ISpectralDiagnostic[], rules: string[]): string[] {
    const mappedResults = results.map(result => new SpectralCSVObject(result))
    const resultCodes = results.map(result => result.code)
    return rules.map(rule =>
      resultCodes.includes(rule)
        ? JSON.stringify(
            mappedResults
              .filter(element => element.code === rule)
              .map(element => element.toString())
          )
        : ''
    )
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
