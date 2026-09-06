export type StopId = 'ORIGIN' | 'D1' | 'D2' | 'D3';
export interface RouteStop {
  id: StopId;
  label: string;
  progressThreshold: number; 
}
export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
export interface SimulationState {
  status: SimulationStatus;
  progress: number; 
  elapsedTime: number; 
  speedMultiplier: number; 
}
export type SimulationCommand =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'UPDATE_PROGRESS'; deltaMs: number };
