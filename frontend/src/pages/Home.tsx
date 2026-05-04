import { Link } from 'react-router-dom';

const stats = [
  { value: '18', label: 'Verification Rules', sub: 'deterministic checks' },
  { value: '<90s', label: 'Pipeline Runtime', sub: 'end-to-end' },
  { value: '100%', label: 'Auditable', sub: 'every finding explained' },
  { value: '0', label: 'Automated Decisions', sub: 'always human-reviewed' },
];

const ruleCategories = [
  {
    title: 'Graduation & Conferral',
    count: 4,
    color: 'bg-blue-50 border-blue-200',
    titleColor: 'text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-400',
    rules: [
      'Graduation date is present on the transcript',
      'Degree is explicitly conferred / awarded',
      'Graduation date is not in the future',
      'Transcript is officially issued to MSBON / Board of Nursing',
    ],
  },
  {
    title: 'Program Completion',
    count: 5,
    color: 'bg-green-50 border-green-200',
    titleColor: 'text-green-800',
    badgeColor: 'bg-green-100 text-green-700',
    dotColor: 'bg-green-400',
    rules: [
      'Minimum credit hours met (ADN 60 / BSN 120 / MSN 36 / LPN 40)',
      'Required nursing core courses are present',
      'Cumulative GPA meets minimum threshold (2.0)',
      'No failing grades in core nursing courses',
      'Academic standing is in good standing at time of graduation',
    ],
  },
  {
    title: 'Accreditation & Credentials',
    count: 3,
    color: 'bg-purple-50 border-purple-200',
    titleColor: 'text-purple-800',
    badgeColor: 'bg-purple-100 text-purple-700',
    dotColor: 'bg-purple-400',
    rules: [
      'Institution is on the MSBON-approved school list',
      'Program type matches an accredited program at that institution',
      'Credential type is valid for nursing licensure (ADN / BSN / MSN / LPN)',
    ],
  },
  {
    title: 'Fraud & Integrity Indicators',
    count: 6,
    color: 'bg-red-50 border-red-200',
    titleColor: 'text-red-800',
    badgeColor: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-400',
    rules: [
      'Conferral date is not before enrollment began',
      'GPA is within a plausible range (0.0 – 4.0)',
      'Credit hours per term are within plausible bounds',
      'No duplicate course entries detected',
      'Course grade distribution is statistically plausible',
      'Transcript shows no signs of alteration or internal inconsistency',
    ],
  },
];

const techStack = [
  { name: 'Amazon Textract', desc: 'Async OCR', icon: '⬡' },
  { name: 'Bedrock Nova Pro', desc: 'AI extraction + analysis', icon: '⬡' },
  { name: 'AWS Step Functions', desc: 'Pipeline orchestration', icon: '⬡' },
  { name: 'Amazon DynamoDB', desc: 'Verification records', icon: '⬡' },
  { name: 'Amazon S3', desc: 'Secure transcript storage', icon: '⬡' },
  { name: 'Amazon CloudFront', desc: 'Global delivery', icon: '⬡' },
];

