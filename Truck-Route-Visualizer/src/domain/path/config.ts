import type { RouteStop } from '../simulation/types';
export const ROUTE_STOPS: RouteStop[] = [
  { id: 'ORIGIN', label: 'Origin', progressThreshold: 0.0 },
  { id: 'D1', label: 'Delivery Point D1', progressThreshold: 0.33 },
  { id: 'D2', label: 'Delivery Point D2', progressThreshold: 0.66 },
  { id: 'D3', label: 'Final Destination D3', progressThreshold: 1.0 },
];
export const TOTAL_ROUTE_DISTANCE_KM = 7.8;
export const SIMULATED_BASE_SPEED_KM_MS = 7.8 / 10000; 
