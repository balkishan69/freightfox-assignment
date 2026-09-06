import React from 'react';
import { Truck } from 'lucide-react';
import styles from './RouteMap.module.css';
interface TruckMarkerProps {
  x: number;
  y: number;
  rotation: number;
}
export const TruckMarker: React.FC<TruckMarkerProps> = ({ x, y, rotation }) => {
  return (
    <g 
      className={styles.truckGroup} 
      style={{ 
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)` 
      }}
    >
      {}
      <rect x="-24" y="-14" width="48" height="28" rx="6" className={styles.truckBg} />
      <Truck x="-12" y="-12" size={24} className={styles.truckIcon} />
    </g>
  );
};
