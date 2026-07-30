/* eslint-disable react-hooks/purity */
'use client';

import React from 'react';
import { useOpsStore, LogLine } from '@/lib/ops-mock-data';
import { Terminal } from '@/components/ops/terminal';

export default function AuditLogsPage() {
  const { clearLogs } = useOpsStore();
  const [search, setSearch] = React.useState('');

  const auditLogs = React.useMemo(() => {
    const list: LogLine[] = [];
    const actions = [
      {
        msg: 'Deployment veritext-api@1.4.2 successful on Production',
        svc: 'deployer',
        meta: { actor: 'admin@veritext.com', buildId: 'b-9021', gitSha: 'a7c9f2b' },
      },
      {
        msg: 'Database pool size updated from 80 to 100 max connections',
        svc: 'config-manager',
        meta: { actor: 'devops@veritext.com', param: 'DB_MAX_CONNECTIONS', old: 80, new: 100 },
      },
      {
        msg: 'API Key issued for Enterprise User usr_ent_88',
        svc: 'key-management',
        meta: { actor: 'admin@veritext.com', targetUser: 'usr_ent_88', type: 'publishable_key' },
      },
      {
        msg: 'Redis cache eviction policy altered to volatile-lru',
        svc: 'redis-manager',
        meta: { actor: 'devops@veritext.com', policy: 'volatile-lru' },
      },
      {
        msg: 'Billing threshold for Stripe webhooks increased',
        svc: 'billing-config',
        meta: { actor: 'admin@veritext.com', delta: '+10%' },
      },
      {
        msg: 'Alert rules edited: p95_latency threshold modified',
        svc: 'alert-manager',
        meta: { actor: 'admin@veritext.com', ruleId: 'rule_p95_lat', old: '250ms', new: '300ms' },
      },
    ];

    const baseTime = Date.now();
    for (let i = 0; i < 40; i++) {
      const act = actions[i % actions.length];
      const offsetMs = i * 4 * 60 * 60 * 1000;
      list.push({
        id: `audit-${i}`,
        timestamp: new Date(baseTime - offsetMs).toISOString(),
        level: i % 10 === 0 ? 'WARN' : 'INFO',
        service: act.svc,
        requestId: `req-aud-${1000 + i}`,
        message: act.msg,
        meta: act.meta,
      });
    }
    return list;
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          Security & Audit Logs
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          History of administrative updates, configurations changes, deployments, and security
          triggers.
        </p>
      </div>

      <Terminal
        logs={auditLogs}
        isLive={false}
        onToggleLive={() => {}}
        onClear={clearLogs}
        levelFilter="ALL"
        onLevelFilterChange={() => {}}
        serviceFilter="ALL"
        onServiceFilterChange={() => {}}
        searchQuery={search}
        onSearchQueryChange={setSearch}
        availableServices={[
          'deployer',
          'config-manager',
          'key-management',
          'redis-manager',
          'billing-config',
          'alert-manager',
        ]}
        maxHeight="h-[500px]"
        showErrorAggregation={false}
      />
    </div>
  );
}
