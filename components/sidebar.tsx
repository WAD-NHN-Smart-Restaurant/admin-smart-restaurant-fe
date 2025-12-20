"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { ShoppingBag, Users, LogOut, Menu, X, ForkKnife } from "lucide-react";
import { PATHS } from "@/data/path";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
    badge: 5,
  },
  {
    title: "Tables",
    href: PATHS.TABLES.INDEX,
    icon: <Users className="h-5 w-5" />,
  },
];

interface SidebarContentProps {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
  isLogoutLoading: boolean;
}

function SidebarContent({
  pathname,
  onClose,
  onLogout,
  isLogoutLoading,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
        <div className="flex items-center gap-2">
          <ForkKnife className="h-6 w-6 text-white" />
          <span className="text-xl font-bold">Smart Restaurant</span>
        </div>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-gray-400"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-800 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-800 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-bold">
            JD
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">John Doe</div>
            <div className="text-xs text-gray-400">Restaurant Admin</div>
          </div>
        </div>
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          disabled={isLogoutLoading}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          {isLogoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, isLogoutLoading } = useAuth();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-8 left-4 z-50 lg:hidden bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col bg-gray-900 text-white">
        <SidebarContent
          pathname={pathname}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={logout}
          isLogoutLoading={isLogoutLoading}
        />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-gray-900 text-white lg:hidden">
            <SidebarContent
              pathname={pathname}
              onClose={() => setIsMobileMenuOpen(false)}
              onLogout={logout}
              isLogoutLoading={isLogoutLoading}
            />
          </div>
        </>
      )}
    </>
  );
}
