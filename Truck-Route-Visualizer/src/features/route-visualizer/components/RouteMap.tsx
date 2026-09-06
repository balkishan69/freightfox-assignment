import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import styles from './RouteMap.module.css';
import { TruckMarker } from './TruckMarker';
import { StopMarkers } from './StopMarkers';
import { getPointAtProgress, getRotationAtProgress } from '../../../domain/path/pathGeometry';
import type { RouteStop } from '../../../domain/simulation/types';
interface RouteMapProps {
  progress: number;
  stops: RouteStop[];
  completedStopIds: Set<string>;
  currentStopId?: string;
  nextStopId?: string;
}
export const RouteMap: React.FC<RouteMapProps> = ({
  progress,
  stops,
  completedStopIds,
  currentStopId,
  nextStopId
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [truckPos, setTruckPos] = useState({ x: -1000, y: -1000, rotation: 0 });
  const d = "M 100 300 C 200 100, 350 100, 450 200 S 600 300, 750 150";
  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);
  useEffect(() => {
    if (pathRef.current && pathLength > 0) {
      const pt = getPointAtProgress(pathRef.current, progress);
      const rot = getRotationAtProgress(pathRef.current, progress);
      if (pt) {
        setTruckPos({ x: pt.x, y: pt.y, rotation: rot });
      }
    }
  }, [progress, pathLength]);
  const getPointForProgress = (p: number) => {
    if (!pathRef.current || pathLength === 0) return null;
    return getPointAtProgress(pathRef.current, p);
  };
  return (
    <div className={styles.mapContainer}>
      <svg 
        viewBox="0 0 850 400" 
        className={styles.svgArea}
        preserveAspectRatio="xMidYMid meet"
      >
        {}
        <path 
          d={d}
          className={styles.routePathBase}
        />
        {}
        <path 
          ref={pathRef}
          d={d}
          className={styles.routePathActive}
          strokeDasharray={pathLength > 0 ? pathLength : 0}
          strokeDashoffset={pathLength > 0 ? pathLength * (1 - progress) : 0}
        />
        <StopMarkers 
          stops={stops}
          completedStopIds={completedStopIds}
          currentStopId={currentStopId}
          nextStopId={nextStopId}
          getPointForProgress={getPointForProgress}
        />
        {pathLength > 0 && (
          <TruckMarker 
            x={truckPos.x} 
            y={truckPos.y} 
            rotation={truckPos.rotation} 
          />
        )}
      </svg>
    </div>
  );
};
