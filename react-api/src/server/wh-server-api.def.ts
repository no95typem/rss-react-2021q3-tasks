/* eslint-disable max-classes-per-file */

import { ProxyReqCodes } from '../shared/proxy.def';

export interface ProxyReq {
  readonly code: number;
}

export class WHWpInfoProxyReq implements ProxyReq {
  readonly code: ProxyReqCodes.WHWpInfo;

  constructor(readonly id: string, readonly apiKey?: string) {}
}

export class WHSearchProxyReq implements ProxyReq {
  readonly code: ProxyReqCodes.WHSearch;

  constructor(readonly fetchStr: string) {}
}
