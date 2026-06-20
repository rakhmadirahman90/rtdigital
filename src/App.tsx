/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Eye, Settings, HelpCircle, Users, ExternalLink, Menu } from 'lucide-react';

// Subcomponents
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import KependudukanView from './components/KependudukanView';
import KeuanganView from './components/KeuanganView';
import LayananView from './components/LayananView';
import PengumumanView from './components/PengumumanView';
import KegiatanView from './components/KegiatanView';
import InventarisKeamananView from './components/InventarisKeamananView';
import OrganisasiView from './components/OrganisasiView';
import LaporanView from './components/LaporanView';

// Original Mock Databases
import {
  INITIAL_CITIZENS,
  INITIAL_TRANSACTIONS,
  INITIAL_IURAN,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_LETTERS,
  INITIAL_POLLS,
  INITIAL_CONTACTS,
  INITIAL_INVENTORY,
  INITIAL_BORROWS,
  INITIAL_RONDA,
  INITIAL_SUGGESTIONS,
  INITIAL_MANAGERS,
  INITIAL_USERS
} from './utils/mockData';

import {
  Citizen,
  Transaction,
  IuranStatus,
  Announcement,
  CommunityEvent,
  LetterRequest,
  Poll,
  EmergencyContact,
  InventoryItem,
  BorrowRequest,
  RondaSchedule,
  SecurityIncident,
  FeedbackSuggestion,
  RTManager,
  UserAccount
} from './types';

