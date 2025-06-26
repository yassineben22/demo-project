export interface Environment {
  baseUrl: string;
  production: boolean;
}

const development: Environment = {
  baseUrl: 'http://localhost:8080', 
  production: false,
};

const production: Environment = {
  baseUrl: 'http://localhost:8080',
  production: true,
};

const getEnvironment = (): Environment => {
  if (import.meta.env.PROD) {
    return production;
  }
  return development;
};

export const environment = getEnvironment();
