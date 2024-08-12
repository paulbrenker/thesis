import APIClient from './apis_guru_client'

class APIFetcher {
  private client = new APIClient()

  async getLinksToYamlSpecs(): Promise<string[]> {
    const apiList = await this.client.listAPIs()
    return Object.values(apiList.data).flatMap(api =>
      Object.values(api.versions).flatMap(version => version.swaggerYamlUrl)
    )
  }
}

export default APIFetcher
