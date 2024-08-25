import SpectralExecutor from '../../src/spectral/spectral_executor'
import { promises as fs } from 'fs'

describe('SpectralExecutor', () => {
  let spectralExecutor: SpectralExecutor
  let readFileMock: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    readFileMock = jest.spyOn(fs, 'readFile').mockImplementation()
    spectralExecutor = new SpectralExecutor()
  })

  it('should lint an existing Specification usung the Spectral OAS Ruleset', async () => {
    const mockPath = 'non/existing/path.yaml'

    const mockOpenAPI = {
      openapi: '3.0.1'
    }

    readFileMock.mockImplementation(async () => Promise.resolve(mockOpenAPI))

    const result = await spectralExecutor.getSpectralMessages(mockPath)

    expect(result).toHaveLength(5)
    expect(result.map(diagnostic => diagnostic.code)).toEqual([
      'info-contact',
      'info-description',
      'oas3-api-servers',
      'oas3-schema',
      'oas3-schema'
    ])
  })
})
