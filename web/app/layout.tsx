import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "elimuMtaani — teach tomorrow's lesson tonight",
  description:
    "From 'what should I teach?' to a delivered, narrated lesson. Teachers get research-grounded term timetables and live lecture sessions; students get self-serve narrated lectures with quizzes, chat and notes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
