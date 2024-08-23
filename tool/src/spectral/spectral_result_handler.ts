import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import { JsonPath } from '@stoplight/types'

class SpectralResultHandler {
  handleResults(results: ISpectralDiagnostic[], rules: string[]) {
    const mappedResults: Map<string, SpectralCSVObject> = results.reduce(
      (acc, result) => {
        const spectralObject = new SpectralCSVObject(
          result.code.toString(),
          result.message,
          result.severity.valueOf(),
          result.path
        )
        acc.set(result.code.toString(), spectralObject)
        return acc
      },
      new Map<string, SpectralCSVObject>()
    )
    const csvRow: (SpectralCSVObject | null | undefined)[] = rules.map(rule =>
      mappedResults.has(rule) ? mappedResults.get(rule) : null
    )
  }
}

class SpectralCSVObject {
  code: string
  message: string
  severity: number
  path: JsonPath

  constructor(code: string, message: string, severity: number, path: JsonPath) {
    this.code = code
    this.message = message
    this.severity = severity
    this.path = path
  }
}

export default SpectralResultHandler
