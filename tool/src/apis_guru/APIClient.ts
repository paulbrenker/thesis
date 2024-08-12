import axios, { AxiosResponse } from 'axios'

interface API {
  added: string
  preferred: string
  versions: Record<string, unknown>
}

interface Metrics {
  numSpecs: number
  numAPIs: number
  numEndpoints: number
  unreachable?: number
  invalid?: number
  unofficial?: number
  fixes?: number
  fixedPct?: number
  datasets?: unknown[]
  stars?: number
  issues?: number
  thisWeek?: {
    added: number
    updated: number
  }
  numDrivers?: number
  numProviders?: number
}

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = 'https://api.apis.guru/v2'
  }

  async getProviders(): Promise<AxiosResponse<string[]>> {
    return axios.get(`${this.baseURL}/providers.json`)
  }

  async getProvider(
    provider: string
  ): Promise<AxiosResponse<Record<string, API>>> {
    return axios.get(`${this.baseURL}/${provider}.json`)
  }

  async getServices(provider: string): Promise<AxiosResponse<string[]>> {
    return axios.get(`${this.baseURL}/${provider}/services.json`)
  }

  async listAPIs(): Promise<AxiosResponse<Record<string, API>>> {
    return axios.get(`${this.baseURL}/list.json`)
  }

  async getMetrics(): Promise<AxiosResponse<Metrics>> {
    return axios.get(`${this.baseURL}/metrics.json`)
  }
}

export default APIClient
