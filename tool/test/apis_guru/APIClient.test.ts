import APIClient from '../../src/apis_guru/APIClient'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('APIClient', () => {
  let mock: MockAdapter
  let client: APIClient

  beforeAll(() => {
    mock = new MockAdapter(axios)
    client = new APIClient()
  })

  afterEach(() => {
    mock.reset()
  })

  it('should get providers', async () => {
    const providers = ['provider1', 'provider2']
    mock.onGet('https://api.apis.guru/v2/providers.json').reply(200, providers)

    const response = await client.getProviders()
    expect(response.data).toEqual(providers)
  })

  it('should get provider', async () => {
    const providerData = {
      provider1: { added: '2022-01-01', preferred: 'v1', versions: {} }
    }
    mock
      .onGet('https://api.apis.guru/v2/provider1.json')
      .reply(200, providerData)

    const response = await client.getProvider('provider1')
    expect(response.data).toEqual(providerData)
  })

  it('should get Services', async () => {
    const services = ['service1', 'service2']
    const mockProvider = 'mockProvider'
    mock
      .onGet(`https://api.apis.guru/v2/${mockProvider}/services.json`)
      .reply(200, services)

    const response = await client.getServices(mockProvider)
    expect(response.data).toEqual(services)
  })

  it('should list APIs', async () => {
    const expected = {
      api1: {
        added: '2017-05-30T08:34:14.000Z',
        preferred: '0.0.1',
        versions: {
          '0.0.1': {
            added: '2017-05-30T08:34:14.000Z',
            info: {
              contact: {
                email: 'contact@1example.com',
                name: 'Example',
                url: 'http://example.com'
              },
              description: 'Example Date',
              title: '1Example APIs',
              version: '0.0.1',
              'x-apisguru-categories': ['example'],
              'x-logo': {
                backgroundColor: '#24292e',
                url: 'https://api.apis.guru/v2/cache/logo/https_example.com_assets_images_f-blue.svg'
              },
              'x-origin': [
                {
                  format: 'swagger',
                  url: 'http://example.com/openapi.json',
                  version: '2.0'
                }
              ],
              'x-providerName': 'example.com'
            },
            updated: '2017-06-27T16:49:57.000Z',
            swaggerUrl:
              'https://api.apis.guru/v2/specs/example.com/0.0.1/swagger.json',
            swaggerYamlUrl:
              'https://api.apis.guru/v2/specs/example.com/0.0.1/swagger.yaml',
            openapiVer: '2.0',
            link: 'https://api.apis.guru/v2/specs/example.com/0.0.1.json'
          }
        }
      }
    }
    mock.onGet('https://api.apis.guru/v2/list.json').reply(200, expected)

    const result = await client.listAPIs()
    expect(result.data).toEqual(expected)
  })

  it('should show metrics', async () => {
    const expected = {
      numSpecs: 3992,
      numAPIs: 2529,
      numEndpoints: 108837,
      unreachable: 166,
      invalid: 688,
      unofficial: 25,
      fixes: 84860,
      fixedPct: 23,
      datasets: [
        {
          title: 'providerCount',
          data: {
            'adyen.com': 89,
            'amadeus.com': 32,
            'amazonaws.com': 286,
            'apideck.com': 16,
            'apisetu.gov.in': 181,
            'azure.com': 1829,
            'ebay.com': 20,
            'fungenerators.com': 12,
            'github.com': 21,
            'googleapis.com': 464,
            'hubapi.com': 12,
            'interzoid.com': 20,
            'mastercard.com': 14,
            'microsoft.com': 27,
            'nexmo.com': 20,
            'nytimes.com': 11,
            'parliament.uk': 11,
            'sportsdata.io': 35,
            'twilio.com': 44,
            'vtex.local': 34,
            'windows.net': 10,
            Others: 804
          }
        }
      ],
      stars: 3151,
      issues: 35,
      thisWeek: {
        added: 9,
        updated: 437
      },
      numDrivers: 10,
      numProviders: 677
    }
    mock.onGet('https://api.apis.guru/v2/metrics.json').reply(200, expected)

    const response = await client.getMetrics()
    expect(response.data).toEqual(expected)
  })
})