const DEMO_CHECKS = [
  { label: 'Graduation date verified', done: true },
  { label: 'Degree conferred', done: true },
  { label: 'Credit hours: 128 / 120 BSN', done: true },
  { label: 'GPA 3.42 — above threshold', done: true },
  { label: 'Institution accredited', done: true },
  { label: 'Fraud indicators scan...', done: false },
];

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center lg:justify-end">
      {/* Glow backdrop */}
      <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Floating top badge */}
        <div className="absolute -top-4 -left-4 z-20 bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce-slow">
          <span className="w-1.5 h-1.5 bg-green-700 rounded-full" />
          Pipeline Running
        </div>

        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
          {/* Document header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <div className="w-10 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">BSN_Transcript_2024.pdf</p>
              <p className="text-blue-200 text-xs">Mississippi State University — Nursing</p>
            </div>
          </div>

          {/* Check items */}
          <div className="space-y-2.5">
            {DEMO_CHECKS.map((check, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {check.done ? (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-400/20 border border-green-400/50 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border border-blue-300/50 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
                  </span>
                )}
                <span className={`text-xs ${check.done ? 'text-blue-100' : 'text-blue-300 animate-pulse'}`}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-blue-300">18 rules · Nova Pro</span>
            <span className="text-xs bg-yellow-400/20 border border-yellow-400/30 text-yellow-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
              Verifying…
            </span>
          </div>
        </div>

        {/* Floating result card */}
        <div className="absolute -bottom-5 -right-4 bg-white rounded-xl shadow-xl border px-4 py-2.5 z-20">
          <p className="text-xs font-bold text-gray-800">Report Ready</p>
          <p className="text-[10px] text-gray-400 mt-0.5">5 passed · 1 flagged · human review</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="-mt-6">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-msbon-900 to-msbon-800 text-white min-h-[88vh] flex flex-col justify-center">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        {/* Blue glow orb */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                Mississippi AI Innovation Hub — Proof of Concept
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6 tracking-tight">
                Smarter Transcript<br />
                <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Verification
                </span>
                <br />for Nursing Boards
              </h1>

              <p className="text-lg text-blue-100/80 mb-10 max-w-xl leading-relaxed">
                MSBON staff manually review every nursing transcript submitted for licensure.
                This system runs <strong className="text-white">18 deterministic checks</strong> and
                AI holistic analysis in under 90 seconds — so reviewers see a complete,
                explainable picture before making any decision.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/upload"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-msbon-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20 text-sm"
                >
                  Upload a Transcript
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm"
                >
                  View Dashboard
                </Link>
              </div>

              {/* Mini trust line */}
              <p className="mt-8 text-xs text-blue-300/70 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Advisory only. AI never approves or denies a nursing license.
              </p>
            </div>

            {/* Right: Visual */}
            <HeroVisual />
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative h-16 mt-auto">
          <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,64 C360,0 1080,64 1440,0 L1440,64 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-gray-100">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-6">
                <div className="text-4xl md:text-5xl font-extrabold text-msbon-800 leading-none mb-1">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-gray-800">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM CONTEXT ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-msbon-600 uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Fraud in Nursing Credentials Is Real</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Operation Nightingale exposed a nationwide scheme. Boards of nursing now face mounting pressure to verify credentials consistently — at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Operation Nightingale */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-msbon-50 dark:bg-msbon-900/30 rounded-xl flex items-center justify-center mb-4 border border-msbon-100 dark:border-msbon-800">
              <svg className="w-5 h-5 text-msbon-700 dark:text-msbon-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-msbon-600 dark:text-msbon-400 mb-2">Operation Nightingale</p>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">A Federal Warning</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              A federal investigation uncovered a fraudulent nursing credential scheme that placed unqualified nurses in healthcare settings across the country — making the case for stronger, consistent transcript review.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-4 border border-amber-100 dark:border-amber-800">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">The Manual Bottleneck</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              MSBON staff manually review every transcript for first-time licensure and endorsement. Reviews are time-consuming, inconsistent across reviewers, and leave little capacity to catch sophisticated fraud.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4 border border-green-100 dark:border-green-800">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">AI as the Augmentor</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              This system standardizes every check, flags anomalies automatically, and explains every finding in plain language — so staff review with confidence. AI augments the reviewer; it never replaces them.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-y">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-msbon-600 uppercase tracking-widest mb-3">The Pipeline</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">From Upload to Review in Under 90 Seconds</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A fully automated pipeline handles extraction, verification, and report generation. Staff only engage at the human review step.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative mb-10">
            <div className="hidden md:block absolute top-12 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px bg-gradient-to-r from-msbon-200 via-msbon-400 to-msbon-200" />

            {[
              {
                num: '01',
                title: 'Secure Upload',
                desc: 'Staff uploads a transcript PDF. The file goes directly to S3 via a presigned URL — never stored in the browser. A Step Functions workflow fires automatically.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                accent: 'bg-blue-50 border-blue-100 text-blue-700',
              },
              {
                num: '02',
                title: 'AI Extraction & Verification',
                desc: 'Amazon Textract runs OCR. Nova Pro structures courses, GPA, and dates. 18 deterministic rules fire. Nova Pro then performs holistic fraud and pattern analysis.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                accent: 'bg-purple-50 border-purple-100 text-purple-700',
              },
              {
                num: '03',
                title: 'Human Review & Audit',
                desc: 'Staff reviews every AI finding, can confirm or override any result, and submits a decision. Every action is permanently logged in an immutable audit trail.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                accent: 'bg-green-50 border-green-100 text-green-700',
              },
            ].map((step) => (
              <div key={step.num} className="relative bg-white rounded-2xl border p-7 shadow-sm">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border mb-5 ${step.accent}`}>
                  {step.icon}
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 bg-msbon-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Pipeline strip */}
          <div className="bg-msbon-900 rounded-2xl px-6 py-4 flex flex-wrap justify-center gap-y-2 gap-x-3 text-sm">
            {['PDF Upload → S3', 'Textract OCR', 'Nova Pro Extraction', '18 Rule Checks', 'Nova Pro Analysis', 'Report Generated', 'Staff Review'].map((label, i, arr) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-blue-200 font-medium">{label}</span>
                {i < arr.length - 1 && <span className="text-msbon-500 font-bold text-base">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 18 VERIFICATION RULES ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-msbon-600 uppercase tracking-widest mb-3">The Ruleset</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            18 Rules. 4 Categories. Zero Subjectivity.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every transcript runs the same deterministic checks before AI analysis begins.
            Nothing is skipped. Every result is explained in plain language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ruleCategories.map((cat) => (
            <div key={cat.title} className={`border rounded-2xl p-6 ${cat.color}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`font-bold text-base ${cat.titleColor}`}>{cat.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.badgeColor}`}>
                  {cat.count} rules
                </span>
              </div>
              <ul className="space-y-2.5">
                {cat.rules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${cat.dotColor}`} />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-50 border rounded-xl p-5 flex items-start gap-3">
          <svg className="w-4 h-4 text-msbon-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">
            Every rule result includes a <strong>status</strong> (PASS / FLAG / UNABLE TO DETERMINE), a <strong>plain-language explanation</strong>, and the <strong>exact source section</strong> of the transcript it was drawn from. No black-box outputs.
          </p>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="bg-msbon-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <p className="text-center text-blue-300 text-xs font-bold uppercase tracking-widest mb-10">
            Built Serverless on AWS — Scalable, Auditable, Cost-Controlled
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((t) => (
              <div key={t.name} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 text-center transition-all cursor-default">
                <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="font-semibold text-xs text-white leading-snug">{t.name}</p>
                <p className="text-[10px] text-blue-300/70 mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-msbon-800 to-msbon-900 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Ready to use
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Verify a Transcript Now
            </h2>
            <p className="text-blue-200 mb-10 max-w-lg mx-auto">
              Upload a nursing school transcript PDF and the full pipeline runs automatically.
              Results are ready for human review in under 90 seconds.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/upload"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-msbon-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl text-sm"
              >
                Upload Transcript
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Advisory outputs only. This system never approves or denies a nursing license.
          All AI findings require human review before any action is taken.
          Developed as part of the Mississippi AI Innovation Hub — a partnership between MS ITS, MAIN, and AWS.
        </p>
      </section>
    </div>
  );
}
