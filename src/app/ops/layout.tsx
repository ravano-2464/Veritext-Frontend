'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useOpsStore } from '@/lib/ops-mock-data';
import { StatusBadge } from '@/components/ops/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Activity,
  AlertTriangle,
  Database,
  FileCode,
  HardDrive,
  Home,
  Menu,
  Cpu,
  Layers,
  Terminal as TerminalIcon,
  RefreshCw,
  LogOut as LogOutIcon,
  Server,
  User,
} from 'lucide-react';

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeVariant?: 'error' | 'warning' | 'info';
}

interface SidebarGroup {
  title: string;
  items: SidebarNavItem[];
}

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const environment = useOpsStore((state) => state.environment);
  const setEnvironment = useOpsStore((state) => state.setEnvironment);
  const systemStatus = useOpsStore((state) => state.systemStatus);
  const lastUpdated = useOpsStore((state) => state.lastUpdated);
  const isSidebarCollapsed = useOpsStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useOpsStore((state) => state.setSidebarCollapsed);
  const manualRefresh = useOpsStore((state) => state.manualRefresh);
  const activeAlertsCount = useOpsStore(
    (state) => state.alerts.filter((a) => a.status === 'FIRING').length,
  );
  const failedJobsCount = useOpsStore((state) => state.failedJobsList.length);
  const activeJobsCount = useOpsStore((state) => state.activeJobsList.length);

  const [timeAgo, setTimeAgo] = React.useState('Just now');

  React.useEffect(() => {
    const metricsInterval = setInterval(() => {
      useOpsStore.getState().tickMetrics();
    }, 5000);

    const queuesInterval = setInterval(() => {
      useOpsStore.getState().tickQueues();
    }, 10000);

    const logsInterval = setInterval(() => {
      useOpsStore.getState().tickLogs();
    }, 2000);

    const healthInterval = setInterval(() => {
      useOpsStore.getState().tickHealth();
    }, 30000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(queuesInterval);
      clearInterval(logsInterval);
      clearInterval(healthInterval);
    };
  }, []);

  React.useEffect(() => {
    const updateTimeAgo = () => {
      const diffMs = new Date().getTime() - lastUpdated.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 5) setTimeAgo('Just now');
      else setTimeAgo(`${diffSec}s ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  React.useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true');

      if (isInputFocused) return;

      keysPressed[e.key.toLowerCase()] = true;

      if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        manualRefresh();
        return;
      }

      if (keysPressed['g']) {
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          router.push('/ops');
        } else if (e.key.toLowerCase() === 'q') {
          e.preventDefault();
          router.push('/ops/queues');
        } else if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          router.push('/ops/logs/live');
        } else if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          router.push('/ops/alerts');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      delete keysPressed[e.key.toLowerCase()];
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [router, manualRefresh]);

  const sidebarGroups: SidebarGroup[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/ops', icon: Home },
        { label: 'System Health', href: '/ops/health', icon: Activity },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Queue Monitor', href: '/ops/queues', icon: Layers },
        { label: 'Worker Status', href: '/ops/queues#workers-table', icon: Cpu },
      ],
    },
    {
      title: 'Data',
      items: [
        { label: 'Database', href: '/ops/database', icon: Database },
        { label: 'Redis', href: '/ops/redis', icon: HardDrive },
      ],
    },
    {
      title: 'Jobs',
      items: [
        {
          label: 'Active Jobs',
          href: '/ops/jobs/active',
          icon: FileCode,
          badge: activeJobsCount,
          badgeVariant: 'info',
        },
        { label: 'Job History', href: '/ops/jobs/history', icon: FileCode },
        {
          label: 'Failed Jobs',
          href: '/ops/jobs/failed',
          icon: FileCode,
          badge: failedJobsCount,
          badgeVariant: 'error',
        },
      ],
    },
    {
      title: 'Logs',
      items: [
        { label: 'Live Logs', href: '/ops/logs/live', icon: TerminalIcon },
        { label: 'Error Logs', href: '/ops/logs/errors', icon: TerminalIcon },
        { label: 'Audit Logs', href: '/ops/logs/audit', icon: TerminalIcon },
      ],
    },
    {
      title: 'Alerts',
      items: [
        {
          label: 'Active Alerts',
          href: '/ops/alerts',
          icon: AlertTriangle,
          badge: activeAlertsCount,
          badgeVariant: 'error',
        },
      ],
    },
  ];

  return (
    <div className="dark bg-[#0a0a0a] text-[#f5f5f5] min-h-screen flex flex-col font-sans select-none antialiased">
      {}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-[0.03]" />

      {}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#111111] border-b border-[#1f1f1f] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-[#1f1f1f] rounded text-[#737373] hover:text-[#f5f5f5] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link href="/ops" className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-blue-500 font-mono">
              VERITEXT
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono font-medium text-[#737373]">
              Ops Center
            </span>
          </Link>
        </div>

        {}
        <div className="flex items-center rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-0.5">
          {(['Production', 'Staging', 'Dev'] as const).map((env) => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              className={cn(
                'px-3 py-1 text-xs font-mono rounded transition-colors',
                environment === env
                  ? 'bg-neutral-900 text-blue-400 font-semibold border border-neutral-800'
                  : 'text-[#737373] hover:text-[#f5f5f5]',
              )}
            >
              {env}
            </button>
          ))}
        </div>

        {}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {}
            <StatusBadge
              status={
                systemStatus === 'All Systems Operational'
                  ? 'healthy'
                  : systemStatus === 'Degraded Performance'
                    ? 'warning'
                    : 'critical'
              }
              pulse={systemStatus !== 'All Systems Operational'}
            >
              {systemStatus}
            </StatusBadge>

            {}
            <button
              onClick={manualRefresh}
              className="flex items-center gap-1.5 text-[11px] font-mono text-[#737373] hover:text-[#f5f5f5] transition-colors group"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              <span>Updated {timeAgo}</span>
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-7 h-7 cursor-pointer border border-[#1f1f1f] hover:border-[#2f2f2f] transition-colors">
                <AvatarImage src="" />
                <AvatarFallback className="bg-neutral-900 text-[#f5f5f5] text-xs font-mono">
                  OP
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#111111] border border-[#1f1f1f] text-[#f5f5f5]">
              <DropdownMenuLabel className="font-mono text-xs text-[#737373]">
                Logged in as Admin
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1f1f1f]" />
              <DropdownMenuItem className="text-xs hover:bg-[#1f1f1f] cursor-pointer">
                <User className="w-3.5 h-3.5 mr-2" /> Profile settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs hover:bg-[#1f1f1f] cursor-pointer">
                <Server className="w-3.5 h-3.5 mr-2" /> API Access Key
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1f1f1f]" />
              <DropdownMenuItem className="text-xs hover:bg-[#1f1f1f] text-red-400 cursor-pointer">
                <LogOutIcon className="w-3.5 h-3.5 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {}
      <div className="flex-1 flex pt-14 h-screen overflow-hidden">
        {}
        <aside
          className={cn(
            'bg-[#111111] border-r border-[#1f1f1f] transition-all duration-300 flex flex-col justify-between shrink-0 overflow-y-auto no-scrollbar',
            isSidebarCollapsed ? 'w-0 border-r-0 opacity-0 overflow-hidden' : 'w-[220px]',
          )}
        >
          <div className="py-4 flex flex-col gap-5">
            {sidebarGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="flex flex-col gap-1 px-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 px-2.5">
                  {group.title}
                </span>
                <nav className="flex flex-col gap-0.5 mt-1">
                  {group.items.map((item, itemIdx) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={itemIdx}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors border-l-2',
                          isActive
                            ? 'bg-neutral-900 border-l-blue-500 text-[#f5f5f5]'
                            : 'border-l-transparent text-[#737373] hover:text-[#f5f5f5] hover:bg-neutral-950/40',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-blue-400' : '')} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={cn(
                              'text-[9px] font-mono px-1.5 rounded-full font-bold',
                              item.badgeVariant === 'error'
                                ? 'bg-red-950/50 text-red-400 border border-red-900/40'
                                : item.badgeVariant === 'warning'
                                  ? 'bg-amber-950/50 text-amber-400 border border-amber-900/40'
                                  : 'bg-blue-950/50 text-blue-400 border border-blue-900/40',
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {}
          <div className="p-3 border-t border-[#1f1f1f] bg-[#0d0d0d]/80 text-[10px] font-mono text-neutral-600 flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Shortcuts:</span>
              <kbd className="bg-neutral-900 px-1 rounded border border-neutral-800">G</kbd>
            </div>
            <div className="flex justify-between">
              <span>G+D: Dash</span>
              <span>G+Q: Queue</span>
            </div>
            <div className="flex justify-between">
              <span>G+L: Log</span>
              <span>G+A: Alert</span>
            </div>
          </div>
        </aside>

        {}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a] relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
