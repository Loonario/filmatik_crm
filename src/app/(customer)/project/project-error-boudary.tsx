'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ProjectErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Project page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <div className="mt-4 space-x-4">
          <button onClick={() => reset()}>Try again</button>
          <button onClick={() => router.push('/')}>Return home</button>
        </div>
      </div>
    </div>
  );
}