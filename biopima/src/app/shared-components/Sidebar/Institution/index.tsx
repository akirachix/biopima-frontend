'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MdDashboard,
  MdDescription,
  MdWarningAmber,
  MdSettings,
} from 'react-icons/md';
import Image from 'next/image';


export default function Sidebar() {
  const pathname = usePathname();
  
  const items = [
    { path: '/institution/dashboard', tag: 'Dashboard', Icon: MdDashboard },
    { path: '/institution/reports', tag: 'Reports', Icon: MdDescription },
    { path: '/institution/alerts', tag: 'Alerts', Icon: MdWarningAmber },
    { path: '/institution/settings', tag: 'Settings', Icon: MdSettings },
  ];

  return (
    <div className="flex flex-col h-screen w-56 bg-[#054511] text-white pl-6 shadow-lg rounded-r-1xl font-poppins relative">
      <div className="flex items-center gap-2 pl-4 mb-10 mt-4 h-20 ml-[-15px]">
        <Image
          src="/Group 156.png"
          alt="BioPima Logo"
          width={56}
          height={64}
          className="object-contain filter brightness-0 invert"
        />
        <div className="font-extrabold text-white select-none mt-10 ml-[-6px] font-serif text-[22px] tracking-[0.03em]">
          BioPima
        </div>
      </div>
      <nav className="flex flex-col gap-6">
        {items.map((item , index) => {
        const isActive = pathname === item.path;
          return (
            <Link
              key={index}
              href={item.path}
              className={`group flex items-center gap-6 px-8 py-4 cursor-pointer select-none transition-all duration-200 ease-in-out rounded-l-full w-[calc(100%+24px)] -ml-6 ${
                isActive
                  ? 'bg-white text-green-900 font-extrabold shadow-lg'
                  : 'text-white hover:bg-green-800/30 hover:text-white'
              }`}
            >
              <item.Icon
                size={24}
                className={`transition-colors duration-200 ${
                  isActive
                    ? 'text-green-900 font-extrabold'
                    : 'text-white group-hover:text-white'
                }`}
              />
              {item.tag}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

