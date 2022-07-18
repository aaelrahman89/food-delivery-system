import { request } from './backend';

class NetworkServiceSingleton {
  request = request;
}

export type NetworkService = NetworkServiceSingleton;
export const networkService = new NetworkServiceSingleton();
