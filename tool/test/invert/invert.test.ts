import { readSpecFile, countPossibleErrors } from '../../src/invert/invert'
import * as fs from 'fs'

jest.mock('fs')

describe('readSpecFile', () => {
  it('should read a YAML file and parse it correctly', () => {
    const mockFilePath = 'example/path.yaml'
    const mockFileContent = 'example: yaml'
    ;(fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent)

    const result = readSpecFile(mockFilePath)

    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8')
    expect(result).toEqual({ example: 'yaml' })
  })

  it('should throw an error for unsupported file types', () => {
    const mockFilePath = 'example/path.txt'
    ;(fs.readFileSync as jest.Mock).mockReturnValue('unsupported content')

    expect(() => readSpecFile(mockFilePath)).toThrow('Unsupported file type')
  })
})

describe('countPossibleErrors', () => {
  it('should successfully count json path selectors', () => {
    const mockFilePath = 'example/path.yaml'
    const mockFileContent = 'example: yaml'
    ;(fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent)

    const result = countPossibleErrors('operation-tag-defined', mockFilePath)

    expect(result).toBe(1)
  })
})
