export enum Mappings {
  BASE_URL = '/api',
  LOGIN = '/v1/login',
  USER_CREATE = '/v1/user',
  USER_GET_ALL = '/v1/user',
  USER_GET = '/v1/user/{id}',
  USER_UPDATE = '/v1/user/{id}',
  USER_DELETE = '/v1/user/{id}'
}

export function getUrl(mapping: Mappings, params: Array<string | number> = []): string {
  let url = `${Mappings.BASE_URL}${mapping}`;
  const placeholders = url.match(/\{[^}]+\}/g); // Find all placeholders like {id}

  if (placeholders && placeholders.length > 0) {
    if (placeholders.length !== params.length) {
      console.error(`Mismatch between placeholder count (${placeholders.length}) and parameter count (${params.length}) for mapping: ${mapping}`);
      // Depending on your needs, you might want to throw an error or handle this differently
      return url; // Return the URL without replacement if counts don't match
    }

    // Replace placeholders with provided parameters in order
    for (let i = 0; i < placeholders.length; i++) {
      // Basic replacement - assumes parameters are in the same order as placeholders
      // For more complex scenarios with named placeholders, you'd need a different approach
      url = url.replace(placeholders[i], String(params[i]));
    }
  }

  return url;
}
