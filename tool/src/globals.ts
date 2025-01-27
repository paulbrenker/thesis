class Globals {
  static data = '../data'

  static openapiDir = `${Globals.data}/openapi-directory/APIs`

  static linterResults = `${Globals.data}/linter-results`

  /*
   manually determined OpenAPI Specifications that jamm the linter.
   Linter returns no Promise.resolve even after more than 20 min.
   Length of Sets does not justify this
  */
  static unlintableSpecs = [
    '../data/openapi-directory/APIs/beezup.com/2.0/openapi.yaml',
    '../data/openapi-directory/APIs/microsoft.com/graph-beta/1.0.1/openapi.yaml'
  ]
}

export default Globals
