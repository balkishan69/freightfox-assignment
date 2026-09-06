import { Play, Pause, RotateCcw } from 'lucide-react';
import type { SimulationCommand, SimulationStatus } from '../../../domain/simulation/types';
import styles from './RouteControls.module.css';
import clsx from 'clsx';
interface RouteControlsProps {
  status: SimulationStatus;
  speedMultiplier: number;
  executeCommand: (cmd: SimulationCommand) => void;
}
export const RouteControls: React.FC<RouteControlsProps> = ({ status, speedMultiplier, executeCommand }) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.primaryActions}>
        {(status === 'IDLE' || status === 'PAUSED') && (
          <button 
            className={clsx(styles.btn, styles.btnPrimary)} 
            onClick={() => executeCommand({ type: status === 'IDLE' ? 'START' : 'RESUME' })}
          >
            <Play size={18} />
            {status === 'IDLE' ? 'Start Simulation' : 'Resume'}
          </button>
        )}
        {status === 'RUNNING' && (
          <button 
            className={clsx(styles.btn, styles.btnWarning)} 
            onClick={() => executeCommand({ type: 'PAUSE' })}
          >
            <Pause size={18} />
            Pause
          </button>
        )}
        <button 
          className={clsx(styles.btn, styles.btnOutline)} 
          onClick={() => executeCommand({ type: 'RESET' })}
          disabled={status === 'IDLE'}
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
      <div className={styles.speedControls}>
        <span className={styles.speedLabel}>Speed</span>
        {[1, 2, 4].map(speed => (
          <button
            key={speed}
            className={clsx(styles.speedBtn, speedMultiplier === speed && styles.speedBtnActive)}
            onClick={() => executeCommand({ type: 'SET_SPEED', speed })}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};
