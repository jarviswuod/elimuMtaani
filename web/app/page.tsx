import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

/* ─── Inline SVG icons (Lucide outlines — no emoji, no icon packs) ─── */

function IconSearch({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconCalendar({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconPresentation({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}

function IconCheckCircle({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function IconTrophy({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21 1.18.54 2.03 2.03 2.03 3.79" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconSparkles({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3ZM5 3v4M19 17v4M3 5h4M17 19h4" />
    </svg>
  );
}

function IconPlay({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7Z" />
    </svg>
  );
}

function IconArrowRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ─── Page ─── */

const teacherSteps = [
  {
    icon: IconSearch,
    title: "Research one real source",
    body: "Paste curriculum text, a KICD design, or a YouTube link. elimuMtaani grounds everything it generates in your source — and says so.",
  },
  {
    icon: IconCalendar,
    title: "Get your term timetable",
    body: "A full weeks-by-days breakdown for your grade, subject and term — what to teach, in what order, generated in one pass.",
  },
  {
    icon: IconPresentation,
    title: "Deliver narrated sessions",
    body: "Open any day and teach with auto-generated narrated slides. Engaging, visual, and ready when you are.",
  },
  {
    icon: IconCheckCircle,
    title: "Check understanding, adapt",
    body: "A quick post-session quiz flags topics to revisit — and can merge them into tomorrow's lesson automatically.",
  },
];

const studentFeatures = [
  {
    title: "Learn anything, narrated",
    body: "Type any topic and get a spoken slide lecture with visuals — not a wall of text.",
  },
  {
    title: "Ask until it clicks",
    body: "Every lecture has its own chat. Ask follow-up questions in context, as many as you need.",
  },
  {
    title: "Catch up on class",
    body: "Missed a lesson? Review what your teacher delivered, simplified for revision.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
          <Link href="/" className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <IconSparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              elimu<span className="text-primary">Mtaani</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Get started
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/onboarding"
                className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Open app
              </Link>
              <UserButton />
            </Show>
          </div>
        </nav>
      </header>

      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="rise mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-primary">
              <IconSparkles className="h-4 w-4" />
              Built for Kenya&apos;s CBC classrooms
            </p>
            <h1 className="rise rise-1 mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              From <span className="text-primary">&ldquo;what do I teach?&rdquo;</span> to a delivered lesson.
            </h1>
            <p className="rise rise-2 mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              elimuMtaani turns one research source into a full term timetable, then delivers each day as an
              engaging narrated slide session — while students explore any topic on their own, with quizzes
              and chat that actually explain.
            </p>
            <div className="rise rise-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/onboarding"
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
              >
                Start as a teacher
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-card px-8 text-base font-semibold text-foreground transition-all duration-200 hover:border-secondary hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
              >
                Explore as a student
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free during beta · Google sign-in · All AI content clearly labelled
            </p>
          </div>

          {/* Product mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/10 sm:p-3">
              <div className="rounded-xl bg-foreground p-4 sm:p-6">
                {/* Slide */}
                <div className="rounded-lg bg-card p-5 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Grade 8 · Integrated Science · Week 3, Tuesday
                    </p>
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      AI-generated
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold sm:text-2xl">The Water Cycle: Evaporation</h2>
                  <ul className="mt-4 space-y-2.5 text-sm leading-6 text-muted-foreground sm:text-base">
                    <li className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      The sun heats water in lakes, rivers and Lake Victoria — turning it into vapour.
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Warm air rises, carrying the vapour up to form clouds.
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      This is why mornings by the lake feel humid before the rains.
                    </li>
                  </ul>
                </div>
                {/* Player bar */}
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-card/10 px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary" aria-hidden="true">
                    <IconPlay className="h-4 w-4" />
                  </span>
                  <div className="flex items-center gap-1" aria-hidden="true">
                    <span className="typing-dot h-2 w-2 rounded-full bg-secondary" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-secondary" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-secondary" />
                  </div>
                  <p className="truncate text-sm text-card">Narrating slide 2 of 7&hellip;</p>
                  <p className="ml-auto hidden text-xs text-card/70 sm:block">Quiz after this session</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teacher flow */}
        <section className="border-t border-border bg-card" aria-labelledby="teachers-heading">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-accent">For teachers</p>
              <h2 id="teachers-heading" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your whole term, planned and deliverable
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Start from home with nothing but a source you trust. Walk into class with a narrated session
                ready to go.
              </p>
            </div>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teacherSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="group rounded-2xl border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-secondary hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
                      <step.icon />
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border bg-background p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <IconTrophy />
              </span>
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-bold text-foreground">Friendly competition, honest teaching.</span>{" "}
                A leaderboard ranks teachers on sessions delivered and class understanding — recovering a
                tough lesson scores more than pretending it went well.
              </p>
            </div>
          </div>
        </section>

        {/* Student features */}
        <section aria-labelledby="students-heading">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-accent">For students</p>
              <h2 id="students-heading" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                A lecture on anything, whenever you need it
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {studentFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-secondary hover:shadow-lg hover:shadow-primary/10"
                >
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-t border-border bg-card" aria-labelledby="trust-heading">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
            <h2 id="trust-heading" className="sr-only">
              Our commitments
            </h2>
            <div className="grid gap-8 text-center sm:grid-cols-3">
              <div>
                <p className="text-2xl font-extrabold text-primary">Grounded</p>
                <p className="mt-1 text-sm text-muted-foreground">Timetables trace back to the source you gave us</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">Labelled</p>
                <p className="mt-1 text-sm text-muted-foreground">Every AI-generated section says so, visibly</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">Private</p>
                <p className="mt-1 text-sm text-muted-foreground">No learner records — just your Google sign-in</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section aria-labelledby="cta-heading">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="rounded-3xl bg-foreground px-6 py-14 text-center sm:px-12">
              <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight text-card sm:text-4xl">
                Teach tomorrow&apos;s lesson tonight.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-card/70">
                Join the beta and turn one source into a term of engaging, narrated lessons.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-secondary hover:text-on-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:w-auto"
                >
                  Get started free
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 elimuMtaani — education for the neighbourhood.
          </p>
          <p className="text-sm text-muted-foreground">Made in Kenya for CBC classrooms.</p>
        </div>
      </footer>
    </div>
  );
}
