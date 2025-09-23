'use client';

import { Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-white shadow-sm p-3 sm:p-4 md:p-6 rounded-lg mb-4 sm:mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">Dashboard</h1>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-800 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}