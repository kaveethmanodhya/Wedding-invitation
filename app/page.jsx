import Link from 'next/link';
import { redirect } from 'next/navigation';

/** 
 * Root landing page: 
 * Redirect to a default slug (e.g., 'wedding') or show a general landing. 
 */
export default function Home() {
  // Option 1: Redirect to a default slug for testing
  // redirect('/wedding');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-serif text-slate-800 mb-4">Wedding Invitations Platform</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Welcome! Please use your unique direct link to view your invitation, 
        or visit the admin dashboard to manage your event.
      </p>
      <div className="flex gap-4">
        <Link href="/admin" className="px-6 py-3 bg-[#C9956A] text-white rounded-lg font-bold uppercase text-sm shadow-lg">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

