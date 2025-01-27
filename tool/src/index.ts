import { oas } from '@stoplight/spectral-rulesets'
import SpecificationClient from './apisguru/apisguru_client'
import SpectralExecutor from './spectral/spectral_executor'
import { SpectralResultHandler } from './spectral/spectral_result_handler'
import SpectralCsvWriter from './spectral/spectral_result_writer'
import * as Progress from 'ts-progress'
import { execSync } from 'child_process'
import Globals from './globals'
import { invert } from './invert/invert'

async function main() {
  const client = new SpecificationClient()
  const paths = client.getSpecificationPaths()

  const rules = Object.keys(oas.rules)
  const firstLine = ['specs', ...rules]

  const runner = new SpectralExecutor()
  const handler = new SpectralResultHandler()

  const directory = Globals.linterResults

  const gitCommitHash = execSync('git rev-parse HEAD').toString().trim()
  const currentDate = new Date().toISOString().slice(0, 10)

  const fileName = `${currentDate}@${gitCommitHash}.csv`

  const writer = new SpectralCsvWriter(fileName, directory)
  await writer.init(firstLine)

  const bar = Progress.create({
    total: paths.length,
    pattern:
      'Progress: {bar}\
      | Elapsed: {elapsed.red}, Remaining: {remaining.green}\
      | Memory: {memory.yellow}\
      | Linting Spec No.: {current}/{total},  {percent.magenta}'
  })

  await Promise.all(
    paths
      .filter(path => !Globals.unlintableSpecs.includes(path))
      .map(async path => {
        const spectralMessages = await runner.getSpectralMessages(path)
        const invertedMessages = invert(spectralMessages, path)
        bar.update()
        await writer.writeLine([
          path,
          ...handler.handleResults(invertedMessages)
        ])
      })
  )

  bar.done()
  await writer.close()
}

main()

export default main
