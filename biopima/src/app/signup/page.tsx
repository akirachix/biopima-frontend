
import { Suspense } from 'react';
import SignupForm from './signup';

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    }>
      <SignupForm searchParams={searchParams} />
    </Suspense>
  );
}