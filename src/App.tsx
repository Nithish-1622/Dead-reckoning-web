import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { ArchitectureFlow } from './components/ArchitectureFlow';
import { SensorEngine } from './components/SensorEngine';
import { MLEngineSection } from './components/MLEngineSection';
import { GNSSTransition } from './components/GNSSTransition';
import { MapMatching } from './components/MapMatching';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { InstallSection } from './components/InstallSection/InstallSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ThemeProvider } from './lib/theme';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      {/* Dynamic Sticky Header with Theme Switcher */}
      <Navbar />

      {/* Main Landing & Technology Showcase */}
      <main className="flex-grow">
        {/* 1. Hero with Live Navigation Simulation */}
        <Hero />

        {/* 2. Problem: GNSS Outages in Real-World Scenarios */}
        <ProblemSection />

        {/* 3. Technology: Smartphone Sensor Platform */}
        <SensorEngine />

        {/* 4. Intelligence: AI Signal Filtering & Speed Regression */}
        <MLEngineSection />

        {/* 5. 8-Stage Architecture Flow */}
        <ArchitectureFlow />

        {/* 6. Outage Continuity Timeline */}
        <GNSSTransition />

        {/* 7. Map Matching & Kinematic Constraints */}
        <MapMatching />

        {/* 8. Empirical Performance Benchmarks */}
        <PerformanceMetrics />

        {/* 9. Live Monitoring & Fleet Session Console */}
        <MonitoringDashboard />

        {/* 10. Device-Aware Installation Gateway */}
        <InstallSection />

        {/* 11. Final Call-to-Action */}
        <FinalCTA />
      </main>

      {/* Monochrome Aerospace Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
