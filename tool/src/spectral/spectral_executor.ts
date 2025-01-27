import {
  Spectral,
  ISpectralDiagnostic,
  RulesetDefinition
} from '@stoplight/spectral-core'
import { httpAndFileResolver } from '@stoplight/spectral-ref-resolver'
import { oas } from '@stoplight/spectral-rulesets'
import { promises as fs } from 'fs'

class SpectralExecutor {
  private spectralRunner = new Spectral({ resolver: httpAndFileResolver })
  private counter: number

  constructor() {
    this.counter = 0
  }

  async getSpectralMessages(path: string): Promise<ISpectralDiagnostic[]> {
    this.spectralRunner.setRuleset(oas as RulesetDefinition)

    const oasAsString = await fs.readFile(path, 'utf8')
    const messages = this.spectralRunner.run(oasAsString)

    return messages
  }
}

export default SpectralExecutor
