import Link from 'next/link';

export default function BottomNavigation({ activePage }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t max-w-md mx-auto flex justify-around py-2">
      <Link href="/" className="flex flex-col items-center flex-1">
        <div className={`p-2 rounded-full ${activePage === 'home' ? 'bg-purple-100' : ''}`}>
          <i className="fas fa-home text-black"></i>
        </div>
        <span className="text-xs mt-1 text-black">Home</span>
      </Link>
      <Link href="/insurance" className="flex flex-col items-center flex-1">
        <div className={`p-2 rounded-full ${activePage === 'insurance' ? 'bg-purple-100' : ''}`}>
          <i className="fas fa-shield-alt text-black"></i>
        </div>
        <span className="text-xs mt-1 text-black">Insurance</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center flex-1">
        <div className={`p-2 rounded-full ${activePage === 'profile' ? 'bg-purple-100' : ''}`}>
          <i className="fas fa-user text-black"></i>
        </div>
        <span className="text-xs mt-1 text-black">Profile</span>
      </Link>
    </nav>
  );
} 