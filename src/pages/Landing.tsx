import { Link } from 'react-router-dom';
import UnicornScene from "unicornstudio-react";
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative font-sans text-white h-screen w-full bg-slate-950 overflow-hidden">
      
      {/* GLOBAL FIXED BACKGROUNDS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <UnicornScene 
          projectId="udFNWBGQNnGf96lhqGMW" 
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js"
          width="100%" 
          height="100%" 
        />
      </div>

      {/* SCROLLING SNAP CONTAINER */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full h-screen overflow-y-auto snap-y snap-mandatory"
      >
        {/* PANEL 1: Glass Slab Intro */}
        <div className="relative h-screen w-full snap-start flex flex-col items-center justify-center">
          <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col h-full pointer-events-none">
            {/* Navigation */}
            <header className="py-6 flex justify-between items-center w-full pointer-events-auto">
              <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                Ledgerly
              </div>
              <Link 
                to="/app/dashboard"
                className="px-5 py-2.5 bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-colors shadow-lg"
              >
                Go to App
              </Link>
            </header>

            <main className="flex-1 flex flex-col justify-center items-start text-left">
            </main>

            <div className="pb-8 flex justify-center w-full pointer-events-auto animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* PANEL 2: Run Your Business With Clarity */}
        <div className="relative h-screen w-full snap-start flex flex-col items-center justify-center">
          <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col justify-center h-full text-center pointer-events-none">
            <div className="flex flex-col items-center pointer-events-auto">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-[1.1] drop-shadow-2xl">
                Run Your Business <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 drop-shadow-sm">With Clarity.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mb-10 leading-relaxed font-light drop-shadow-lg">
                All your daily metrics in one dashboard. Take control of your store and automate debt follow-ups.
              </p>
              <Link 
                to="/app/dashboard" 
                className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] hover:scale-105 transition-all text-lg inline-flex"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
