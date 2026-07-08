import { Link } from 'react-router-dom';
import UnicornScene from "unicornstudio-react";
import { ChevronDown, Sparkles } from 'lucide-react';
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

            <main className="flex-1 flex flex-col justify-center items-start text-left pointer-events-auto max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" /> Next-Gen Shopkeeper Ledger
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Your Ledger, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">
                  Fully Verified.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-8">
                Eliminate disputes and build customer trust. Advanced shopkeeper udhaar management with real-time analytics, secure ledger histories, and mandatory camera verification.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/app/dashboard"
                  className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:translate-y-[-2px] transition-all"
                >
                  Enter Dashboard
                </Link>
                <button 
                  onClick={() => containerRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/10 hover:bg-white/25 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  Explore WebGL Scene <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </main>

            <div className="pb-8 flex justify-center w-full pointer-events-auto animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* PANEL 2: Interactive WebGL Showcase */}
        <div className="relative h-screen w-full snap-start flex flex-col items-center justify-center bg-slate-950/40">
          <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
            
            {/* Column 1: Scene Details */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left pointer-events-auto z-10 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold self-start">
                🌀 Interactive WebGL Atmosphere
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Real-Time <br />
                Business Energy.
              </h2>
              <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed">
                Experience the fluidity of our high-performance ledger network. Powered by Unicorn Studio WebGL technology, this real-time ambient environment represents the speed and precision of digital ledger auditing.
              </p>
              <div className="pt-4 flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs">
                  Project: 6daVuQWMJP0W
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs">
                  SDK: v2.2.6
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs">
                  FPS: 60 (DPI: 1.5)
                </span>
              </div>
            </div>

            {/* Column 2: WebGL Canvas Frame */}
            <div className="lg:col-span-7 w-full flex justify-center items-center pointer-events-auto z-10">
              <div className="relative w-full aspect-video md:h-[450px] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Header bar of the frame */}
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                    Unicorn Studio WebGL Canvas
                  </div>
                  <div className="w-12 h-1.5 bg-white/5 rounded" />
                </div>
                
                {/* Scene container */}
                <div className="flex-1 relative w-full h-full bg-black/20">
                  <UnicornScene 
                    projectId="6daVuQWMJP0W4VYgzNrz" 
                    sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.6/dist/unicornStudio.umd.js"
                    width="100%" 
                    height="100%"
                    scale={1}
                    dpi={1.5}
                    fps={60}
                    lazyLoad={true}
                    production={true}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PANEL 3: Run Your Business With Clarity */}
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
