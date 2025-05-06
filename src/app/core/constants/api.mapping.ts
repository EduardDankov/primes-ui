export enum Mappings {
  BASE_URL = '/api',
  LOGIN = '/v1/login'
}

export function getUrl(mapping: Mappings): string {
  return `${Mappings.BASE_URL}${mapping}`;
}
