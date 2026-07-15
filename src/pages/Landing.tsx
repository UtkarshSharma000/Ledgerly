import { Link } from 'react-router-dom';
import UnicornScene from 'unicornstudio-react';
import { ArrowDown, ArrowRight, Camera, LockKeyhole, ReceiptText } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

const UNICORN_PROJECT_ID = '4OxHKCLZnuhFfhDZHZ4p';
const UNICORN_SDK_URL = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.7/dist/unicornStudio.umd.js';

const trustPoints = [
  { label: 'A private workspace', description: 'Your real ledger stays grouped by workflow and ready when you need it.', icon: LockKeyhole },
  { label: 'Proof when it matters', description: 'Customer credit can carry the verification records that make it dependable.', icon: Camera },
  { label: 'A steadier daily rhythm', description: 'Sales, expenses, inventory, and payments stay easy to return to.', icon: ReceiptText },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const quoteY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const quoteOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0]);

  return (
    <main className="min-h-screen bg-[#f7f7f4] font-sans text-slate-950">
      <section className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <UnicornScene projectId={UNICORN_PROJECT_ID} sdkUrl={UNICORN_SDK_URL} width="100%" height="100%" scale={0.9} dpi={1.25} fps={60} lazyLoad={false} production />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
          <motion.header className="flex h-20 items-center justify-between" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
            <Link to="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-base font-black text-neutral-950">L</span><span className="text-xl font-extrabold">Ledgerly</span></Link>
            <Link to="/app/dashboard" className="inline-flex items-center gap-2 rounded-md border border-white/70 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-neutral-950">Sign in<ArrowRight className="h-4 w-4" /></Link>
          </motion.header>

          <motion.div style={{ y: quoteY, opacity: quoteOpacity }} className="flex flex-1 items-center justify-center py-16 text-center">
            <motion.blockquote initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl [font-family:var(--font-display)] text-5xl leading-[1.08] text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.75)] sm:text-6xl lg:text-7xl">“Clarity is built one careful record at a time.”</motion.blockquote>
          </motion.div>

          <div className="pb-7">
            <motion.a href="#controls" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors hover:text-white" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}>Scroll to continue<ArrowDown className="h-4 w-4 animate-bounce" /></motion.a>
          </div>
        </div>
      </section>

      <section id="controls" className="bg-[#f7f7f4] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ staggerChildren: 0.14 }} className="max-w-4xl">
            <motion.p variants={fadeUp} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">A calm place for the daily work</motion.p>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className="mt-5 max-w-3xl [font-family:var(--font-display)] text-5xl leading-[1.08] text-slate-950 sm:text-6xl">Small records. Clear decisions. Stronger businesses.</motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Ledgerly keeps the details of a working shop organized without turning the work into a spectacle. Start with a limited guest workspace, then sign in when those records need to last.</motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="mt-9 flex flex-wrap gap-3">
              <Link to="/app/dashboard" className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800">Sign in to open app<ArrowRight className="h-4 w-4" /></Link>
              <Link to="/guest/start" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-white">Try guest mode</Link>
            </motion.div>
          </motion.div>

          <div className="mt-16 grid border-y border-slate-200 lg:grid-cols-3">
            {trustPoints.map((item, index) => {
              const Icon = item.icon;
              return <motion.div key={item.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} className="border-b border-slate-200 py-8 last:border-b-0 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:not-last:border-r lg:last:pr-0"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-700 shadow-sm"><Icon className="h-5 w-5" /></span><h2 className="mt-5 text-lg font-bold text-slate-950">{item.label}</h2><p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">{item.description}</p></motion.div>;
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
