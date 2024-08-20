import SpecificationClient from '../../src/apisguru/apisguru_client'
import * as fs from 'fs'
import * as path from 'path'
import Globals from '../../src/apisguru/globals'

jest.mock('fs')
jest.mock('path')

describe('Specification Client', () => {
  let specClient: SpecificationClient

  beforeEach(() => {
    specClient = new SpecificationClient()
  })

  it('should return all file paths from the directory and its subdirectories', () => {
    const mockDirPath = '/mock-directory'
    const mockFiles = ['file1.txt', 'subdir']
    const mockSubFiles = ['file2.txt']

    ;(fs.readdirSync as jest.Mock).mockImplementation((dirPath: string) => {
      if (dirPath === mockDirPath) return mockFiles
      if (dirPath === path.join(mockDirPath, 'subdir')) return mockSubFiles
      return []
    })
    ;(fs.statSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === path.join(mockDirPath, 'subdir')) {
        return { isDirectory: () => true }
      }
      return { isDirectory: () => false }
    })
    ;(path.join as jest.Mock).mockImplementation((...args: string[]) =>
      args.join('/')
    )

    Globals.openapiDir = mockDirPath

    const result = specClient.getSpecificationPaths()

    expect(result).toEqual([
      '/mock-directory/file1.txt',
      '/mock-directory/subdir/file2.txt'
    ])
  })

  it('should return an empty array if the directory is empty', () => {
    const mockDirPath = '/empty-directory'

    ;(fs.readdirSync as jest.Mock).mockReturnValue([])
    Globals.openapiDir = mockDirPath

    const result = specClient.getSpecificationPaths()

    expect(result).toEqual([])
  })

  it('should throw when path is not available', () => {
    const nonExistingDirPath = '/non-existant'
    Globals.openapiDir = nonExistingDirPath

    expect(() => {
      specClient.getSpecificationPaths()
    }).toThrow("Cannot read properties of undefined (reading 'forEach')")
  })
})
