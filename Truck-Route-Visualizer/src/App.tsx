import { useEffect, useState } from 'react';
import { useRouteSimulation } from './features/route-visualizer/hooks/useRouteSimulation';
import { RouteMap } from './features/route-visualizer/components/RouteMap';
import { RouteControls } from './features/route-visualizer/components/RouteControls';
import { TruckStatus } from './features/route-visualizer/components/TruckStatus';
import { StopProgress } from './features/route-visualizer/components/StopProgress';
import { routeService } from './services/routeService';
import type { ShipmentDetails } from './services/routeService';
import { calculateETA, getDistanceCovered, getStopState, getCurrentLocationLabel } from './domain/simulation/eta';
import { useTheme } from './hooks/useTheme';
import { Map, Moon, Sun } from 'lucide-react';
import styles from './App.module.css';
import './styles/global.css';
function App() {
  const { theme, toggleTheme } = useTheme();
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, executeCommand } = useRouteSimulation();
  useEffect(() => {
    let mounted = true;
    routeService.getShipmentDetails().then(data => {
      if (mounted) {
        setShipment(data);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Failed to load shipment", err);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);
  if (loading || !shipment) {
    return <div className={styles.loadingState}>Loading Logistics Data...</div>;
  }
  const { completedStops, currentStop, nextStop } = getStopState(state.progress);
  const completedStopIds = new Set(completedStops.map(s => s.id));
  const distanceCovered = getDistanceCovered(state.progress);
  const etaStr = calculateETA(state.progress, state.speedMultiplier, state.status);
  const locationLabel = getCurrentLocationLabel(state.progress);
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Map className={styles.brandIcon} size={28} />
          <span className={styles.brandName}>FreightFox Logistics</span>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.shipmentId}>Shipment {shipment.id}</span>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.routeSection}>
          <RouteMap 
            progress={state.progress}
            stops={shipment.stops}
            completedStopIds={completedStopIds}
            currentStopId={currentStop?.id}
            nextStopId={nextStop?.id}
          />
          <RouteControls 
            status={state.status}
            speedMultiplier={state.speedMultiplier}
            executeCommand={executeCommand}
          />
          <StopProgress 
            stops={shipment.stops}
            completedStopIds={completedStopIds}
          />
        </section>
        <aside className={styles.sidebar}>
          <TruckStatus 
            status={state.status}
            currentLocation={locationLabel}
            nextStop={nextStop ? nextStop.label : null}
            distanceCoveredKm={distanceCovered}
            totalDistanceKm={shipment.totalDistanceKm}
            etaStr={etaStr}
            progress={state.progress}
            completedStopsCount={completedStops.length}
          />
        </aside>
      </main>
    </div>
  );
}
export default App;
