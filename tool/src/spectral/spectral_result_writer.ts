import * as fs from 'fs'
import * as path from 'path'

class SpectralCsvWriter {
  private filePath: string
  private stream: fs.WriteStream

  constructor(fileName: string, headers: string[], directory?: string) {
    const dir = directory || '.'
    this.filePath = path.join(dir, fileName)
    this.stream = fs.createWriteStream(this.filePath, { flags: 'a' })

    if (fs.statSync(this.filePath).size === 0) {
      this.writeLine(headers)
    }
  }

  writeLine(data: string[]): void {
    const line = data.join(';') + '\n'
    this.stream.write(line)
  }

  close(): void {
    this.stream.end()
  }
}

export default SpectralCsvWriter
