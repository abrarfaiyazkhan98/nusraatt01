import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-soft flex flex-col items-center py-28 text-center">
      <p aria-hidden className="text-6xl">🌷</p>
      <h1 className="mt-6 font-hand text-6xl font-bold">oops, this page wandered off</h1>
      <p className="mt-4 max-w-sm text-cocoa-soft">it might have been moved, or maybe it was never written. let&rsquo;s go somewhere cozy instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          take me home
        </Link>
        <Link href="/diary" className="btn btn-soft">
          read the diary
        </Link>
      </div>
    </div>
  );
}
