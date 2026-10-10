/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ChapterView } from './components/views/ChapterView';
import { PlaygroundView } from './components/views/PlaygroundView';
import { CheatsheetView } from './components/views/CheatsheetView';
import { ProblemBankView } from './components/views/ProblemBankView';
import { VerificationView } from './components/views/VerificationView';
import { DeployGuideModal } from './components/modals/DeployGuideModal';
import { CHAPTERS_DATA } from './data/curriculum';

export default function App() {
  // Navigation state: 'chapter:ch_preface', 'playground', 'cheatsheet', 'problems', 'verification'
  const [currentView, setCurrentView] = useState<string>('chapter:ch_preface');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Synchronize with URL hash for GitHub Pages & shareable links
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('chapter/')) {
        const chId = hash.replace('chapter/', '');
        const exists = CHAPTERS_DATA.some((c) => c.id === chId);
        if (exists) {
          setCurrentView(`chapter:${chId}`);
          return;
        }
      } else if (hash === 'playground') {
        setCurrentView('playground');
        return;
      } else if (hash === 'cheatsheet') {
        setCurrentView('cheatsheet');
        return;
      } else if (hash === 'problems') {
        setCurrentView('problems');
        return;
      } else if (hash === 'verification') {
        setCurrentView('verification');
        return;
      }
      // default
      setCurrentView('chapter:ch_preface');
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view.startsWith('chapter:')) {
      const chId = view.split(':')[1];
      window.location.hash = `#/chapter/${chId}`;
    } else {
      window.location.hash = `#/${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (chId: string) => {
    handleNavigate(`chapter:${chId}`);
  };

  const currentChapterId = currentView.startsWith('chapter:')
    ? currentView.split(':')[1]
    : 'ch_preface';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView.startsWith('chapter:') && (
          <ChapterView
            currentChapterId={currentChapterId}
            onSelectChapter={handleSelectChapter}
          />
        )}

        {currentView === 'playground' && <PlaygroundView />}

        {currentView === 'cheatsheet' && <CheatsheetView />}

        {currentView === 'problems' && <ProblemBankView />}

        {currentView === 'verification' && <VerificationView />}
      </div>

      {/* Footer */}
      <Footer />

      {/* Deployment Guidance Modal */}
      <DeployGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
