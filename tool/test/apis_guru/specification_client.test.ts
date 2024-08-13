import SwaggerClient from '../../src/apis_guru/specification_client'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('SwaggerClient', () => {
  let client: SwaggerClient
  let mockAxios: MockAdapter

  beforeAll(() => {
    mockAxios = new MockAdapter(axios)
    client = new SwaggerClient()
  })
  afterEach(() => {
    mockAxios.reset
  })

  it.each([
    ['https://example.com/path/to/swagger1.yaml', 400],
    ['https://example.com/path/to/swagger2.yaml', 403],
    ['https://example.com/path/to/swagger3.yaml', 404]
  ])(
    '%s should throw an error with %s status code',
    async (url, expectedResponseCode) => {
      mockAxios.onGet(url).reply(expectedResponseCode)

      await expect(client.getSwaggerSpec(url)).rejects.toThrow(
        `Request failed with status code ${expectedResponseCode}`
      )
    }
  )

  it('should fetch a specification successfully', async () => {
    const openapiLink = 'https://example.com/v2/openapi.yaml'
    const openApiYaml = `
openapi: "3.0.0"
info:
  version: "1.0.0"
  title: "Simple API"
paths:
  /hello:
    get:
      responses:
        '200':
          description: "Successful operation"
          content: 
            application/json:
              schema:
                type: "object"
                properties:
                  message:
                    type: "string"

`.trim()
    mockAxios.onGet(openapiLink).reply(200, openApiYaml)

    const response = await client.getSwaggerSpec(openapiLink)
    expect(response).toEqual(openApiYaml)
  })

  it('should throw when called without .yaml extension', () => {
    expect(client.getSwaggerSpec('https://example.com')).rejects.toThrow(
      'OpenAPI url has no yaml file extension'
    )
  })
})
