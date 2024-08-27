class Globals {
  static data = '../data'

  static openapiDir = `${Globals.data}/openapi-directory/APIs`

  static linterResults = `${Globals.data}/linter-results`

  static unlintableSpecs = [
    '../data/openapi-directory/APIs/beezup.com/2.0/openapi.yaml',
    '../data/openapi-directory/APIs/microsoft.com/graph-beta/1.0.1/openapi.yaml'
  ]
}

export default Globals
