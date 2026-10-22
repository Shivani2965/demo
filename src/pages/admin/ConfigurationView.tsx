import React, { useState } from 'react';
import { RoutingRule, SLAConfig, TicketPriority } from '../../types';
import { DemoStore } from '../../services/demoStore';
import { Clock, Sliders, CheckCircle2 } from 'lucide-react';

export const ConfigurationView: React.FC = () => {
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>(DemoStore.getRoutingRules());
  const [slaConfigs, setSlaConfigs] = useState<SLAConfig[]>(DemoStore.getSLAConfigs());
  const [savedToast, setSavedToast] = useState(false);

  const handleUpdateRuleSla = (id: string, newHours: number) => {
    const updated = routingRules.map((r) => (r.id === id ? { ...r, slaHours: newHours } : r));
    setRoutingRules(updated);
    const rule = updated.find((r) => r.id === id);
    if (rule) DemoStore.updateRoutingRule(rule);
    triggerSave();
  };

  const handleUpdateSlaConfig = (priority: TicketPriority, field: 'response' | 'resolution', value: number) => {
    const updated = slaConfigs.map((c) => {
      if (c.priority === priority) {
        return field === 'response'
          ? { ...c, responseTimeMinutes: value }
          : { ...c, resolutionTimeHours: value };
      }
      return c;
    });
    setSlaConfigs(updated);
    const conf = updated.find((c) => c.priority === priority);
    if (conf) DemoStore.updateSLAConfig(conf);
    triggerSave();
  };

  const triggerSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EDE6D6]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Routing Rules & SLA Configuration
          </h2>
          <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
            Automated ticket dispatch policies and service level agreements.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#DDECCB] text-[#2D4E14] text-xs font-semibold rounded-full border border-[#CDE0B7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4B7926]" />
            <span>Policy Saved!</span>
          </div>
        )}
      </div>

      {/* SLA Policy Grid */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE6D6] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#171717]" />
            <h3 className="font-bold text-[#171717] text-sm">SLA Target Matrix</h3>
          </div>
          <span className="text-xs text-[#77736D]">SIH25195 Performance Guarantees</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {slaConfigs.map((sla) => (
            <div
              key={sla.priority}
              className="p-4 rounded-2xl border border-[#EDE6D6] bg-[#FFFAED] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#171717] text-xs">{sla.priority} Priority</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    sla.priority === 'Critical'
                      ? 'bg-[#080808] text-white'
                      : sla.priority === 'High'
                      ? 'bg-[#F8D2E8] text-[#68194B]'
                      : 'bg-white text-[#171717] border border-[#EDE6D6]'
                  }`}
                >
                  Tier {sla.priority === 'Critical' ? '1' : '2'}
                </span>
              </div>

              <div>
                <label className="text-[11px] text-[#77736D] block mb-1">
                  Response Window (Minutes)
                </label>
                <input
                  type="number"
                  value={sla.responseTimeMinutes}
                  onChange={(e) =>
                    handleUpdateSlaConfig(sla.priority, 'response', parseInt(e.target.value) || 15)
                  }
                  className="w-full text-xs font-mono border border-[#EDE6D6] bg-white rounded-xl p-2 text-[#171717]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#77736D] block mb-1">
                  Resolution Target (Hours)
                </label>
                <input
                  type="number"
                  value={sla.resolutionTimeHours}
                  onChange={(e) =>
                    handleUpdateSlaConfig(sla.priority, 'resolution', parseInt(e.target.value) || 1)
                  }
                  className="w-full text-xs font-mono border border-[#EDE6D6] bg-white rounded-xl p-2 text-[#171717]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Routing Rules */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EDE6D6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#171717]" />
            <h3 className="font-bold text-[#171717] text-sm">Automated Routing & Dispatch Rules</h3>
          </div>
          <span className="text-xs text-[#77736D]">Rule-based NLP Ticket Assignment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F2E4] border-b border-[#EDE6D6] text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                <th className="py-3 px-4">Rule ID</th>
                <th className="py-3 px-4">Category Trigger</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Support Team</th>
                <th className="py-3 px-4">Default Assignee</th>
                <th className="py-3 px-4 text-right">Max SLA (Hours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D6] text-xs">
              {routingRules.map((r) => (
                <tr key={r.id} className="hover:bg-[#FFFAED] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#171717]">{r.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#171717]">{r.category}</td>
                  <td className="py-3.5 px-4">{r.priority}</td>
                  <td className="py-3.5 px-4 text-[#77736D]">{r.assignedTeam}</td>
                  <td className="py-3.5 px-4 text-[#171717] font-semibold">{r.defaultAssigneeName}</td>
                  <td className="py-3.5 px-4 text-right">
                    <input
                      type="number"
                      value={r.slaHours}
                      onChange={(e) => handleUpdateRuleSla(r.id, parseInt(e.target.value) || 4)}
                      className="w-16 text-right font-mono text-xs border border-[#EDE6D6] bg-[#FFFAED] rounded-lg p-1.5"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
