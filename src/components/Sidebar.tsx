/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Megaphone, 
  Calendar, 
  HandHeart, 
  Package, 
  ShieldAlert, 
  MessageSquare, 
  Award, 
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  FileCheck,
  UserCheck,
  Building,
  Activity,
  LogOut,
  MapPin,
  X
} from 'lucide-react';

export type ViewType = 
  | 'dashboard'
  | 'warga'
  | 'kk'
  | 'kas'
  | 'iuran'
  | 'pengumuman'
  | 'kegiatan'
  | 'perizinan'
  | 'polling'
  | 'darurat'
  | 'inventaris'
  | 'keamanan'
  | 'saran'
  | 'pengurus'
  | 'pengguna'
  | 'laporan';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onExitApp: () => void;
  unreadSaranCount: number;
  pendingLettersCount: number;
  onClose?: () => void;
}

interface MenuItem {
  id: ViewType | string;
  name: string;
  icon: React.ComponentType<any>;
  subItems?: { id: ViewType; name: string }[];
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  onExitApp,
  unreadSaranCount,
  pendingLettersCount,
  onClose
}: SidebarProps) {
  // Tracking expanded state of dropdowns
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    kependudukan: true,
    keuangan: true,
    layanan: true,
    organisasi: false,
  });

  const toggleExpand = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'kependudukan',
      name: 'Kependudukan',
      icon: Users,
      subItems: [
        { id: 'warga', name: 'Data Warga' },
        { id: 'kk', name: 'Kepala Keluarga (KK)' },
      ]
    },
    {
      id: 'keuangan',
      name: 'Keuangan',
      icon: Wallet,
      subItems: [
        { id: 'kas', name: 'Kas RT' },
        { id: 'iuran', name: 'Iuran Warga' },
      ]
    },
    { id: 'pengumuman', name: 'Pengumuman', icon: Megaphone },
    { id: 'kegiatan', name: 'Kegiatan Warga', icon: Calendar },
    {
      id: 'layanan',
      name: 'Layanan Warga',
      icon: HandHeart,
      subItems: [
        { id: 'perizinan', name: 'Layanan Perizinan' },
        { id: 'polling', name: 'Polling Warga' },
        { id: 'darurat', name: 'Kontak Darurat' },
      ]
    },
    { id: 'inventaris', name: 'Inventaris RT', icon: Package },
    { id: 'keamanan', name: 'Keamanan', icon: ShieldAlert },
    { id: 'saran', name: 'Saran & Masukan', icon: MessageSquare },
    {
      id: 'organisasi',
      name: 'Organisasi',
      icon: Award,
      subItems: [
        { id: 'pengurus', name: 'Pengurus RT' },
        { id: 'pengguna', name: 'Kelola Pengguna' },
      ]
    },
    { id: 'laporan', name: 'Laporan', icon: FileSpreadsheet },
  ];

  // Check if current active path is a child
  const isChildActive = (subItems?: { id: ViewType; name: string }[]) => {
    if (!subItems) return false;
    return subItems.some(item => item.id === currentView);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-slate-300 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-display font-bold text-lg select-none shrink-0 shadow-lg shadow-emerald-600/25">
            R
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display font-bold text-base leading-none text-white tracking-wide truncate">
              Rukunin
            </h2>
            <span className="text-[10px] text-zinc-400 font-medium block mt-1 tracking-wider uppercase font-mono">
              Web RT
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Admin Quick Profile Card */}
      <div className="p-4 mx-3 my-4 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/10">
          RT
        </div>
        <div className="overflow-hidden">
          <span className="text-xs font-semibold text-white truncate block">Pak RT Fauzan</span>
          <span className="text-[10px] text-emerald-400 font-medium flex items-center mt-0.5 font-display">
            <span className="text-emerald-500 mr-1 animate-ping">●</span> RT 04 / RW 12
          </span>
        </div>
      </div>

      <div className="px-4 py-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-display">
          Platform Menu
        </span>
      </div>

      {/* Menus List */}
      <nav className="flex-1 px-2 space-y-1 select-none">
        {menuItems.map(menu => {
          const Icon = menu.icon;
          const isExpandable = !!menu.subItems;
          const isDropdownOpen = expandedMenus[menu.id] || false;
          
          if (isExpandable) {
            const hasActiveChild = isChildActive(menu.subItems);
            
            return (
              <div key={menu.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleExpand(menu.id as string)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    hasActiveChild 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4.5 h-4.5 ${hasActiveChild ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="font-display text-slate-300">{menu.name}</span>
                  </div>
                  {isDropdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="ml-5 pl-3 border-l border-slate-800 space-y-1 py-1">
                    {menu.subItems?.map(sub => {
                      const isActive = currentView === sub.id;
                      
                      // Counter badges
                      let badgeCount = 0;
                      if (sub.id === 'perizinan') badgeCount = pendingLettersCount;
                      if (sub.id === 'saran') badgeCount = unreadSaranCount;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onViewChange(sub.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium font-sans transition-all flex items-center justify-between ${
                            isActive
                              ? 'text-white bg-slate-800 font-semibold border-l-2 border-emerald-500 pl-2'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {badgeCount > 0 && (
                            <span className="ml-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900 animate-pulse">
                              {badgeCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            const isActive = currentView === menu.id;
            let countBadge = 0;
            if (menu.id === 'saran') countBadge = unreadSaranCount;
            if (menu.id === 'pengumuman') {
              // Highlight code of pending items or actions
            }

            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => onViewChange(menu.id as ViewType)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="font-display">{menu.name}</span>
                </div>
                {countBadge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white animate-pulse'}`}>
                    {countBadge}
                  </span>
                )}
              </button>
            );
          }
        })}
      </nav>

      {/* Action footer inside sidebar */}
      <div className="p-4 border-t border-slate-800 space-y-2 mt-auto">
        <div className="text-[10px] text-slate-500 text-center font-mono">
          RUKUNIN V1.2 • JUNI 2026
        </div>
        <button
          type="button"
          onClick={onExitApp}
          className="w-full bg-slate-800 hover:bg-red-950/40 border border-slate-700/80 hover:border-red-900/50 hover:text-red-400 text-slate-300 font-medium py-2 rounded-lg text-xs transition-all flex items-center justify-center space-x-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </aside>
  );
}
