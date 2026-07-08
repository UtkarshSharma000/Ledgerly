import { Link } from 'react-router-dom';
import UnicornScene from 'unicornstudio-react';
import { ArrowDown, ArrowRight, BadgeCheck, Camera, LockKeyhole, ReceiptText } from 'lucide-react';
import { motion } from 'motion/react';

const UNICORN_PROJECT_ID = '6daVuQWMJP0W4VYgzNrz';
const UNICORN_SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.6/dist/unicornStudio.umd.js';

const trustPoints = [
  { label: 'Signed-in workspace', icon: LockKeyhole },
  { label: 'Photo-backed udhaar', icon: Camera },
  { label: 'Daily ledger controls', icon: ReceiptText },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-950">
      <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <UnicornScene
            projectId={UNICORN_PROJECT_ID}
            sdkUrl={UNICORN_SDK_URL}
            width="100%"
            height="100%"
            scale={0.85}
            dpi={1.25}
            fps={60}
            lazyLoad={false}
            production={true}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(15,23,42,0.78)_48%,rgba(15,23,42,0.46)_100%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.15, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
          <motion.header
            className="flex h-20 items-center justify-between"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-base font-black text-white">
                L
              </span>
              <span className="text-xl font-extrabold tracking-normal">Ledgerly</span>
            </Link>
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.header>

          <motion.div
            className="flex flex-1 items-center py-12"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.16, delayChildren: 1.5 }}
          >
            <div className="max-w-4xl">
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-100"
              >
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                Verified shopkeeper ledger
              </motion.div>
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl"
              >
                Manage udhaar, sales, and proof in one signed-in workspace.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
              >
                Ledgerly keeps your daily shop records private, structured, and tied to customer verification, so your team can work from real account data instead of loose notes.
              </motion.p>
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-950/30 transition-colors hover:bg-primary-600"
                >
                  Sign in to open app
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#controls"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15"
                >
                  See controls
                </a>
              </motion.div>
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4"
              >
                <Link
                  to="/guest/start"
                  className="inline-flex text-sm font-semibold text-emerald-100 underline decoration-emerald-300/60 underline-offset-4 transition-colors hover:text-white"
                >
                  Continue as guest with limited records
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <div className="relative z-10 pb-6">
            <motion.a
              href="#controls"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.25, ease: [0.22, 1, 0.36, 1] }}
            >
              Scroll for controls
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </motion.a>
          </div>
        </div>
      </section>

      <section id="controls" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            transition={{ staggerChildren: 0.16 }}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-bold uppercase tracking-[0.12em] text-primary-600"
            >
              Built for repeat workflows
            </motion.p>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl"
            >
              Start limited, then sign in when the ledger becomes real.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-base leading-7 text-slate-600 sm:text-lg"
            >
              Guest mode lets you test each workflow with a small browser-only quota. A signed-in account unlocks the real workspace for persistent business data.
            </motion.p>
          </motion.div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {trustPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{item.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.label === 'Signed-in workspace'
                      ? 'Sign in for your real workspace, or try a capped guest session first.'
                      : item.label === 'Photo-backed udhaar'
                        ? 'Customer credit flows are designed around verification records.'
                        : 'Sales, expenses, inventory, customers, and payments stay grouped by workflow.'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
