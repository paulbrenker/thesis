import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

class SpectralCsvWriter {
  private filePath: string
  public stream: fs.WriteStream
  private isReady = false

  constructor(fileName: string, directory?: string) {
    const dir = directory || '.'
    this.filePath = path.join(dir, fileName)
    this.stream = fs.createWriteStream(this.filePath, { flags: 'a' })
  }

  async init(headers: string[]): Promise<void> {
    await this.waitForStreamOpen()

    const fileStat = await this.getFileStats()
    if (fileStat.size === 0) {
      await this.writeLine(headers)
    }
    this.isReady = true
  }

  private waitForStreamOpen(): Promise<void> {
    return new Promise(resolve => {
      this.stream.once('open', () => resolve())
    })
  }

  private getFileStats(): Promise<fs.Stats> {
    const stat = promisify(fs.stat)
    return stat(this.filePath)
  }

  async writeLine(data: string[]): Promise<void> {
    const line = data.join(';') + '\n'
    await this.writeToFile(line)
  }

  private async writeToFile(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stream.write(data, err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stream.end(() => resolve())
      this.stream.on('error', err => reject(err))
    })
  }

  isFileReady(): boolean {
    return this.isReady
  }
}

export default SpectralCsvWriter
