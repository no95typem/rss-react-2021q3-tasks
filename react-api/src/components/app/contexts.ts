import * as React from 'react';

export interface SecretContext {
  apiKey?: string;
  updateApiKey?: (newApiKey?: string) => unknown;
}

export const SECRET_CONTEXT = React.createContext<SecretContext>(null!);

export interface LoadersContext {
  loadImg: (src: string) => Promise<boolean>;
}

export const LOADERS_CONTEXT = React.createContext<LoadersContext>(null!);
