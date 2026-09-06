import { ROUTE_STOPS, TOTAL_ROUTE_DISTANCE_KM } from '../domain/path/config';
export interface ShipmentDetails {
  id: string;
  driverName: string;
  vehicle: string;
  status: string;
  totalDistanceKm: number;
  stops: typeof ROUTE_STOPS;
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const routeService = {
  async getShipmentDetails(): Promise<ShipmentDetails> {
    await delay(800);
    return {
      id: 'FF-TRK-2026-0142',
      driverName: 'Alex Morgan',
      vehicle: 'MH 12 AB 4567',
      status: 'In Transit',
      totalDistanceKm: TOTAL_ROUTE_DISTANCE_KM,
      stops: ROUTE_STOPS
    };
  }
};
