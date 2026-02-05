import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / Title */}
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Realtime<span className="text-blue-600">Map</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-6 md:flex">
          <Link href="/map" className="text-gray-600 hover:text-blue-600 transition">
            Map
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-600 transition">
            Products
          </Link>
          <Link href="/availability" className="text-gray-600 hover:text-blue-600 transition">
            Availability
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">
            About
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/map"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          View Live Map
        </Link>
      </div>
    </header>
  );
}
