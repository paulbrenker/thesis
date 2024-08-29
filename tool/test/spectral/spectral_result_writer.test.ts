import * as fs from 'fs'
import * as path from 'path'
import SpectralCsvWriter from '../../src/spectral/spectral_result_writer'

describe('SpectralCsvWriter', () => {
  const testDir = path.join(__dirname, 'test_output')
  const testFileName = 'test.csv'
  const testFilePath = path.join(testDir, testFileName)
  const headers = ['specs', 'rule-1', 'rule-1']

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir)
    }
  })

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath)
    }
  })

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir)
    }
  })

  it('should create a file and write headers if the file is empty', async () => {
    const writer = new SpectralCsvWriter(testFileName, testDir)
    await writer.init(headers)

    const fileExists = fs.existsSync(testFilePath)
    expect(fileExists).toBeTruthy()

    const fileContent = fs.readFileSync(testFilePath, 'utf8')
    expect(fileContent.trim()).toBe(headers.join(';'))

    await writer.close()
  })

  it('should write data to the file', async () => {
    const writer = new SpectralCsvWriter(testFileName, testDir)
    await writer.init(headers)

    const data = ['provider', 'violation', 'undefined']
    await writer.writeLine(data)

    const fileContent = fs.readFileSync(testFilePath, 'utf8')
    const lines = fileContent.trim().split('\n')

    expect(lines.length).toBe(2)
    expect(lines[0]).toBe(headers.join(';'))
    expect(lines[1]).toBe(data.join(';'))

    await writer.close()
  })

  it('should append data to an existing file', async () => {
    const writer = new SpectralCsvWriter(testFileName, testDir)
    await writer.init(headers)

    const data1 = ['provider-1', 'violation', 'undefined']
    const data2 = ['provider-2', 'violation', 'undefined']

    await writer.writeLine(data1)
    await writer.writeLine(data2)

    const fileContent = fs.readFileSync(testFilePath, 'utf8')
    const lines = fileContent.trim().split('\n')

    expect(lines.length).toBe(3)
    expect(lines[0]).toBe(headers.join(';'))
    expect(lines[1]).toBe(data1.join(';'))
    expect(lines[2]).toBe(data2.join(';'))

    await writer.close()
  })

  it('should indicate when the file is ready', async () => {
    const writer = new SpectralCsvWriter(testFileName, testDir)
    expect(writer.isFileReady()).toBeFalsy()

    await writer.init(headers)

    expect(writer.isFileReady()).toBeTruthy()

    await writer.close()
  })

  it('should close the file properly', async () => {
    const writer = new SpectralCsvWriter(testFileName, testDir)
    await writer.init(headers)
    await writer.writeLine(['John Doe', '30', 'New York'])

    await writer.close()

    expect(writer.stream.writableEnded).toBeTruthy()
  })
})
