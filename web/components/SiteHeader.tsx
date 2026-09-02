import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-lg font-bold text-on-primary">
        e
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        elimu<span className="text-accent">Mtaani</span>
      </span>
    </Link>
  );
}

/** Shared marketing header: landing, /about, /onboarding (US-30/37). */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Logo />
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/about"
            className="rounded-full px-3 py-2 text-sm font-bold text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            About
          </Link>
          <Link
            href="/#demo"
            className="hidden rounded-full px-3 py-2 text-sm font-bold text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:block"
          >
            Try the demo
          </Link>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="hidden rounded-full px-3 py-2 text-sm font-bold text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Get started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/onboarding"
              className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Open app
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
