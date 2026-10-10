import React from 'react';
import { MontyHallSim } from './MontyHallSim';
import { BayesTestSim } from './BayesTestSim';
import { PrisonersBoxesSim } from './PrisonersBoxesSim';
import { CouponGachaSim } from './CouponGachaSim';
import { GaussVisualizer } from './GaussVisualizer';
import { TreeDPVisualizer } from './TreeDPVisualizer';
import { Walk1DSim } from './Walk1DSim';
import { CycleLastVisited } from './CycleLastVisited';
import { MartingalePathSim } from './MartingalePathSim';
import { BorderCasinoSim } from './BorderCasinoSim';
import { PenneyGameArena } from './PenneyGameArena';
import { VoterModelGrid } from './VoterModelGrid';
import { BallotBackward } from './BallotBackward';
import { MarkovElectricalSim } from './MarkovElectricalSim';
import { OptimalStoppingSim } from './OptimalStoppingSim';
import { GeometricProbSim } from './GeometricProbSim';
import { KellyBankrollSim } from './KellyBankrollSim';
import { RandomizedAlgorithmsSim } from './RandomizedAlgorithmsSim';

interface WidgetRendererProps {
  widgetName: string;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widgetName }) => {
  switch (widgetName) {
    case 'MontyHallSim':
      return <MontyHallSim />;
    case 'BayesTestSim':
      return <BayesTestSim />;
    case 'PrisonersBoxesSim':
      return <PrisonersBoxesSim />;
    case 'CouponGachaSim':
      return <CouponGachaSim />;
    case 'GaussVisualizer':
      return <GaussVisualizer />;
    case 'TreeDPVisualizer':
      return <TreeDPVisualizer />;
    case 'Walk1DSim':
      return <Walk1DSim />;
    case 'CycleLastVisited':
      return <CycleLastVisited />;
    case 'MartingalePathSim':
      return <MartingalePathSim />;
    case 'BorderCasinoSim':
      return <BorderCasinoSim />;
    case 'PenneyGameArena':
      return <PenneyGameArena />;
    case 'VoterModelGrid':
      return <VoterModelGrid />;
    case 'BallotBackward':
      return <BallotBackward />;
    case 'MarkovElectricalSim':
      return <MarkovElectricalSim />;
    case 'OptimalStoppingSim':
      return <OptimalStoppingSim />;
    case 'GeometricProbSim':
      return <GeometricProbSim />;
    case 'KellyBankrollSim':
      return <KellyBankrollSim />;
    case 'RandomizedAlgorithmsSim':
      return <RandomizedAlgorithmsSim />;
    default:
      return <MontyHallSim />;
  }
};
