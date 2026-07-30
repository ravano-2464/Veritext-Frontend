'use client';

import React from 'react';
import { useOpsStore, Alert } from '@/lib/ops-mock-data';
import { StatusBadge } from '@/components/ops/status-badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, CheckCircle2, AlertOctagon, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
  const { alerts, alertRules, acknowledgeAlert, resolveAlert } = useOpsStore();
  const [selectedAlertDetails, setSelectedAlertDetails] = React.useState<Alert | null>(null);

  const activeAlerts = React.useMemo(() => {
    return alerts
      .filter((a) => a.status === 'FIRING' || a.status === 'ACKNOWLEDGED')
      .sort((a, b) => {
        const severityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return severityWeight[b.severity] - severityWeight[a.severity];
      });
  }, [alerts]);

  const historicalAlerts = React.useMemo(() => {
    return alerts.filter((a) => a.status === 'RESOLVED');
  }, [alerts]);

  const severityBorders = {
    CRITICAL: 'border-l-4 border-l-red-500 shadow-[inset_1px_0_0_0_rgba(239,68,68,0.15)]',
    HIGH: 'border-l-4 border-l-orange-500 shadow-[inset_1px_0_0_0_rgba(249,115,22,0.15)]',
    MEDIUM: 'border-l-4 border-l-amber-500 shadow-[inset_1px_0_0_0_rgba(245,158,11,0.15)]',
    LOW: 'border-l-4 border-l-blue-500 shadow-[inset_1px_0_0_0_rgba(59,130,246,0.15)]',
  };

  const getAlertBorder = (severity: Alert['severity']) => {
    return severityBorders[severity] || severityBorders.LOW;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f5f5f5] font-mono uppercase">
          INCIDENT TELEMETRY & ALERTS
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          Live alert status, PagerDuty rules, and incident resolution logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Active Alerts Firing ({activeAlerts.length})
          </span>

          <div className="flex flex-col gap-3">
            {activeAlerts.length === 0 ? (
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-8 text-center font-mono text-xs text-[#737373] flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                <span>ALL MONITORING TARGETS HEALTHY — NO ACTIVE ALERTS</span>
              </div>
            ) : (
              activeAlerts.map((alert) => {
                const borderStyle = getAlertBorder(alert.severity);
                const isFiring = alert.status === 'FIRING';

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4 transition-all',
                      borderStyle,
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {isFiring ? (
                        <span className="relative flex h-3.5 w-3.5 mt-0.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
                        </span>
                      ) : (
                        <div className="w-3.5 h-3.5 mt-0.5 rounded-full bg-amber-500 shrink-0" />
                      )}

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-[#f5f5f5] font-mono">
                            {alert.title}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded uppercase">
                            {alert.service}
                          </span>
                          <span className="text-[10px] font-mono text-[#737373]">
                            ({alert.duration})
                          </span>
                        </div>
                        <p className="text-xs text-[#737373]">{alert.description}</p>

                        {!isFiring && alert.acknowledgedBy && (
                          <span className="text-[10px] font-mono text-amber-500 mt-1">
                            Acknowledged by {alert.acknowledgedBy}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isFiring && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="bg-neutral-900 border-[#1f1f1f] text-amber-400 hover:text-amber-300 hover:bg-neutral-850 text-[11px] h-8 px-2.5"
                        >
                          Acknowledge
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        className="bg-neutral-900 border-[#1f1f1f] text-emerald-400 hover:text-emerald-300 hover:bg-neutral-850 text-[11px] h-8 px-2.5"
                      >
                        Resolve
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAlertDetails(alert)}
                        className="w-8 h-8 hover:bg-neutral-900 text-[#737373] hover:text-[#f5f5f5]"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
            Selected Alert Details
          </span>

          {selectedAlertDetails ? (
            <div className="flex flex-col gap-4 font-mono text-xs text-neutral-300">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#737373] uppercase">Alert Description</span>
                <span className="text-[#f5f5f5] font-bold">{selectedAlertDetails.title}</span>
                <p className="text-neutral-400 mt-1 font-sans">
                  {selectedAlertDetails.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-[#1f1f1f] pt-3">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#737373] uppercase">Severity</span>
                  <span className="text-red-400 font-semibold">
                    {selectedAlertDetails.severity}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#737373] uppercase">Service</span>
                  <span className="text-[#f5f5f5] font-semibold">
                    {selectedAlertDetails.service}
                  </span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[9px] text-[#737373] uppercase">Triggered At</span>
                  <span className="text-[#f5f5f5] font-semibold">
                    {new Date(selectedAlertDetails.triggeredAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[9px] text-[#737373] uppercase">State</span>
                  <span className="text-[#f5f5f5] font-semibold">
                    {selectedAlertDetails.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-[#1f1f1f] pt-3">
                <span className="text-[9px] text-[#737373] uppercase">Pager Target</span>
                <span className="text-neutral-400">
                  Slack #ops-alerts, Webhook Push, SMS On-call
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#737373] font-mono text-xs text-center py-8">
              Click eye icon to display alert telemetry variables.
            </div>
          )}
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Historic Resolution Log (Last 7 Days)
        </span>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Alert Trigger</th>
                <th className="px-4 py-2.5">Service</th>
                <th className="px-4 py-2.5">Duration Fired</th>
                <th className="px-4 py-2.5">Acknowledged By</th>
                <th className="px-4 py-2.5">Resolved By</th>
                <th className="px-4 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-[#f5f5f5]">
              {historicalAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-neutral-900/30 text-neutral-300">
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(alert.triggeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#f5f5f5]">{alert.title}</td>
                  <td className="px-4 py-3 text-neutral-400">{alert.service}</td>
                  <td className="px-4 py-3">{alert.duration}</td>
                  <td className="px-4 py-3 text-neutral-500">{alert.acknowledgedBy || 'system'}</td>
                  <td className="px-4 py-3 text-neutral-500">{alert.resolvedBy || 'system'}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status="healthy">RESOLVED</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] font-mono">
          Configured Alert Rules & Targets (Read Only)
        </span>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded bg-[#0d0d0d]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-neutral-900/40 text-[#737373] uppercase text-[10px]">
                <th className="px-4 py-2.5">Alert Rule Name</th>
                <th className="px-4 py-2.5">Trigger Condition</th>
                <th className="px-4 py-2.5">Breach Threshold</th>
                <th className="px-4 py-2.5">Notification Channels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-neutral-350">
              {alertRules.map((rule) => (
                <tr key={rule.rule} className="hover:bg-neutral-900/30">
                  <td className="px-4 py-3 text-neutral-350 font-semibold">{rule.rule}</td>
                  <td className="px-4 py-3 text-blue-400 font-semibold">{rule.condition}</td>
                  <td className="px-4 py-3">{rule.threshold}</td>
                  <td className="px-4 py-3 text-neutral-500">{rule.notify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
