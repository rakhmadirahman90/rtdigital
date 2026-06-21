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
import LoginView from './components/LoginView';

// Central Constraints Context
import { RTRW_CONTEXT } from './utils/constants';

// Firebase core integration APIs
import { 
  db, 
  syncCollection, 
  saveDocument, 
  deleteDocument, 
  initializeDatabase 
} from './firebase';

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
  const [showLogin, setShowLogin] = useState<boolean>(false);

  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const cached = localStorage.getItem('rukunin_auth_user');
    return cached ? JSON.parse(cached) : null;
  });

  // React State variables - dynamically synced from Firestore db
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [iurans, setIurans] = useState<IuranStatus[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [letters, setLetters] = useState<LetterRequest[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [contacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [borrows, setBorrows] = useState<BorrowRequest[]>([]);
  const [ronda] = useState<RondaSchedule[]>(INITIAL_RONDA);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [suggestions, setSuggestions] = useState<FeedbackSuggestion[]>([]);
  const [managers] = useState<RTManager[]>(INITIAL_MANAGERS);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Persistent User Authentication cached in browser
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rukunin_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rukunin_auth_user');
    }
  }, [currentUser]);

  // DB initialization and real-time listeners subscription
  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase({
          citizens: INITIAL_CITIZENS,
          transactions: INITIAL_TRANSACTIONS,
          iurans: INITIAL_IURAN,
          announcements: INITIAL_ANNOUNCEMENTS,
          events: INITIAL_EVENTS,
          letters: INITIAL_LETTERS,
          polls: INITIAL_POLLS,
          inventory: INITIAL_INVENTORY,
          borrows: INITIAL_BORROWS,
          incidents: [
            {
              id: 'inc1',
              date: '2026-06-18',
              time: '23:30',
              reporterName: 'Andi Hermawan',
              type: 'Orang Mencurigakan',
              description: 'Terdapat orang tidak dikenal berputar di Gang sd 1 mengintai sepeda motor. Telah dihimbau dan pergi meninggalkan wilayah.',
              status: 'Selesai'
            }
          ],
          suggestions: INITIAL_SUGGESTIONS,
          users: INITIAL_USERS
        });
      } catch (err) {
        console.error("Firebase Database bootstrap failed:", err);
      }
    };

    initDb();

    // Subscribe to Firestore collections real-time feeds
    const unsubCitizens = syncCollection<Citizen>('citizens', setCitizens);
    const unsubTransactions = syncCollection<Transaction>('transactions', setTransactions);
    const unsubIurans = syncCollection<IuranStatus>('iurans', setIurans);
    const unsubAnnouncements = syncCollection<Announcement>('announcements', (items) => {
      const sorted = [...items].sort((a, b) => b.id.localeCompare(a.id));
      setAnnouncements(sorted);
    });
    const unsubEvents = syncCollection<CommunityEvent>('events', (items) => {
      const sorted = [...items].sort((a, b) => b.id.localeCompare(a.id));
      setEvents(sorted);
    });
    const unsubLetters = syncCollection<LetterRequest>('letters', (items) => {
      const sorted = [...items].sort((a, b) => b.id.localeCompare(a.id));
      setLetters(sorted);
    });
    const unsubPolls = syncCollection<Poll>('polls', setPolls);
    const unsubInventory = syncCollection<InventoryItem>('inventory', setInventory);
    const unsubBorrows = syncCollection<BorrowRequest>('borrows', (items) => {
      const sorted = [...items].sort((a, b) => b.id.localeCompare(a.id));
      setBorrows(sorted);
    });
    const unsubIncidents = syncCollection<SecurityIncident>('incidents', (items) => {
      const sorted = [...items].sort((a, b) => b.id.localeCompare(a.id));
      setIncidents(sorted);
    });
    const unsubSuggestions = syncCollection<FeedbackSuggestion>('suggestions', (items) => {
      const sorted = [...items].sort((a, b) => b.id.localeCompare(a.id));
      setSuggestions(sorted);
    });
    const unsubUsers = syncCollection<UserAccount>('users', setUsers);

    return () => {
      unsubCitizens();
      unsubTransactions();
      unsubIurans();
      unsubAnnouncements();
      unsubEvents();
      unsubLetters();
      unsubPolls();
      unsubInventory();
      unsubBorrows();
      unsubIncidents();
      unsubSuggestions();
      unsubUsers();
    };
  }, []);

  // STATE OPERATION MUTATORS HANDLERS

  // Citizens and automatic Dues Setup
  // Citizens and automatic Dues Setup
  const handleAddCitizen = async (newC: Omit<Citizen, 'id'>) => {
    const id = 'c-' + Date.now();
    const created: Citizen = { ...newC, id };
    await saveDocument('citizens', created);

    // Setup basic billing info for their Household Block & House Number
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
      await saveDocument('iurans', placeholderBill);
    }
  };

  const handleDeleteCitizen = async (id: string) => {
    await deleteDocument('citizens', id);
  };

  // Transactions Ledger
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    const id = 't-' + Date.now();
    const tx: Transaction = {
      ...newTx,
      id
    };
    await saveDocument('transactions', tx);
  };

  // Citizen dues verification approval
  const handleUpdateIuran = async (updated: IuranStatus) => {
    await saveDocument('iurans', updated);

    // If marked lunas, automatically record it in the Cash Ledger transactions stream!
    if (updated.status === 'Lunas') {
      const exists = transactions.some(t => t.description.includes(`Block ${updated.block} No ${updated.houseNumber}`));
      if (!exists) {
        await handleAddTransaction({
          date: updated.paidDate || new Date().toISOString().split('T')[0],
          type: 'pemasukan',
          amount: updated.amountPaid || 250000,
          description: `Iuran Bulanan KK Blok ${updated.block} No ${updated.houseNumber} (${updated.month})`,
          source: 'Iuran Bulanan',
          category: 'Iuran Warga',
          recordedBy: updated.recordedBy || currentUser?.name || 'Ibu RT'
        });
      }
    }
  };

  // Announcements News
  const handleAddAnnouncement = async (newAnn: Omit<Announcement, 'id'>) => {
    const id = 'ann-' + Date.now();
    const ann = {
      ...newAnn,
      id,
      date: new Date().toISOString().split('T')[0],
      author: currentUser?.name || 'Pengurus RT'
    };
    await saveDocument('announcements', ann);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await deleteDocument('announcements', id);
  };

  // Agenda scheduler
  const handleAddEvent = async (newEvent: Omit<CommunityEvent, 'id'>) => {
    const id = 'e-' + Date.now();
    const created = {
      ...newEvent,
      id,
      participants: 0
    };
    await saveDocument('events', created);
  };

  const handleUpdateEventStatus = async (id: string, status: 'Akan Datang' | 'Selesai' | 'Batal') => {
    const match = events.find(e => e.id === id);
    if (match) {
      await saveDocument('events', { ...match, status });
    }
  };

  // Permits approvals & Rejections
  const handleApproveLetter = async (id: string, letterNum: string) => {
    const match = letters.find(l => l.id === id);
    if (match) {
      await saveDocument('letters', {
        ...match,
        status: 'Disetujui',
        letterNumber: letterNum,
        approvedDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleRejectLetter = async (id: string, reason: string) => {
    const match = letters.find(l => l.id === id);
    if (match) {
      await saveDocument('letters', {
        ...match,
        status: 'Ditolak',
        rejectedReason: reason
      });
    }
  };

  // Pollings & Opinion casts checked against voter duplicate checks
  const handleVotePoll = async (pollId: string, optionId: string, voterName?: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      const voter = voterName || currentUser?.name || 'Warga';
      const votedUserIds = poll.votedUserIds || [];
      if (votedUserIds.includes(voter)) {
        return; // Prevent double ballot casting
      }

      const updatedOptions = poll.options.map(opt => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        return opt;
      });

      await saveDocument('polls', {
        ...poll,
        options: updatedOptions,
        totalVotes: poll.totalVotes + 1,
        votedUserIds: [...votedUserIds, voter]
      });
    }
  };

  const handleCreatePoll = async (poll: Omit<Poll, 'id' | 'totalVotes' | 'votedUserIds'>) => {
    const id = 'p-' + Date.now();
    const created: Poll = {
      ...poll,
      id,
      totalVotes: 0,
      votedUserIds: []
    };
    await saveDocument('polls', created);
  };

  // Asset borrowings logs and Automatic inventory stock adjustments
  const handleAddBorrow = async (newB: Omit<BorrowRequest, 'id'>) => {
    const borrowId = 'b-' + Date.now();
    const created = { ...newB, id: borrowId, status: 'Menunggu' as const };
    await saveDocument('borrows', created);

    // Automatically decrement goodQuantity and increment borrowedQuantity on matching inventory item!
    const item = inventory.find(i => i.name === newB.itemName);
    if (item) {
      await saveDocument('inventory', {
        ...item,
        borrowedQuantity: Math.min(item.totalQuantity, item.borrowedQuantity + newB.quantity)
      });
    }
  };

  const handleUpdateBorrowStatus = async (id: string, status: 'Disetujui' | 'Selesai' | 'Ditolak') => {
    const ticket = borrows.find(b => b.id === id);
    if (ticket) {
      await saveDocument('borrows', { ...ticket, status });

      // If marked "Selesai" (Returned), return the stock balance inside inventory!
      if (status === 'Selesai') {
        const item = inventory.find(i => i.name === ticket.itemName);
        if (item) {
          await saveDocument('inventory', {
            ...item,
            borrowedQuantity: Math.max(0, item.borrowedQuantity - ticket.quantity)
          });
        }
      }
    }
  };

  // Security incidents reports
  const handleAddIncident = async (newInc: Omit<SecurityIncident, 'id' | 'date' | 'time'>) => {
    const incidentId = 'inc-' + Date.now();
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].substring(0, 5);
    const incident: SecurityIncident = {
      ...newInc,
      id: incidentId,
      date,
      time,
      status: 'Investigasi'
    };
    await saveDocument('incidents', incident);
  };

  const handleUpdateIncidentStatus = async (id: string, status: 'Investigasi' | 'Selesai' | 'Darurat') => {
    const match = incidents.find(inc => inc.id === id);
    if (match) {
      await saveDocument('incidents', { ...match, status });
    }
  };

  // Citizens Suggestion box comments response
  const handleReplySuggestion = async (id: string, replyText: string) => {
    const match = suggestions.find(s => s.id === id);
    if (match) {
      await saveDocument('suggestions', {
        ...match,
        reply: replyText,
        status: 'Selesai'
      });
    }
  };

  const handleRegisterUser = async (user: Omit<UserAccount, 'id'>) => {
    const id = 'usr-' + Date.now();
    const newUser: UserAccount = {
      ...user,
      id
    };
    await saveDocument('users', newUser);
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
      
      {showLogin ? (
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowLogin(false);
            if (user.role === 'Warga') {
              setRoleMode('warga');
            } else {
              setRoleMode('admin');
              setCurrentView('dashboard');
            }
          }}
          users={users}
          onRegisterUser={async (name, email, role) => {
            const id = 'usr-' + Date.now();
            const newUser: UserAccount = {
              id,
              name,
              email,
              role,
              isActive: true
            };
            await saveDocument('users', newUser);
            return newUser;
          }}
          onClose={() => setShowLogin(false)}
        />
      ) : roleMode === 'warga' ? (
        /* 2. RENDER THE MARKETING LANDING PAGE WITH DIGITAL SIMULATION PORTAL SUPPORT */
        <LandingPage 
          onEnterApp={() => { 
            if (currentUser && currentUser.role !== 'Warga') {
              setRoleMode('admin');
              setCurrentView('dashboard');
            } else {
              setShowLogin(true);
            }
          }} 
          citizens={citizens}
          announcements={announcements}
          events={events}
          polls={polls}
          onVotePoll={handleVotePoll}
          suggestions={suggestions}
          onSubmitSuggestion={async (newSuggestion) => {
            const id = 's-' + Date.now();
            const suggestion = {
              ...newSuggestion,
              id,
              date: new Date().toISOString().split('T')[0],
              status: 'Belum Dibaca' as const
            };
            await saveDocument('suggestions', suggestion);
          }}
          iurans={iurans}
          onUpdateIuran={handleUpdateIuran}
          onCreateLetterRequest={async (type, purpose, applicant) => {
            const id = 'l-' + Date.now();
            const req = {
              id,
              applicantId: applicant.id,
              applicantName: applicant.name,
              applicantGender: applicant.gender,
              applicantAddress: `Blok ${applicant.block} No. ${applicant.houseNumber}, RT ${RTRW_CONTEXT.RT_PRIMARY}`,
              letterType: type as any,
              purpose: purpose,
              submittedDate: new Date().toISOString().split('T')[0],
              status: 'Menunggu' as const
            };
            await saveDocument('letters', req);
          }}
          letters={letters}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setRoleMode('warga');
          }}
          onLoginClick={() => setShowLogin(true)}
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
                className="p-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
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
              RT {RTRW_CONTEXT.RT_PRIMARY}
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
              currentUser={currentUser}
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
