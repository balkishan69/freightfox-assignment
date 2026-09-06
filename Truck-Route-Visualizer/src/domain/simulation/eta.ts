import { ROUTE_STOPS, TOTAL_ROUTE_DISTANCE_KM, SIMULATED_BASE_SPEED_KM_MS } from '../path/config';
import type { RouteStop, SimulationStatus } from './types';
export function getDistanceCovered(progress: number): number {
  return progress * TOTAL_ROUTE_DISTANCE_KM;
}
export function getRemainingDistance(progress: number): number {
  return TOTAL_ROUTE_DISTANCE_KM - getDistanceCovered(progress);
}
export function calculateETA(progress: number, speedMultiplier: number, status: SimulationStatus): string {
  if (status === 'COMPLETED') return 'Delivered';
  if (status === 'IDLE' && progress === 0) return '--';
  const currentSpeed = SIMULATED_BASE_SPEED_KM_MS * speedMultiplier;
  if (currentSpeed <= 0) return '--';
  const totalRealTimeMinutes = 120; 
  const remainingRealTime = Math.ceil((1 - progress) * totalRealTimeMinutes / speedMultiplier);
  if (remainingRealTime <= 0) return 'Arriving soon';
  if (remainingRealTime >= 60) {
    const hours = Math.floor(remainingRealTime / 60);
    const mins = remainingRealTime % 60;
    return `${hours}h ${mins}m`;
  }
  return `${remainingRealTime} min`;
}
export function getStopState(progress: number) {
  const completedStops: RouteStop[] = [];
  let currentStop: RouteStop | null = null;
  let nextStop: RouteStop | null = null;
  for (let i = 0; i < ROUTE_STOPS.length; i++) {
    const stop = ROUTE_STOPS[i];
    if (progress >= stop.progressThreshold) {
      completedStops.push(stop);
      currentStop = stop;
    } else {
      if (!nextStop) {
        nextStop = stop;
      }
    }
  }
  if (progress >= 1.0) {
    nextStop = null;
  }
  return {
    completedStops,
    currentStop,
    nextStop
  };
}
export function getCurrentLocationLabel(progress: number): string {
  const { currentStop, nextStop } = getStopState(progress);
  if (progress >= 1.0) {
    return `Delivered at ${currentStop?.label}`;
  }
  if (progress === 0) {
    return `At ${currentStop?.label}`;
  }
  if (currentStop && Math.abs(progress - currentStop.progressThreshold) < 0.01) {
     return `At ${currentStop.label}`;
  }
  return nextStop ? `En route to ${nextStop.label}` : 'En route';
}
