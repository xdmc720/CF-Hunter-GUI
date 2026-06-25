import type { AppState, Engine } from '../types';

export type AppAction =
  | { type: 'SET_ENGINE'; payload: Engine }
  | { type: 'TOGGLE_REGION'; payload: string }
  | { type: 'TOGGLE_REGION_GROUP'; payload: { regions: string[], selected: boolean } }
  | { type: 'SET_CUSTOM_REGIONS'; payload: string }
  | { type: 'TOGGLE_PROVIDER'; payload: string }
  | { type: 'SET_CUSTOM_INCLUDE_ASNS'; payload: string }
  | { type: 'TOGGLE_PORT'; payload: number }
  | { type: 'TOGGLE_PORT_GROUP'; payload: { ports: number[], selected: boolean } }
  | { type: 'CLEAR_PORTS' }
  | { type: 'SET_CUSTOM_PORTS'; payload: string }
  | { type: 'SET_CUSTOM_ASNS'; payload: string }
  | { type: 'SET_SIGNATURE'; payload: '1003' | '403' }
  | { type: 'TOGGLE_IPV4_ONLY' }
  | { type: 'TOGGLE_EXCLUDE_DOMAIN' }
  | { type: 'TOGGLE_EXCLUDE_OFFICIAL' }
  | { type: 'SET_TIME_WINDOW'; payload: '1' | '7' | '30' | 'all' }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET' };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ENGINE':
      return { 
        ...state, 
        engine: action.payload,
        // Disable excludeDomain if switching to censys
        excludeDomain: action.payload === 'censys' ? false : state.excludeDomain 
      };
    case 'TOGGLE_REGION':
      return {
        ...state,
        regions: state.regions.includes(action.payload)
          ? state.regions.filter(r => r !== action.payload)
          : [...state.regions, action.payload]
      };
    case 'TOGGLE_REGION_GROUP': {
      const { regions, selected } = action.payload;
      const newRegions = new Set(state.regions);
      if (selected) {
        regions.forEach(r => newRegions.add(r));
      } else {
        regions.forEach(r => newRegions.delete(r));
      }
      return { ...state, regions: Array.from(newRegions) };
    }
    case 'SET_CUSTOM_REGIONS':
      return { ...state, customRegions: action.payload };
    case 'TOGGLE_PROVIDER':
      return {
        ...state,
        providers: state.providers.includes(action.payload)
          ? state.providers.filter(p => p !== action.payload)
          : [...state.providers, action.payload]
      };
    case 'SET_CUSTOM_INCLUDE_ASNS':
      return { ...state, customIncludeAsns: action.payload };
    case 'TOGGLE_PORT':
      return {
        ...state,
        ports: state.ports.includes(action.payload)
          ? state.ports.filter(p => p !== action.payload)
          : [...state.ports, action.payload]
      };
    case 'TOGGLE_PORT_GROUP': {
      const { ports, selected } = action.payload;
      const newPorts = new Set(state.ports);
      if (selected) {
        ports.forEach(p => newPorts.add(p));
      } else {
        ports.forEach(p => newPorts.delete(p));
      }
      return { ...state, ports: Array.from(newPorts) };
    }
    case 'CLEAR_PORTS':
      return { ...state, ports: [], customPorts: '' };
    case 'SET_CUSTOM_PORTS':
      return { ...state, customPorts: action.payload };
    case 'SET_CUSTOM_ASNS':
      return { ...state, customAsns: action.payload };
    case 'SET_SIGNATURE':
      return { ...state, signature: action.payload };
    case 'TOGGLE_IPV4_ONLY':
      return { ...state, ipv4Only: !state.ipv4Only };
    case 'TOGGLE_EXCLUDE_DOMAIN':
      return { ...state, excludeDomain: !state.excludeDomain };
    case 'TOGGLE_EXCLUDE_OFFICIAL':
      return { ...state, excludeOfficial: !state.excludeOfficial };
    case 'SET_TIME_WINDOW':
      return { ...state, timeWindow: action.payload };
    case 'LOAD_STATE':
      return { ...action.payload };
    case 'RESET':
      return { ...state }; // We will implement full reset via state override if needed
    default:
      return state;
  }
};
