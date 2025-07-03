"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">You&apos;re Offline</h1>
        <p className="text-gray-600 mb-4">Check your internet connection</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
