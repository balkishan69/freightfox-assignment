import type { RouteStop } from '../../../domain/simulation/types';
import styles from './StopProgress.module.css';
import { Check, Circle } from 'lucide-react';
import clsx from 'clsx';
interface StopProgressProps {
  stops: RouteStop[];
  completedStopIds: Set<string>;
}
export const StopProgress: React.FC<StopProgressProps> = ({ stops, completedStopIds }) => {
  return (
    <div className={styles.timelineContainer}>
      <span className={styles.label}>Completed Stops</span>
      <div className={styles.timeline}>
        {stops.map((stop, index) => {
          const isCompleted = completedStopIds.has(stop.id);
          return (
            <div key={stop.id} className={styles.stopNode}>
              <div className={styles.iconWrapper}>
                {isCompleted ? (
                  <Check size={16} className={styles.completedIcon} />
                ) : (
                  <Circle size={14} className={styles.pendingIcon} />
                )}
              </div>
              <span className={clsx(styles.stopName, isCompleted && styles.stopNameCompleted)}>
                {stop.label.replace('Delivery Point ', '').replace('Final Destination ', '')}
              </span>
              {index < stops.length - 1 && (
                <div className={clsx(styles.line, isCompleted && styles.lineCompleted)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
