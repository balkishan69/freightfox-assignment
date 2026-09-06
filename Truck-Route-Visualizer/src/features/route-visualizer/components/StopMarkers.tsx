import type { RouteStop } from '../../../domain/simulation/types';
import { Check } from 'lucide-react';
import styles from './RouteMap.module.css';
import clsx from 'clsx';
interface StopMarkersProps {
  stops: RouteStop[];
  completedStopIds: Set<string>;
  currentStopId?: string;
  nextStopId?: string;
  getPointForProgress: (progress: number) => DOMPoint | null;
}
export const StopMarkers: React.FC<StopMarkersProps> = ({ 
  stops, 
  completedStopIds, 
  currentStopId, 
  nextStopId, 
  getPointForProgress 
}) => {
  return (
    <>
      {stops.map(stop => {
        const pt = getPointForProgress(stop.progressThreshold);
        if (!pt) return null;
        const isCompleted = completedStopIds.has(stop.id);
        const isCurrent = currentStopId === stop.id;
        const isNext = nextStopId === stop.id;
        return (
          <g key={stop.id} className={styles.stopGroup} style={{ transform: `translate(${pt.x}px, ${pt.y}px)` }}>
            <circle 
              r="12" 
              className={clsx(
                styles.stopCircle,
                isCompleted && styles.stopCompleted,
                isCurrent && styles.stopCurrent,
                isNext && styles.stopNext
              )} 
            />
            {isCompleted && (
              <Check size={14} className={styles.stopIcon} x="-7" y="-7" />
            )}
            <text 
              y="30" 
              className={clsx(
                styles.stopLabel,
                (isCurrent || isNext) && styles.stopLabelActive
              )}
            >
              {stop.label}
            </text>
          </g>
        );
      })}
    </>
  );
};
