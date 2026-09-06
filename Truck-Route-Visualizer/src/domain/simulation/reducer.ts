import type { SimulationState, SimulationCommand, SimulationStatus } from './types';
import { SIMULATED_BASE_SPEED_KM_MS, TOTAL_ROUTE_DISTANCE_KM } from '../path/config';
export const INITIAL_STATE: SimulationState = {
  status: 'IDLE',
  progress: 0,
  elapsedTime: 0,
  speedMultiplier: 1,
};
export function simulationReducer(state: SimulationState, command: SimulationCommand): SimulationState {
  switch (command.type) {
    case 'START':
      if (state.status !== 'IDLE' && state.status !== 'PAUSED') {
        return state; 
      }
      return { ...state, status: 'RUNNING' };
    case 'PAUSE':
      if (state.status !== 'RUNNING') {
        return state;
      }
      return { ...state, status: 'PAUSED' };
    case 'RESUME':
      if (state.status !== 'PAUSED') {
        return state;
      }
      return { ...state, status: 'RUNNING' };
    case 'RESET':
      return { ...INITIAL_STATE, speedMultiplier: state.speedMultiplier };
    case 'SET_SPEED':
      return { ...state, speedMultiplier: command.speed };
    case 'UPDATE_PROGRESS':
      if (state.status !== 'RUNNING') {
        return state;
      }
      const newElapsedTime = state.elapsedTime + (command.deltaMs * state.speedMultiplier);
      const distanceCovered = newElapsedTime * SIMULATED_BASE_SPEED_KM_MS;
      let newProgress = distanceCovered / TOTAL_ROUTE_DISTANCE_KM;
      let newStatus: SimulationStatus = state.status;
      if (newProgress >= 1.0) {
        newProgress = 1.0;
        newStatus = 'COMPLETED';
      }
      return {
        ...state,
        progress: newProgress,
        elapsedTime: newElapsedTime,
        status: newStatus
      };
    default:
      return state;
  }
}
