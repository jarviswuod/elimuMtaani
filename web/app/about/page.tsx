import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = { title: "About — elimuMtaani" };

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight">About elimuMtaani</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Education for the neighbourhood — an AI teaching companion built for Kenya&apos;s
          Competency-Based Curriculum.
        </p>

        <section className="mt-12 space-y-10">
          <div>
            <h2 className="text-2xl font-bold">The problem</h2>
            <p className="mt-2 leading-7">
              Teachers in Kenya&apos;s CBC system often start from home with no ready lesson
              content. The official curriculum designs state <em>outcomes</em> — what learners
              should achieve — but never the content, the plan, or the delivery. Getting from
              &ldquo;what should I teach, and when?&rdquo; to an engaging classroom session is
              hours of unpaid, unsupported work, every single day.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">What elimuMtaani does</h2>
            <ul className="mt-3 space-y-3 leading-7">
              <li>
                <strong>For teachers:</strong> paste one trusted source and get a full term
                timetable, then deliver each day as a narrated slide session with a classroom
                game, a comprehension quiz, and an understanding gate that paces the term to the
                class — not the calendar.
              </li>
              <li>
                <strong>For students:</strong> type any topic and get a narrated lecture with a
                quiz and a chat that answers follow-ups — plus simplified read-only reviews of
                what was taught in class, and a notebook for anything worth keeping.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Our commitments</h2>
            <ul className="mt-3 space-y-3 leading-7">
              <li>
                <strong>Grounded.</strong> Teacher timetables trace back to the source the
                teacher provided — the system never invents curriculum requirements.
              </li>
              <li>
                <strong>Labelled.</strong> Every AI-generated artifact says so, visibly. A
                teacher or student can always tell what the machine wrote.
              </li>
              <li>
                <strong>Private, structurally.</strong> No learner ever logs into anything. No
                individual learner&apos;s score, answer, or identity is captured — the only
                records are the teacher&apos;s own whole-class judgments. Classroom games are
                chalk, teams, and physical space, never a screen in a child&apos;s hand.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">How it&apos;s built</h2>
            <p className="mt-2 leading-7">
              Next.js and Convex, with Claude as the teaching engine and Clerk for teacher and
              student accounts. The architecture, decisions, risks, and sprint history live as
              version-controlled planning documents in the repository — the product is built the
              way we&apos;d want our own lessons planned: written down, reviewed, and honest
              about what&apos;s left.
            </p>
          </div>
        </section>

        <div className="mt-14 flex gap-4">
          <Link
            href="/#demo"
            className="min-h-12 cursor-pointer rounded-full bg-primary px-8 py-3 font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Try the demo
          </Link>
          <Link
            href="/sign-up"
            className="min-h-12 rounded-full border border-border bg-card px-8 py-3 font-bold transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Create an account
          </Link>
        </div>
      </main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6">
          &copy; 2026 elimuMtaani — education for the neighbourhood. Made in Kenya for CBC
          classrooms.
        </div>
      </footer>
    </div>
  );
}
