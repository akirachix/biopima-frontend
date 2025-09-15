'use client';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SettingsIcon from '@mui/icons-material/Settings';
const sidebarItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/' },
  { label: 'Reports', icon: DescriptionIcon, path: '/reports' },
  { label: 'Alerts', icon: WarningAmberIcon, path: '/alerts' },
  { label: 'Settings', icon: SettingsIcon, path: '/settings' },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-screen w-56 bg-[#054511] text-white pl-6 shadow-lg rounded-r-1xl font-poppins relative overflow-visible">
      <div className="flex items-center gap-2 pl-4 mb-10 mt-4 h-20 ml-[-15px]">
        <img
          src="/Group 156.png"
          alt="BioPima Logo"
          className="h-16 w-14 object-contain filter brightness-0 invert" 
        />
        <span
          className="font-extrabold text-white select-none mt-10 ml-[-6px]"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '22px',
            letterSpacing: '0.03em',
          }}
        >
          BioPima
        </span>
      </div>
      <nav className="flex flex-col gap-6">
        {sidebarItems.map(({ label, icon: Icon, path }) => (
          <div
            key={label}
            className="flex items-center gap-6 px-8 py-4 cursor-pointer select-none transition-colors rounded-l-full relative z-10
              hover:bg-white hover:text-green-900 hover:font-extrabold"
            style={{ width: 'calc(100% + 24px)', left: '-24px', position: 'relative' }} 
          >
            <Icon fontSize="medium" />
            <span className="text-lg flex-1">{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}