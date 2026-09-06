import { useReducer, useEffect, useRef, useCallback } from 'react';
import { simulationReducer, INITIAL_STATE } from '../../../domain/simulation/reducer';
import type { SimulationCommand } from '../../../domain/simulation/types';
export function useRouteSimulation() {
  const [state, dispatch] = useReducer(simulationReducer, INITIAL_STATE);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaMs = time - previousTimeRef.current;
      if (stateRef.current.status === 'RUNNING') {
        dispatch({ type: 'UPDATE_PROGRESS', deltaMs });
      }
    }
    previousTimeRef.current = time;
    if (stateRef.current.status === 'RUNNING') {
       requestRef.current = requestAnimationFrame(animate);
    }
  }, []);
  useEffect(() => {
    if (state.status === 'RUNNING') {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.status, animate]);
  const executeCommand = useCallback((command: SimulationCommand) => {
    dispatch(command);
  }, []);
  return {
    state,
    executeCommand
  };
}
