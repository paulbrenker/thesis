import APIFetcher from '../../src/apis_guru/apis_guru_controller'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
describe('APIFetcher', () => {
  let controller: APIFetcher
  let mock: MockAdapter

  beforeAll(() => {
    mock = new MockAdapter(axios)
    controller = new APIFetcher()
  })

  afterEach(() => {
    mock.reset
  })

  it('should map apis to all available swagger links', async () => {
    const apiResponse = {
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
              version: '0.0.1'
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
    mock.onGet('https://api.apis.guru/v2/list.json').reply(200, apiResponse)
    const response = await controller.getLinksToYamlSpecs()
    expect(response).toEqual([
      'https://api.apis.guru/v2/specs/example.com/0.0.1/swagger.yaml'
    ])
  })
})
