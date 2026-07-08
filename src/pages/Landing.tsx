import { Link } from 'react-router-dom';
import UnicornScene from 'unicornstudio-react';
import { ArrowRight, BadgeCheck, Camera, LockKeyhole, ReceiptText } from 'lucide-react';

const UNICORN_PROJECT_ID = '6daVuQWMJP0W4VYgzNrz';
const UNICORN_SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.6/dist/unicornStudio.umd.js';

const trustPoints = [
  { label: 'Signed-in workspace', icon: LockKeyhole },
  { label: 'Photo-backed udhaar', icon: Camera },
  { label: 'Daily ledger controls', icon: ReceiptText },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-950">
      <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
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
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(15,23,42,0.86)_42%,rgba(15,23,42,0.34)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
          <header className="flex h-20 items-center justify-between">
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
          </header>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.62fr)]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-100">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                Verified shopkeeper ledger
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Manage udhaar, sales, and proof in one signed-in workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Ledgerly keeps your daily shop records private, structured, and tied to customer verification, so your team can work from real account data instead of loose notes.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="border-l border-white/15 pl-8">
                <div className="space-y-4">
                  {trustPoints.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 text-slate-200">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-primary-200">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pb-6">
            <div className="h-px w-full bg-white/10" />
          </div>
        </div>
      </section>

      <section id="controls" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-6 lg:grid-cols-3 lg:px-8">
          {trustPoints.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-5 w-5 text-primary-600" />
                <h2 className="mt-4 text-base font-bold text-slate-950">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.label === 'Signed-in workspace'
                    ? 'Every operational screen sits behind Clerk authentication.'
                    : item.label === 'Photo-backed udhaar'
                      ? 'Customer credit flows are designed around verification records.'
                      : 'Sales, expenses, inventory, customers, and payments stay grouped by workflow.'}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
