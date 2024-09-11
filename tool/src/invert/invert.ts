import { ISpectralDiagnostic } from '@stoplight/spectral-core'
import { InverseStatus, uncompiledRules } from './config'
import { JSONPath } from 'jsonpath-plus'
import * as path from 'path'
import * as yaml from 'yaml'
import * as fs from 'fs'

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
  spectralMessages: ISpectralDiagnostic[]

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
    this.spectralMessages = spectralMessages
  }
}

function readSpecFile(filepath: string) {
  const ext = path.extname(filepath)
  const data = fs.readFileSync(filepath, 'utf8')
  if (ext === '.yaml' || ext === '.yml') {
    return yaml.parse(data)
  } else {
    throw new Error('Unsupported file type')
  }
}

function countPossibleErrors(rule: string, path: string) {
  const specString = readSpecFile(path)
  return uncompiledRules[rule].given
    .map(jsonPath => JSONPath({ path: jsonPath, json: specString }).length)
    .reduce((acc, current) => acc + current, 0)
}
