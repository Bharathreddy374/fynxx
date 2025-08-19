// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-lavender to-white">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-6xl md:text-8xl font-heading text-blueberry">
          Fynxx
        </h1>
        <p className="max-w-2xl text-lg md:text-xl font-subheading text-slate-700">
          Where Influence Meets Opportunity. The ultimate platform for creators and brands to connect, collaborate, and grow.
        </p>
        <div className="mt-4">
           <Link href="/register">
              <button
                className="
                  px-8 py-3 rounded-full
                  font-heading text-lg tracking-wider
                  bg-strawberry text-white
                  hover:bg-strawberry/90
                  animate-flicker
                  shadow-lg shadow-strawberry/50
                  transition-all duration-300
                  hover:shadow-xl hover:scale-105
                "
              >
                Join Now
              </button>
            </Link>
        </div>
      </div>
    </main>
  );
}