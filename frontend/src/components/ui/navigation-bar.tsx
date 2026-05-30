'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Heart, MessageCircle, User as UserIcon, LogOut, Bell } from 'lucide-react';
import { apiRequest } from '@/services/api/client';
import { getAccessToken } from '@/services/api/storage';
import { useAuth } from '@/store/auth';

const navItems = [
  { id: 'inbox', label: 'Inbox', href: '/chat', icon: MessageCircle },
  { id: 'matches', label: 'Matches', href: '/matches', icon: Heart },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: Bell },
];

export function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasToken = Boolean(getAccessToken());

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: () =>
      apiRequest<{ count: number }>('/api/v1/notifications/count-unread', {
        auth: true,
      }),
    enabled: isAuthenticated && hasToken,
  });

  const { data: unreadMessagesData } = useQuery({
    queryKey: ['notifications', 'messages-count'],
    queryFn: () =>
      apiRequest<{ count: number }>('/api/v1/notifications/unread-messages-count', {
        auth: true,
      }),
    enabled: isAuthenticated && hasToken,
  });

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth');
    setMobileMenuOpen(false);
  };

  const unreadCount = unreadData?.count ?? 0;
  const unreadMessagesCount = unreadMessagesData?.count ?? 0;

  return (
    <>
       {/* Mobile: Bottom tab bar - Part of flex flow */}
       <nav className="border-t border-white/10 bg-[#202C33]/90 backdrop-blur-xl sm:hidden h-[80px] flex-shrink-0">
         <div className="flex h-full items-center justify-around px-4">
           {navItems.map((item) => {
             const Icon = item.icon;
             const isInbox = item.id === 'inbox';
             const badgeValue = isInbox ? unreadMessagesCount : (item.id === 'notifications' ? unreadCount : 0);

             return (
               <Link
                 key={item.id}
                 href={item.href}
                 className={`relative flex size-16 items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 ${pathname === item.href || pathname.startsWith(item.href + '/')
                   ? 'text-[#25D366] scale-120'
                   : 'text-white/60 hover:text-white/80'
                   }`}
               >
                 <Icon className={pathname === item.href || pathname.startsWith(item.href + '/') ? "h-8 w-8 fill-current" : "h-7 w-7"} />
                 {item.id === 'notifications' && unreadCount > 0 ? (
                   <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-[#25D366] ring-2 ring-[#0B141B]" />
                 ) : item.id === 'inbox' && unreadMessagesCount > 0 ? (
                   <span className="absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-[9px] font-black text-black">
                     {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                   </span>
                 ) : null}
               </Link>
             );
           })}
           <button
             onClick={() => user?.username && router.push(`/profile/${user.username}`)}
             className={`flex size-16 items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 ${pathname.startsWith('/profile/')
               ? 'text-[#25D366] scale-120'
               : 'text-white/60 hover:text-white/80'
               }`}
           >
             <UserIcon className={pathname.startsWith('/profile/') ? "h-8 w-8 fill-current" : "h-7 w-7"} />
           </button>
         </div>
       </nav>

       {/* Desktop: Top header - Part of flex flow */}
       <header className="border-b border-white/10 bg-[#202C33]/80 backdrop-blur-md hidden sm:block h-[80px] flex-shrink-0">
         <div className="max-w-6xl mx-auto flex h-full items-center justify-between px-8">
           <Link href="/profile" className="text-2xl font-black tracking-tighter text-white hover:text-[#25D366] transition-colors">
             VibePass
           </Link>

           <nav className="flex flex-wrap items-center justify-center gap-4 flex-1">
             {navItems.map((item) => {
               const Icon = item.icon;
               const isInbox = item.id === 'inbox';
               const badgeValue = isInbox ? unreadMessagesCount : (item.id === 'notifications' ? unreadCount : 0);

               return (
                 <Link
                   key={item.id}
                   href={item.href}
                   className={`inline-flex items-center gap-3 rounded-full px-4 py-3 text-base font-medium transition-all duration-200 hover:scale-105 ${pathname === item.href || pathname.startsWith(item.href + '/')
                     ? 'bg-[rgb(var(--accent-primary))] text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)]'
                     : 'text-[rgb(var(--text-secondary))] hover:bg-white/5 hover:text-white'
                     }`}
                 >
                   <Icon className="h-5 w-5" />
                   <span>{item.label}</span>
                   {item.id === 'notifications' && unreadCount > 0 ? (
                     <span className="h-3 w-3 rounded-full bg-white/40" />
                   ) : item.id === 'inbox' && unreadMessagesCount > 0 ? (
                     <span className="rounded-full bg-white/15 px-3 py-0.5 text-[11px] font-semibold text-white">
                       {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                     </span>
                   ) : null}
                 </Link>
               );
             })}
           </nav>

           <div className="flex items-center gap-5">
             <button
               onClick={handleNotificationClick}
               className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--bg-elevated))] border border-[rgba(var(--border-subtle),0.08)] hover:bg-white/10 transition-colors hover:scale-105"
             >
               <Bell className="h-6 w-6 text-[rgb(var(--text-secondary))]" />
               {unreadCount > 0 ? (
                 <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[rgb(var(--accent-primary))]" />
               ) : null}
             </button>
             <button
               onClick={() => user?.username && router.push(`/profile/${user.username}`)}
               className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--bg-elevated))] border border-[rgba(var(--border-subtle),0.08)] hover:bg-white/10 transition-colors overflow-hidden hover:scale-105"
             >
               <UserIcon className="h-6 w-6 text-[rgb(var(--text-secondary))]" />
             </button>
             <div className="text-base hidden md:block">
               <p className="font-semibold text-white">{user?.nickname || user?.username || 'Guest'}</p>
               <p className="text-[rgb(var(--text-secondary))]">@{user?.username || 'guest'}</p>
             </div>
             <button
               onClick={handleLogout}
               className="inline-flex items-center gap-2.5 rounded-full px-4 py-3 text-sm font-medium text-[rgb(var(--text-secondary))] transition-all duration-200 hover:bg-[rgb(var(--danger),0.15)] hover:text-[rgb(var(--danger))] hover:scale-105"
               title="Sign out"
             >
               <LogOut className="h-5 w-5" />
             </button>
           </div>
         </div>
       </header>

       {/* Mobile user menu dropdown */}
       {mobileMenuOpen && (
         <div className="fixed inset-0 z-50 bg-black/50 sm:hidden" onClick={() => setMobileMenuOpen(false)}>
           <div className="absolute bottom-28 left-8 right-8 bg-[rgb(var(--bg-surface))] border border-[rgba(var(--border-subtle),0.12)] rounded-2xl p-6 shadow-2xl backdrop-blur-md" onClick={e => e.stopPropagation()}>
             <div className="flex items-center gap-5 mb-6 p-4 -m-4 rounded-xl">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--bg-elevated))] border border-[rgba(var(--border-subtle),0.08)] overflow-hidden">
                 <UserIcon className="h-8 w-8 text-[rgb(var(--text-secondary))]" />
               </div>
               <div>
                 <p className="font-semibold text-white text-lg">{user?.nickname || user?.username || 'Guest'}</p>
                 <p className="text-[rgb(var(--text-secondary))] text-base">@{user?.username || 'guest'}</p>
               </div>
             </div>
             <div className="-m-4">
               <Link
                 href="/profile"
                 className="flex w-full items-center gap-5 rounded-xl px-6 py-5 text-left transition hover:bg-white/5"
                 onClick={() => setMobileMenuOpen(false)}
               >
                 <UserIcon className="h-7 w-7 text-[rgb(var(--text-secondary))]" />
                 Profile
               </Link>
             </div>
             <button
               onClick={handleLogout}
               className="mt-4 w-full flex items-center gap-5 rounded-xl px-6 py-5 text-left font-medium text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger),0.1)] transition hover:scale-105"
             >
               <LogOut className="h-7 w-7" />
               Sign out
             </button>
           </div>
         </div>
       )}
    </>
  );
}
