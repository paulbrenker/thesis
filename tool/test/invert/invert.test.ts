import { readSpecFile } from '../../src/invert/invert' // Replace with the actual path
import * as fs from 'fs'

jest.mock('fs')

describe('readSpecFile', () => {
  it('should read a YAML file and parse it correctly', () => {
    // Arrange
    const mockFilePath = 'example/path.yaml'
    const mockFileContent = 'example: yaml'
    ;(fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent)

    // Act
    const result = readSpecFile(mockFilePath)

    // Assert
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8')
    expect(result).toEqual({ example: 'yaml' })
  })

  it('should throw an error for unsupported file types', () => {
    // Arrange
    const mockFilePath = 'example/path.txt'
    ;(fs.readFileSync as jest.Mock).mockReturnValue('unsupported content')

    // Act & Assert
    expect(() => readSpecFile(mockFilePath)).toThrow('Unsupported file type')
  })
})
