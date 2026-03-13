import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-[14.5px] bg-[#FEF7EA] px-5 py-2.5 text-sm font-medium text-[#1A3C34]">
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              Food Ordering Service
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Where Great Food Meets <span className="italic">Great Taste.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Experience a symphony of flavors crafted with passion. Premium ingredients, exquisite recipes, delivered to your door.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1A3C34] px-6 py-3 text-white hover:bg-[#152d28]"
            >
              View Menu
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="relative flex flex-1 items-center justify-center lg:justify-end">
            <div className="relative h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px] xl:h-[420px] xl:w-[420px]">
              <div className="absolute inset-0 rounded-full bg-[#FEF7EA]" />
              <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-full border-2 border-[#E6E2D8] bg-[#FDF6EA]">
                <div className="h-4/5 w-4/5 rounded-full bg-gradient-to-br from-amber-100 to-orange-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 hidden h-full w-[45%] min-w-[400px] lg:block"
        style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)', backgroundColor: '#FEF7EA' }}
        aria-hidden
      />
    </section>
  );
}
