import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentResult, HealthStatus } from '#/types/screening';
import { GlassCard } from '#/components/common/GlassCard';
import { StatusBadge } from '#/components/common/StatusBadge';
import { SectionHeading } from '#/components/common/SectionHeading';

interface ComponentTableProps {
  components: ComponentResult[];
  onSelectComponent: (id: string) => void;
}

type SortKey = 'componentId' | 'health' | 'riskScore' | 'anomalyScore' | 'failureProbability' | 'stressDuration' | 'primaryIndicator';
type SortDirection = 'asc' | 'desc';
type RiskFilter = 'all' | 'healthy' | 'at-risk' | 'critical';

export const ComponentTable: React.FC<ComponentTableProps> = ({ components, onSelectComponent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = components.filter(c => {
      const matchesSearch = c.componentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk =
        riskFilter === 'all' ? true :
        c.health === riskFilter;
      return matchesSearch && matchesRisk;
    });

    result = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  }, [components, searchQuery, riskFilter, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-cyan-400" /> : <ChevronDown className="w-3 h-3 text-cyan-400" />;
  };

  const filterButtons: { label: string; value: RiskFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Healthy', value: 'healthy' },
    { label: 'At Risk', value: 'at-risk' },
    { label: 'Critical', value: 'critical' },
  ];

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col border border-white/5" hoverable={false}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
        <SectionHeading title="Component Risk Table" />

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Component ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono placeholder:text-slate-600"
              aria-label="Search components by ID"
            />
          </div>

          <div className="flex bg-slate-950/50 rounded-lg p-1 border border-white/10 w-full sm:w-auto">
            {filterButtons.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => { setRiskFilter(value); setCurrentPage(1); }}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  riskFilter === value
                    ? 'bg-white/10 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/[0.02] sticky top-0 z-10 border-b border-white/5">
            <tr>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('componentId')}>
                <div className="flex items-center gap-1">Component ID <SortIcon column="componentId" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('health')}>
                <div className="flex items-center gap-1">Health <SortIcon column="health" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('riskScore')}>
                <div className="flex items-center gap-1">Risk Score <SortIcon column="riskScore" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('anomalyScore')}>
                <div className="flex items-center gap-1">Anomaly Score <SortIcon column="anomalyScore" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('failureProbability')}>
                <div className="flex items-center gap-1">Failure Prob <SortIcon column="failureProbability" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('stressDuration')}>
                <div className="flex items-center gap-1">Stress (h) <SortIcon column="stressDuration" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('primaryIndicator')}>
                <div className="flex items-center gap-1">Primary Indicator <SortIcon column="primaryIndicator" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-600">
                  No components found matching current filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((component) => (
                <tr
                  key={component.componentId}
                  onClick={() => onSelectComponent(component.componentId)}
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${component.componentId}`}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectComponent(component.componentId); }}
                >
                  <td className="px-4 py-3 font-mono text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">{component.componentId}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={component.health} size="sm" showDot />
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <span className={component.riskScore > 80 ? 'text-red-400' : component.riskScore > 60 ? 'text-orange-400' : component.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                      {component.riskScore.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">{component.anomalyScore.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{component.failureProbability.toFixed(0)}%</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{component.stressDuration}h</td>
                  <td className="px-4 py-3 text-slate-400 capitalize">{component.primaryIndicator.replace(/([A-Z])/g, ' $1').trim()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="text-xs text-slate-500">
          Showing <span className="font-mono text-slate-400">{filteredAndSorted.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-mono text-slate-400">{Math.min(filteredAndSorted.length, currentPage * itemsPerPage)}</span> of <span className="font-mono text-slate-400">{filteredAndSorted.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">{currentPage}/{totalPages || 1}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-white/5 border border-white/10 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-slate-200 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded bg-white/5 border border-white/10 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-slate-200 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
