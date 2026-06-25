import type { AppState } from '../types';
import { CF_ASNS, COUNTRY_MAP, CHINESE_TO_CODE_MAP } from '../data/constants';
import { PROVIDERS } from '../data/providers';

// Helper to parse comma/space separated string to unique numbers
const parseNumbers = (str: string): number[] => {
  return Array.from(new Set(
    str.replace(/[,，]/g, ' ').split(/\s+/).map(Number).filter(n => n > 0 && !isNaN(n))
  ));
};

const parseStrings = (str: string): string[] => {
  return Array.from(new Set(
    str.replace(/[,，]/g, ' ').split(/\s+/).filter(s => s.trim().length > 0).map(s => {
      const cleanStr = s.trim();
      // If it's a known Chinese name, map to its 2-letter code
      if (CHINESE_TO_CODE_MAP[cleanStr]) {
        return CHINESE_TO_CODE_MAP[cleanStr];
      }
      return cleanStr.toUpperCase();
    })
  ));
};

export const generateFofaQuery = (state: AppState): string => {
  const parts: string[] = [];

  // Base
  parts.push(`server=="cloudflare"`);

  // Signature
  if (state.signature === '1003') {
    parts.push(`title="Direct IP access not allowed | Cloudflare"`);
  } else {
    parts.push(`header="Forbidden"`);
  }

  // IP/Domain filters
  if (state.ipv4Only) {
    parts.push(`is_ipv6=false`);
  }
  if (state.excludeDomain) {
    parts.push(`is_domain=false`);
  }

  // Time
  if (state.timeWindow !== 'all') {
    const days = parseInt(state.timeWindow, 10);
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateStr = date.toISOString().split('T')[0];
    parts.push(`after="${dateStr}"`);
  }

  // Regions
  const customRegionsParsed = parseStrings(state.customRegions);
  const allRegions = Array.from(new Set([...state.regions, ...customRegionsParsed]));
  if (allRegions.length > 0) {
    const regionQueries = allRegions.map(r => `country=="${r}"`);
    parts.push(`(${regionQueries.join(' || ')})`);
  }

  // Ports
  const customPortsParsed = parseNumbers(state.customPorts);
  const allPorts = Array.from(new Set([...state.ports, ...customPortsParsed]));
  if (allPorts.length > 0) {
    const portQueries = allPorts.map(p => `port=="${p}"`);
    parts.push(`(${portQueries.join(' || ')})`);
  }

  // ASNs
  const selectedProviderAsns: number[] = [];
  state.providers.forEach(pName => {
    const provider = PROVIDERS.find(p => p.name === pName);
    if (provider) {
      selectedProviderAsns.push(...provider.asns);
    }
  });
  
  const customIncludeAsnsParsed = parseNumbers(state.customIncludeAsns);
  const allAsns = Array.from(new Set([...selectedProviderAsns, ...customIncludeAsnsParsed]));
  if (allAsns.length > 0) {
    const asnQueries = allAsns.map(a => `asn=="${a}"`);
    parts.push(`(${asnQueries.join(' || ')})`);
  }

  // Exclude ASNs
  const excludeAsns: number[] = [];
  if (state.excludeOfficial) {
    excludeAsns.push(...CF_ASNS);
  }
  const customExcludeAsns = parseNumbers(state.customAsns);
  excludeAsns.push(...customExcludeAsns);
  
  const uniqueExcludeAsns = Array.from(new Set(excludeAsns));
  if (uniqueExcludeAsns.length > 0) {
    const excludeQueries = uniqueExcludeAsns.map(a => `asn!="${a}"`);
    parts.push(`(${excludeQueries.join(' && ')})`);
  }

  return parts.join(' && ');
};

export const generateCensysQuery = (state: AppState): string => {
  const parts: string[] = [];

  // Services Wrapper
  const serviceParts: string[] = [];
  
  // Base CF filter for Censys Platform
  serviceParts.push(`endpoints.http.headers:(key="Server" and value="cloudflare")`);
  
  if (state.signature === '1003') {
    serviceParts.push(`endpoints.http.body:"Direct IP access not allowed"`);
  } else {
    serviceParts.push(`endpoints.http.status_code=403`);
  }

  const customPortsParsed = parseNumbers(state.customPorts);
  const allPorts = Array.from(new Set([...state.ports, ...customPortsParsed]));
  if (allPorts.length > 0) {
    const portStrings = allPorts.map(p => `"${p}"`);
    serviceParts.push(`port:{${portStrings.join(', ')}}`);
  }

  parts.push(`host.services:(${serviceParts.join(' and ')})`);

  // IPv4 Only
  if (state.ipv4Only) {
    parts.push(`host.ip: "0.0.0.0/0"`);
  }

  // Time
  if (state.timeWindow !== 'all') {
    parts.push(`host.last_updated_at >= "now-${state.timeWindow}d"`);
  }

  // Regions
  const customRegionsParsed = parseStrings(state.customRegions);
  const allRegions = Array.from(new Set([...state.regions, ...customRegionsParsed]));
  if (allRegions.length > 0) {
    const censysRegions: string[] = [];
    allRegions.forEach(fofaCode => {
      // Find censys name using the full mapping
      const censysName = COUNTRY_MAP[fofaCode];
      if (censysName) {
        censysRegions.push(censysName);
      } else {
        // Fallback to raw input if it's completely unknown
        censysRegions.push(fofaCode);
      }
    });
    if (censysRegions.length > 0) {
      const regionQueries = Array.from(new Set(censysRegions)).map(r => `host.location.country_code="${r}"`);
      parts.push(`(${regionQueries.join(' or ')})`);
    }
  }

  // ASNs
  const selectedProviderAsns: number[] = [];
  state.providers.forEach(pName => {
    const provider = PROVIDERS.find(p => p.name === pName);
    if (provider) {
      selectedProviderAsns.push(...provider.asns);
    }
  });
  
  const customIncludeAsnsParsed = parseNumbers(state.customIncludeAsns);
  const allAsns = Array.from(new Set([...selectedProviderAsns, ...customIncludeAsnsParsed]));
  if (allAsns.length > 0) {
    const asnStrings = allAsns.map(a => `"${a}"`);
    parts.push(`host.autonomous_system.asn:{${asnStrings.join(', ')}}`);
  }

  // Exclude ASNs
  const excludeAsns: number[] = [];
  if (state.excludeOfficial) {
    excludeAsns.push(...CF_ASNS);
  }
  const customExcludeAsns = parseNumbers(state.customAsns);
  excludeAsns.push(...customExcludeAsns);
  
  const uniqueExcludeAsns = Array.from(new Set(excludeAsns));
  if (uniqueExcludeAsns.length > 0) {
    const excludeStrings = uniqueExcludeAsns.map(a => `"${a}"`);
    parts.push(`not host.autonomous_system.asn:{${excludeStrings.join(', ')}}`);
  }

  return parts.join(' and ');
};

export const safeFofaBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  return btoa(binString);
};
