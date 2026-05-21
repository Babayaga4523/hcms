"use client";

import * as React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.363 3.364a9 9 0 1013.536 9 9 0 01-3.536-9m.536-9-9-9m-9 9h9m-1.5-1.5m1.5 1.5h3m-3-3l-1.5 1.5m1.5-1.5m-1.5 1.5H13a2 2 0 012 2v2a2 2 0 01-2 2v-2m0 0v-2a2 2 0 012-2h-2m0 0a2 2 0 012-2v-2m5 8l5-5m-5 5l5-5"
                />
              </svg>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Terjadi Kesalahan
              </h1>
              <p className="text-gray-500 mb-6">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi tim support jika masalah berlanjut.
              </p>

              {/* Error Code */}
              {error.digest && (
                <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 text-left">
                  <p className="text-xs text-gray-400 font-mono">
                    Error ID: {error.digest}
                  </p>
                </div>
              )}

              {/* Toggle Details */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-400 hover:text-gray-600 mb-4"
              >
                {showDetails ? "Sembunyikan detail" : "Tampilkan detail"}
              </button>

              {/* Error Stack */}
              {showDetails && error.stack && (
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-left text-xs overflow-auto max-h-40 mb-6">
                  <code>{error.message}{"\n"}{error.stack}</code>
                </pre>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={reset}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Coba Lagi
                </button>
                <a
                  href="/"
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Kembali ke Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
