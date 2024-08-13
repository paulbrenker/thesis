import SwaggerClient from '../../src/apis_guru/specification_client'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Enforcer from 'openapi-enforcer'
import * as yaml from 'js-yaml'

jest.mock('openapi-enforcer')
jest.mock('js-yaml')

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

  it('validates that the OpenAPI spec is correct', async () => {
    const mockEnforcer = Enforcer as jest.Mocked<typeof Enforcer>
    const mockYaml = yaml as jest.Mocked<typeof yaml>

    const openApiSpec = 'openapi: 3.0.0'
    mockEnforcer.mockResolvedValue([{}, undefined])
    mockYaml.load.mockReturnValue({})

    const result = await client.isValidOpenApiSpec(openApiSpec)

    expect(mockYaml.load).toHaveBeenCalledWith(openApiSpec)
    expect(result).toBe(true)
  })

  it('returns false when OpenAPI spec is not valid', async () => {
    const mockEnforcer = Enforcer as jest.Mocked<typeof Enforcer>
    const mockYaml = yaml as jest.Mocked<typeof yaml>

    const openApiSpec = 'not a valid yaml'
    mockEnforcer.mockResolvedValue([{}, Error('could not read OpenAPI')])
    mockYaml.load.mockReturnValue({})

    const result = await client.isValidOpenApiSpec(openApiSpec)
    expect(mockYaml.load).toHaveBeenCalledWith(openApiSpec)
    expect(result).toBe(false)
  })

  it('should return false if yaml.load throws an error', async () => {
    const MockedYaml = yaml as jest.Mocked<typeof yaml>
    MockedYaml.load.mockImplementation(() => {
      throw new Error('Failed to parse YAML')
    })

    const openApiSpec = 'not a valid yaml'

    const result = await client.isValidOpenApiSpec(openApiSpec)
    expect(result).toBe(false)
  })
})
