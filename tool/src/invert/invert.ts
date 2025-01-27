import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import { InverseStatus, uncompiledRules } from './config'
import { JSONPath } from 'jsonpath-plus'
import * as path from 'path'
import * as yaml from 'yaml'
import * as fs from 'fs'
import { SpectralCSVObject } from '../spectral/spectral_result_handler'

export function invert(
  spectralMessages: ISpectralDiagnostic[],
  specPath: string
): Inversion[] {
  return Object.keys(uncompiledRules).map(rule => {
    const ruleMeta = uncompiledRules[rule]
    const messages = spectralMessages.filter(message => message.code === rule)
    const possibleMessages = countPossibleErrors(rule, specPath)
    return new Inversion(
      messages.length,
      possibleMessages,
      ruleMeta.status,
      ruleMeta.triggers,
      messages
    )
  })
}

export class Inversion {
  thrownMessages: number
  possibleMessages: number
  inverseStatus: InverseStatus
  triggers: number
  spectralMessages: SpectralCSVObject[]

  constructor(
    thrownMessages: number,
    possibleMessages: number,
    inverseStatus: InverseStatus,
    triggers: number,
    spectralMessages: ISpectralDiagnostic[]
  ) {
    this.thrownMessages = thrownMessages
    this.possibleMessages = possibleMessages
    this.inverseStatus = inverseStatus
    this.triggers = triggers
    this.spectralMessages = spectralMessages.map(
      message => new SpectralCSVObject(message)
    )
  }

  toString() {
    return JSON.stringify({
      thrownMessages: this.thrownMessages,
      possibleMessages: this.possibleMessages,
      inverseStatus: this.inverseStatus,
      triggers: this.triggers,
      spectralMessages: this.spectralMessages
    })
  }
}

export function readSpecFile(filepath: string) {
  const ext = path.extname(filepath)
  const data = fs.readFileSync(filepath, 'utf8')
  if (ext === '.yaml' || ext === '.yml') {
    return yaml.parse(data)
  } else {
    throw new Error('Unsupported file type')
  }
}

export function countPossibleErrors(rule: string, path: string) {
  const specString = readSpecFile(path)
  return uncompiledRules[rule].given
    .map(jsonPath => JSONPath({ path: jsonPath, json: specString }).length)
    .reduce((accumulator, current) => accumulator + current, 0)
}
