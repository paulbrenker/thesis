import {
  Spectral,
  ISpectralDiagnostic,
  RulesetDefinition
} from '@stoplight/spectral-core'
import { httpAndFileResolver } from '@stoplight/spectral-ref-resolver'
import ruleset from './ruleset'
import { promises as fs } from 'fs'

class SpectralExecutor {
  private spectralRunner = new Spectral({ resolver: httpAndFileResolver })

  async getSpectralMessages(path: string): Promise<ISpectralDiagnostic[]> {
    this.spectralRunner.setRuleset(ruleset as RulesetDefinition)

    const oasAsString = await fs.readFile(path, 'utf8')
    const messages = this.spectralRunner.run(oasAsString)

    return messages
  }
}

export default SpectralExecutor
