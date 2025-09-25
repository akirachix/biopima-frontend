
import { Suspense } from 'react';
import SignInPage from './page';

export default function Page({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  return (
    <Suspense fallback="Loading...">
      <SignInPage searchParams={searchParams} />
    </Suspense>
  );
}