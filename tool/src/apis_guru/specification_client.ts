import axios from 'axios'

class SwaggerClient {
  async getSwaggerSpec(url: string): Promise<string> {
    if (!(url.endsWith('.yaml') || url.endsWith('.yml'))) {
      throw new Error('OpenAPI url has no yaml file extension')
    }
    const response = await axios.get(url)
    return response.data
  }
}

export default SwaggerClient
