import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import { JsonPath } from '@stoplight/types'

class SpectralResultHandler {
  handleResults(
    results: ISpectralDiagnostic[],
    rules: string[]
  ): (SpectralCSVObject[] | undefined)[] {
    const mappedResults = results.map(result => new SpectralCSVObject(result))
    const resultCodes = results.map(result => result.code)

    const csvRow: (SpectralCSVObject[] | undefined)[] = rules.map(rule => {
      if (resultCodes.includes(rule)) {
        return mappedResults.filter(element => element.code === rule)
      } else null
    })
    return csvRow
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
}

export { SpectralCSVObject, SpectralResultHandler }