export default function App() {
  // Navigation Role & view states
  const [roleMode, setRoleMode] = useState<'warga' | 'admin'>('warga'); // Primary Router Mode selector
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // React State variables - hydrated from localStorage as fallbacks
  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    const s = localStorage.getItem('rukunin_citizens');
    return s ? JSON.parse(s) : INITIAL_CITIZENS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const s = localStorage.getItem('rukunin_transactions');
    return s ? JSON.parse(s) : INITIAL_TRANSACTIONS;
  });

  const [iurans, setIurans] = useState<IuranStatus[]>(() => {
    const s = localStorage.getItem('rukunin_iurans');
    return s ? JSON.parse(s) : INITIAL_IURAN;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const s = localStorage.getItem('rukunin_announcements');
    return s ? JSON.parse(s) : INITIAL_ANNOUNCEMENTS;
  });

  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    const s = localStorage.getItem('rukunin_events');
    return s ? JSON.parse(s) : INITIAL_EVENTS;
  });

  const [letters, setLetters] = useState<LetterRequest[]>(() => {
    const s = localStorage.getItem('rukunin_letters');
    return s ? JSON.parse(s) : INITIAL_LETTERS;
  });

  const [polls, setPolls] = useState<Poll[]>(() => {
    const s = localStorage.getItem('rukunin_polls');
    return s ? JSON.parse(s) : INITIAL_POLLS;
  });

  const [contacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const s = localStorage.getItem('rukunin_inventory');
    return s ? JSON.parse(s) : INITIAL_INVENTORY;
  });

  const [borrows, setBorrows] = useState<BorrowRequest[]>(() => {
    const s = localStorage.getItem('rukunin_borrows');
    return s ? JSON.parse(s) : INITIAL_BORROWS;
  });

  const [ronda] = useState<RondaSchedule[]>(INITIAL_RONDA);

  const [incidents, setIncidents] = useState<SecurityIncident[]>(() => {
    const s = localStorage.getItem('rukunin_incidents');
    // Seed standard mock incident if empty
    return s ? JSON.parse(s) : [
      {
        id: 'inc1',
        date: '2026-06-18',
        time: '23:30',
        reporterName: 'Andi Hermawan',
        type: 'Orang Mencurigakan',
        description: 'Terdapat orang tidak dikenal berputar di Gang sd 1 mengintai sepeda motor. Telah dihimbau dan pergi meninggalkan wilayah.',
        status: 'Selesai'
      }
    ];
  });

  const [suggestions, setSuggestions] = useState<FeedbackSuggestion[]>(() => {
    const s = localStorage.getItem('rukunin_suggestions');
    return s ? JSON.parse(s) : INITIAL_SUGGESTIONS;
  });

  const [managers] = useState<RTManager[]>(INITIAL_MANAGERS);
  const [users] = useState<UserAccount[]>(INITIAL_USERS);

  // Auto-serialization Monitors to keep local storage completely safe
  useEffect(() => {
    localStorage.setItem('rukunin_citizens', JSON.stringify(citizens));
  }, [citizens]);

  useEffect(() => {
    localStorage.setItem('rukunin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('rukunin_iurans', JSON.stringify(iurans));
  }, [iurans]);

  useEffect(() => {
    localStorage.setItem('rukunin_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('rukunin_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('rukunin_letters', JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem('rukunin_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('rukunin_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('rukunin_borrows', JSON.stringify(borrows));
  }, [borrows]);

  useEffect(() => {
    localStorage.setItem('rukunin_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('rukunin_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);


  // STATE OPERATION MUTATORS HANDLERS

  // Citizens and automatic Dues Setup
  const handleAddCitizen = (newC: Omit<Citizen, 'id'>) => {
    const newId = 'c-' + Date.now();
    const created: Citizen = { ...newC, id: newId };
    setCitizens(prev => [...prev, created]);

    // Setup basic billing for their Household Block & House Number
    const billsForHome = iurans.filter(i => i.block === newC.block && i.houseNumber === newC.houseNumber);
    if (billsForHome.length === 0) {
      const billId = `i-${newC.block.replace(/\s+/g, '')}-${newC.houseNumber}-2026-06`;
      const placeholderBill: IuranStatus = {
        id: billId,
        block: newC.block,
        houseNumber: newC.houseNumber,
        month: '2026-06',
        amountPaid: 0,
        status: 'Belum Bayar'
      };
      setIurans(prev => [...prev, placeholderBill]);
    }
  };

  const handleDeleteCitizen = (id: string) => {
    setCitizens(prev => prev.filter(c => c.id !== id));
  };

  // Transactions Ledger
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: 't-' + Date.now()
    };
    setTransactions(prev => [...prev, tx]);
  };

  // Citizen dues verification approval
  const handleUpdateIuran = (updated: IuranStatus) => {
    setIurans(prev => prev.map(i => i.id === updated.id ? updated : i));

    // If marked lunas, automatically record it in the Cash Ledger transactions stream!
    if (updated.status === 'Lunas') {
      const exists = transactions.some(t => t.description.includes(`Block ${updated.block} No ${updated.houseNumber}`));
      if (!exists) {
        handleAddTransaction({
          date: updated.paidDate || new Date().toISOString().split('T')[0],
          type: 'pemasukan',
          amount: updated.amountPaid || 250000,
          description: `Iuran Bulanan KK Blok ${updated.block} No ${updated.houseNumber} (${updated.month})`,
          source: 'Iuran Bulanan',
          category: 'Iuran Warga',
          recordedBy: updated.recordedBy || 'Ibu RT'
        });
      }
    }
  };

  // Announcements News
  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id'>) => {
    setAnnouncements(prev => [
      {
        ...newAnn,
        id: 'a-' + Date.now()
      },
      ...prev
    ]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Agenda scheduler
  const handleAddEvent = (newEvent: Omit<CommunityEvent, 'id'>) => {
    setEvents(prev => [
      {
        ...newEvent,
        id: 'e-' + Date.now()
      },
      ...prev
    ]);
  };

  const handleUpdateEventStatus = (id: string, status: 'Akan Datang' | 'Selesai' | 'Batal') => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  // Permits approvals & Rejections
  const handleApproveLetter = (id: string, letterNum: string) => {
    setLetters(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'Disetujui',
          letterNumber: letterNum,
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return l;
    }));
  };

  const handleRejectLetter = (id: string, reason: string) => {
    setLetters(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'Ditolak',
          rejectedReason: reason
        };
      }
      return l;
    }));
  };

  // Pollings & Opinion casts
  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(pol => {
      if (pol.id === pollId) {
        const updatedOptions = pol.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        return {
          ...pol,
          options: updatedOptions,
          totalVotes: pol.totalVotes + 1
        };
      }
      return pol;
    }));
  };

  const handleCreatePoll = (poll: Omit<Poll, 'id' | 'totalVotes' | 'votedUserIds'>) => {
    setPolls(prev => [
      {
        ...poll,
        id: 'p-' + Date.now(),
        totalVotes: 0,
        votedUserIds: []
      },
      ...prev
    ]);
  };

  // Asset borrowings logs and Automatic inventory stock adjustments
  const handleAddBorrow = (newB: Omit<BorrowRequest, 'id'>) => {
    const borrowId = 'b-' + Date.now();
    setBorrows(prev => [
      { ...newB, id: borrowId },
      ...prev
    ]);

    // Automatically decrement goodQuantity and increment borrowedQuantity on matching inventory item!
    setInventory(prev => prev.map(item => {
      if (item.name === newB.itemName) {
        return {
          ...item,
          borrowedQuantity: Math.min(item.totalQuantity, item.borrowedQuantity + newB.quantity)
        };
      }
      return item;
    }));
  };

  const handleUpdateBorrowStatus = (id: string, status: 'Disetujui' | 'Selesai' | 'Ditolak') => {
    setBorrows(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    // If marked "Selesai" (Returned), return the stock balance inside inventory!
    if (status === 'Selesai') {
      const ticket = borrows.find(b => b.id === id);
      if (ticket) {
        setInventory(prev => prev.map(item => {
          if (item.name === ticket.itemName) {
            return {
              ...item,
              borrowedQuantity: Math.max(0, item.borrowedQuantity - ticket.quantity)
            };
          }
          return item;
        }));
      }
    }
  };

  // Security incidents reports
  const handleAddIncident = (newInc: Omit<SecurityIncident, 'id' | 'date' | 'time'>) => {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].substring(0, 5);
    setIncidents(prev => [
      {
        ...newInc,
        id: 'inc-' + Date.now(),
        date,
        time
      },
      ...prev
    ]);
  };

  const handleUpdateIncidentStatus = (id: string, status: 'Investigasi' | 'Selesai' | 'Darurat') => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  // Citizens Suggestion box comments response
  const handleReplySuggestion = (id: string, replyText: string) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          reply: replyText,
          status: 'Selesai'
        };
      }
      return s;
    }));
  };


  // CONDITIONAL ROUTER VIEW RENDER PANEL
  const renderSelectedSubview = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            citizens={citizens}
            transactions={transactions}
            announcements={announcements}
            events={events}
            letters={letters}
            onAddCitizen={handleAddCitizen}
            onDeleteCitizen={handleDeleteCitizen}
            onViewChange={setCurrentView}
          />
        );
      
      case 'warga':
      case 'kk':
        return (
          <KependudukanView
            citizens={citizens}
            onAddCitizen={handleAddCitizen}
            onDeleteCitizen={handleDeleteCitizen}
          />
        );

      case 'kas':
      case 'iuran':
        return (
          <KeuanganView
            transactions={transactions}
            iurans={iurans}
            citizens={citizens}
            onAddTransaction={handleAddTransaction}
            onUpdateIuran={handleUpdateIuran}
          />
        );

      case 'pengumuman':
        return (
          <PengumumanView
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );

      case 'kegiatan':
        return (
          <KegiatanView
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEventStatus={handleUpdateEventStatus}
          />
        );

      case 'perizinan':
      case 'polling':
      case 'darurat':
        return (
          <LayananView
            letters={letters}
            polls={polls}
            contacts={contacts}
            onApproveLetter={handleApproveLetter}
            onRejectLetter={handleRejectLetter}
            onVotePoll={handleVotePoll}
            onCreatePoll={handleCreatePoll}
          />
        );

      case 'inventaris':
      case 'keamanan':
      case 'saran':
        return (
          <InventarisKeamananView
            inventory={inventory}
            borrows={borrows}
            ronda={ronda}
            incidents={incidents}
            suggestions={suggestions}
            citizens={citizens}
            onAddBorrow={handleAddBorrow}
            onUpdateBorrowStatus={handleUpdateBorrowStatus}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onReplySuggestion={handleReplySuggestion}
          />
        );

      case 'pengurus':
      case 'pengguna':
        return (
          <OrganisasiView
            managers={managers}
            users={users}
          />
        );

      case 'laporan':
        return (
          <LaporanView
            citizens={citizens}
            transactions={transactions}
            iurans={iurans}
          />
        );

      default:
        return (
          <div className="p-8 text-center text-slate-500 font-sans">
            Under construction.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-55 flex flex-col font-sans">
      
      {/* 1. DEMO ROLE SELECTOR VIEW PORTAL RUNTIME BANNER (Print: hidden) */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-2.5 flex flex-col sm:flex-row justify-between items-center text-xs space-y-2 sm:space-y-0 select-none print:hidden shadow-md">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          <span className="font-semibold text-slate-100 font-display">SIMULASI LIVE DEMO:</span>
          <span className="text-[11px] text-slate-400">Rukunin Sistem Kelola RT Digital — Jagakarsa RT 04 / RW 12</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setRoleMode('warga')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              roleMode === 'warga'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-350'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tampilan Warga (Landing Page)</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleMode('admin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              roleMode === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-350'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Control Panel (Web RT)</span>
          </button>
        </div>
      </div>

      {roleMode === 'warga' ? (
        /* 2. RENDER THE MARKETING LANDING PAGE WITH DIGITAL SIMULATION PORTAL SUPPORT */
        <LandingPage 
          onEnterApp={() => { 
            setRoleMode('admin'); 
            setCurrentView('dashboard'); 
          }} 
          citizens={citizens}
          announcements={announcements}
          events={events}
          polls={polls}
          onVotePoll={handleVotePoll}
          suggestions={suggestions}
          onSubmitSuggestion={(newSuggestion) => {
            const suggestion = {
              ...newSuggestion,
              id: 's-' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              status: 'Belum Dibaca' as const
            };
            setSuggestions(prev => [suggestion, ...prev]);
          }}
          iurans={iurans}
          onUpdateIuran={handleUpdateIuran}
          onCreateLetterRequest={(type, purpose, applicant) => {
            setLetters(prev => [
              {
                id: 'l-' + Date.now(),
                applicantId: applicant.id,
                applicantName: applicant.name,
                applicantGender: applicant.gender,
                applicantAddress: `Blok ${applicant.block} No. ${applicant.houseNumber}, RT 04`,
                letterType: type as any,
                purpose: purpose,
                submittedDate: new Date().toISOString().split('T')[0],
                status: 'Menunggu'
              },
              ...prev
            ]);
          }}
          letters={letters}
        />
      ) : (
        /* 3. RENDER THE COMPREHENSIVE ADMIN BACK-OFFICE PLATFORM (Responsive Sidebar & Content Layout) */
        <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-screen relative">
          
          {/* Mobile top header view for admin mode */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 print:hidden shadow-sm">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 px-2 bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <span className="font-semibold text-sm tracking-wide font-display">Rukunin</span>
              </div>
            </div>
            
            <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wide">
              RT 04
            </div>
          </div>

          {/* Mobile backdrop slide-over menu overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Drawer Wrapper for Mobile & Sticky sidebar for Desktop */}
          <div className={`
            fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 h-screen shrink-0
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <Sidebar
              currentView={currentView as any}
              onViewChange={(view) => {
                setCurrentView(view as any);
                setMobileMenuOpen(false); // Auto-dismiss on navigation in mobile
              }}
              unreadSaranCount={suggestions.filter(s => s.status === 'Belum Dibaca').length}
              pendingLettersCount={letters.filter(l => l.status === 'Menunggu').length}
              onExitApp={() => {
                setRoleMode('warga');
                setMobileMenuOpen(false);
              }}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>

          {/* Primary View Main Port */}
          <main className="flex-1 overflow-x-hidden flex flex-col bg-slate-50 print:bg-white pb-16 min-w-0">
            {renderSelectedSubview()}
          </main>
        </div>
      )}
    </div>
  );
}
