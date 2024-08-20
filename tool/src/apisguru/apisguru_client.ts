import * as fs from 'fs'
import * as path from 'path'
import Globals from './globals'

class SpecificationClient {
  getSpecificationPaths(): Array<string> {
    return this.getAllFiles(Globals.openapiDir)
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath)

    files.forEach(file => {
      const filePath = path.join(dirPath, file)

      if (fs.statSync(filePath).isDirectory()) {
        this.getAllFiles(filePath, arrayOfFiles)
      } else {
        arrayOfFiles.push(filePath)
      }
    })

    return arrayOfFiles
  }
}

export default SpecificationClient
