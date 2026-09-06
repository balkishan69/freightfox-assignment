import { describe, it, expect } from 'vitest';
import { calculateETA, getDistanceCovered, getRemainingDistance, getStopState, getCurrentLocationLabel } from './eta';
import { TOTAL_ROUTE_DISTANCE_KM } from '../path/config';
describe('ETA and Distance Utils', () => {
  it('calculates distance correctly', () => {
    expect(getDistanceCovered(0.5)).toBeCloseTo(TOTAL_ROUTE_DISTANCE_KM / 2);
    expect(getRemainingDistance(0.5)).toBeCloseTo(TOTAL_ROUTE_DISTANCE_KM / 2);
    expect(getDistanceCovered(1.0)).toBe(TOTAL_ROUTE_DISTANCE_KM);
    expect(getRemainingDistance(1.0)).toBe(0);
  });
  it('determines stop states based on config thresholds', () => {
    const startState = getStopState(0.0);
    expect(startState.completedStops.length).toBe(1);
    expect(startState.completedStops[0].id).toBe('ORIGIN');
    expect(startState.nextStop?.id).toBe('D1');
    const midState = getStopState(0.5);
    expect(midState.completedStops.length).toBe(2);
    expect(midState.nextStop?.id).toBe('D2');
    const endState = getStopState(1.0);
    expect(endState.completedStops.length).toBe(4);
    expect(endState.nextStop).toBeNull();
  });
  it('generates appropriate location labels', () => {
    expect(getCurrentLocationLabel(0)).toBe('At Origin');
    expect(getCurrentLocationLabel(0.15)).toBe('En route to Delivery Point D1');
    expect(getCurrentLocationLabel(1.0)).toBe('Delivered at Final Destination D3');
  });
  it('calculates ETA appropriately', () => {
    expect(calculateETA(1.0, 1, 'COMPLETED')).toBe('Delivered');
    expect(calculateETA(0, 1, 'IDLE')).toBe('--');
    const eta1x = calculateETA(0.5, 1, 'RUNNING');
    expect(eta1x).toBe('1h 0m'); 
    const eta2x = calculateETA(0.5, 2, 'RUNNING');
    expect(eta2x).toBe('30 min'); 
  });
});
