import { oas } from '@stoplight/spectral-rulesets'
import SpecificationClient from './apisguru/apisguru_client'
import SpectralExecutor from './spectral/spectral_executor'
import { SpectralResultHandler } from './spectral/spectral_result_handler'
import SpectralCsvWriter from './spectral/spectral_result_writer'
import * as path from 'path'
import * as fs from 'fs'

async function main() {
  const client = new SpecificationClient()
  const paths = client.getSpecificationPaths()

  const rules = Object.keys(oas.rules)
  const firstLine = ['specs', ...rules]

  const runner = new SpectralExecutor()
  const handler = new SpectralResultHandler()

  const directory = path.join('../data/linter-results')

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }
  const writer = new SpectralCsvWriter('2024-08-25.csv', directory)
  await writer.init(firstLine)

  await Promise.all(
    paths.map(
      async path =>
        await writer.writeLine([
          path,
          ...handler.handleResults(
            await runner.getSpectralMessages(path),
            rules
          )
        ])
    )
  )
  await writer.close()
}

export default main

main()
