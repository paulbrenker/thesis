import SpecificationClient from '../../src/apisguru/apisguru_client'
import Globals from '../../src/globals'

describe('Specification Client', () => {
  let specClient: SpecificationClient

  beforeEach(() => {
    specClient = new SpecificationClient()
  })

  it('should throw when path is missleading', () => {
    const nonExistingDirPath = 'README.md'
    Globals.openapiDir = nonExistingDirPath

    expect(() => {
      specClient.getSpecificationPaths()
    }).toThrow()
  })
})
