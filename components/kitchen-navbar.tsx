"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, LogOut } from "lucide-react";
import { cn } from "@/utils/utils";
import { useAuth } from "@/context/auth-context";
import { PROTECTED_PATHS } from "@/data/path";

const navItems = [
  {
    name: "Kitchen Display",
    href: PROTECTED_PATHS.KITCHEN.INDEX,
    icon: ChefHat,
  },
];

export function KitchenNavbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">Kitchen Display</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <ChefHat className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Kitchen Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
