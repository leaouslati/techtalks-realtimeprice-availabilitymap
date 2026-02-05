export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Realtime<span className="text-blue-600">Map</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Track real-time prices and availability across locations with
              accurate, live data.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">Documentation</li>
              <li className="hover:text-blue-600 cursor-pointer">API</li>
              <li className="hover:text-blue-600 cursor-pointer">GitHub</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RealtimeMap. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
