import { Link } from 'react-router-dom';
import UnicornScene from "unicornstudio-react";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      {/* Background WebGL Scene */}
      <div className="absolute inset-0 z-0 opacity-60">
        <UnicornScene 
          projectId="nZBviN0xP52btKGNS0rm" 
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js"
          width="100%" 
          height="100%" 
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Navigation */}
        <header className="px-6 py-6 md:px-12 flex justify-between items-center">
          <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            Ledgerly
          </div>
          <Link 
            to="/app/dashboard"
            className="px-5 py-2.5 bg-white text-slate-900 text-sm font-medium rounded-full hover:bg-slate-100 transition-colors shadow-lg"
          >
            Go to App
          </Link>
        </header>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto px-6 tracking-tight text-center sm:text-left sm:items-start items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary-400"></span>
            Professional Finance Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Run Your Business <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-200">With Clarity.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            The ultra-modern SaaS ledger tailored for small businesses, kirana stores, and local service providers. Track sales, expenses, and udhaar instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/app/dashboard" 
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all shadow-primary-500/30 text-lg flex items-center justify-center gap-2 border border-primary-500"
            >
              Start Free Trial
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
