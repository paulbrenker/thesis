import axios from 'axios'
import Enforcer from 'openapi-enforcer'
import * as yaml from 'js-yaml'

class SwaggerClient {
  async getSwaggerSpec(url: string): Promise<string> {
    const response = await axios.get(url)
    return response.data
  }

  async isValidOpenApiSpec(yamlString: string): Promise<boolean> {
    try {
      const openApiObject = yaml.load(yamlString)

      const [, error] = await Enforcer(openApiObject)

      return error === undefined
    } catch {
      return false
    }
  }
}

export default SwaggerClient
