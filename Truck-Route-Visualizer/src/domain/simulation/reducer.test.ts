import { describe, it, expect } from 'vitest';
import { simulationReducer, INITIAL_STATE } from './reducer';
import type { SimulationState } from './types';
import { SIMULATED_BASE_SPEED_KM_MS, TOTAL_ROUTE_DISTANCE_KM } from '../path/config';
describe('simulationReducer', () => {
  it('should transition from IDLE to RUNNING on START', () => {
    const newState = simulationReducer(INITIAL_STATE, { type: 'START' });
    expect(newState.status).toBe('RUNNING');
  });
  it('should ignore PAUSE when IDLE', () => {
    const newState = simulationReducer(INITIAL_STATE, { type: 'PAUSE' });
    expect(newState.status).toBe('IDLE');
  });
  it('should transition to PAUSED from RUNNING on PAUSE', () => {
    const runningState: SimulationState = { ...INITIAL_STATE, status: 'RUNNING' };
    const newState = simulationReducer(runningState, { type: 'PAUSE' });
    expect(newState.status).toBe('PAUSED');
  });
  it('should RESUME from PAUSED', () => {
    const pausedState: SimulationState = { ...INITIAL_STATE, status: 'PAUSED' };
    const newState = simulationReducer(pausedState, { type: 'RESUME' });
    expect(newState.status).toBe('RUNNING');
  });
  it('should ignore START when COMPLETED', () => {
    const completedState: SimulationState = { ...INITIAL_STATE, status: 'COMPLETED' };
    const newState = simulationReducer(completedState, { type: 'START' });
    expect(newState.status).toBe('COMPLETED');
  });
  it('should RESET to initial state but preserve speed multiplier', () => {
    const state: SimulationState = { status: 'PAUSED', progress: 0.5, elapsedTime: 1000, speedMultiplier: 2 };
    const newState = simulationReducer(state, { type: 'RESET' });
    expect(newState.status).toBe('IDLE');
    expect(newState.progress).toBe(0);
    expect(newState.elapsedTime).toBe(0);
    expect(newState.speedMultiplier).toBe(2);
  });
  it('should SET_SPEED correctly', () => {
    const newState = simulationReducer(INITIAL_STATE, { type: 'SET_SPEED', speed: 4 });
    expect(newState.speedMultiplier).toBe(4);
  });
  it('should UPDATE_PROGRESS and complete if progress >= 1', () => {
    const runningState: SimulationState = { ...INITIAL_STATE, status: 'RUNNING', speedMultiplier: 1 };
    const msToComplete = TOTAL_ROUTE_DISTANCE_KM / SIMULATED_BASE_SPEED_KM_MS;
    const newState = simulationReducer(runningState, { type: 'UPDATE_PROGRESS', deltaMs: msToComplete + 100 });
    expect(newState.status).toBe('COMPLETED');
    expect(newState.progress).toBe(1.0);
  });
});
