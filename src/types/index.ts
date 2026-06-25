export type Engine = 'fofa' | 'censys';

export interface AppState {
  engine: Engine;
  regions: string[]; // e.g. 'CN', 'HK'
  customRegions: string; // user input regions
  providers: string[]; // e.g. 'DMIT'
  customIncludeAsns: string; // user input ASNs to include
  customAsns: string; // comma/space separated
  ports: number[];
  customPorts: string; // comma/space separated
  signature: '1003' | '403';
  ipv4Only: boolean;
  excludeDomain: boolean;
  excludeOfficial: boolean;
  timeWindow: '1' | '7' | '30' | 'all';
}

export const defaultState: AppState = {
  engine: 'fofa',
  regions: [],
  customRegions: '',
  providers: [],
  customIncludeAsns: '',
  customAsns: '',
  ports: [443],
  customPorts: '',
  signature: '403',
  ipv4Only: false,
  excludeDomain: false,
  excludeOfficial: false,
  timeWindow: 'all'
};
