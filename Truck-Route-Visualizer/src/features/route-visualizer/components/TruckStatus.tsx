import styles from './TruckStatus.module.css';
import type { SimulationStatus } from '../../../domain/simulation/types';
import { ROUTE_STOPS } from '../../../domain/path/config';
import clsx from 'clsx';
interface TruckStatusProps {
  status: SimulationStatus;
  currentLocation: string;
  nextStop: string | null;
  distanceCoveredKm: number;
  totalDistanceKm: number;
  etaStr: string;
  progress: number;
  completedStopsCount: number;
}
export const TruckStatus: React.FC<TruckStatusProps> = ({
  status,
  currentLocation,
  nextStop,
  distanceCoveredKm,
  totalDistanceKm,
  etaStr,
  progress,
  completedStopsCount,
}) => {
  return (
    <div className={styles.statusCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>TRUCK STATUS</h3>
        <div className={styles.statusIndicator}>
          <span className={clsx(styles.dot, status === 'RUNNING' ? styles.dotLive : '')}></span>
          <span className={styles.statusText}>
            {status === 'IDLE' && 'Ready'}
            {status === 'RUNNING' && 'Simulation Running'}
            {status === 'PAUSED' && 'Simulation Paused'}
            {status === 'COMPLETED' && 'Route Completed'}
          </span>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.dataGroup}>
          <label>Current Location</label>
          <div className={styles.value}>{currentLocation}</div>
        </div>
        <div className={styles.dataGroup}>
          <label>Next Stop</label>
          <div className={styles.value}>{nextStop || 'None'}</div>
        </div>
        <div className={styles.dataGroup}>
          <label>Distance Covered</label>
          <div className={styles.value}>
            {distanceCoveredKm.toFixed(1)} km <span className={styles.subValue}>/ {totalDistanceKm.toFixed(1)} km</span>
          </div>
        </div>
        <div className={styles.dataGroup}>
          <label>ETA</label>
          <div className={styles.value}>{etaStr}</div>
        </div>
        <div className={styles.dataGroup}>
          <label>Route Progress</label>
          <div className={styles.value}>
            {Math.round(progress * 100)}%
          </div>
        </div>
        <div className={styles.dataGroup}>
          <label>Completed Stops</label>
          <div className={styles.value}>
            {completedStopsCount} / {ROUTE_STOPS.length}
          </div>
        </div>
      </div>
    </div>
  );
};
