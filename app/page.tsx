'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Layers, 
  Check, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Search,
  Monitor
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { TestCaseItem, TestRunReport } from '@/types/test-report';

const STATUS_COLORS = {
  passed: '#10b981', // Emerald-500
  failed: '#ef4444', // Red-500
  timedOut: '#f97316', // Orange-500
  skipped: '#6b7280', // Gray-500
  flaky: '#eab308', // Yellow-500
};

export default function DashboardPage() {
  const [report, setReport] = useState<TestRunReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch('/api/test-results');
      if (!res.ok) {
        throw new Error('Failed to load test report data');
      }
      const data: TestRunReport = await res.json();
      setReport(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading results');
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async () => {
    try {
      setRunning(true);
      await fetch('/api/run-tests', { method: 'POST' });
      await fetchResults();
    } catch (err: any) {
      setErrorMsg('Failed to run test suite: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredTests = useMemo(() => {
    if (!report) return [];
    return report.tests.filter((t) => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'passed'
          ? t.status === 'passed'
          : t.status === 'failed' || t.status === 'timedOut';
      
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.suite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.file.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [report, filter, searchQuery]);

  const pieData = useMemo(() => {
    if (!report) return [];
    return [
      { name: 'Passed', value: report.summary.passed, color: STATUS_COLORS.passed },
      { name: 'Failed', value: report.summary.failed, color: STATUS_COLORS.failed },
      { name: 'Skipped', value: report.summary.skipped, color: STATUS_COLORS.skipped },
    ].filter((item) => item.value > 0);
  }, [report]);

  const durationData = useMemo(() => {
    if (!report) return [];
    return report.tests.map((t) => ({
      name: t.title.length > 25 ? t.title.substring(0, 25) + '...' : t.title,
      duration: t.duration,
      status: t.status,
    }));
  }, [report]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Playwright E2E Quality Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Automated continuous testing results, pass/fail analytics & error diagnostics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchResults}
            disabled={loading || running}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleRunTests}
            disabled={running || loading}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-white ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto mt-8 space-y-8">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-3 text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        {report && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total Tests</span>
                <Layers className="w-4 h-4 text-slate-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{report.summary.total}</span>
                <span className="text-xs text-slate-500">specs</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Run Duration: <span className="text-slate-200 font-medium">{(report.summary.duration / 1000).toFixed(2)}s</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur shadow-sm">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <span>Passed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">{report.summary.passed}</span>
                <span className="text-xs text-emerald-500/80">passed</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Pass Rate: <span className="text-emerald-400 font-medium">{report.summary.passRate}%</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur shadow-sm">
              <div className="flex items-center justify-between text-red-400 text-xs font-semibold uppercase tracking-wider">
                <span>Failed</span>
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-400">{report.summary.failed}</span>
                <span className="text-xs text-red-500/80">failed</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Errors require attention
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur shadow-sm">
              <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <span>Execution Time</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{(report.summary.duration / 1000).toFixed(2)}</span>
                <span className="text-xs text-slate-400">sec</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Started: <span className="text-slate-300">{new Date(report.summary.startTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Charts Section */}
        {report && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut Chart */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Test Result Distribution</h3>
                <p className="text-xs text-slate-400 mt-1">Pass vs Fail ratio for recent run</p>
              </div>

              <div className="h-60 w-full relative flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white">{report.summary.passRate}%</span>
                  <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Pass Rate</span>
                </div>
              </div>

              <div className="flex justify-center items-center gap-6 text-xs text-slate-300 border-t border-slate-800/60 pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Passed ({report.summary.passed})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Failed ({report.summary.failed})</span>
                </div>
              </div>
            </div>

            {/* Duration Bar Chart */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Execution Duration per Test</h3>
                <p className="text-xs text-slate-400 mt-1">Time spent in milliseconds for each test case</p>
              </div>

              <div className="h-60 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      interval={0}
                      angle={-10}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="ms" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(value: any) => [`${value} ms`, 'Duration']}
                    />
                    <Bar dataKey="duration" radius={[6, 6, 0, 0]}>
                      {durationData.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={entry.status === 'passed' ? '#0ea5e9' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/60 pt-4">
                <span>Cyan: Normal execution</span>
                <span>Red: Timeout / Test failure</span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Test Run Table & Log Viewer */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur overflow-hidden shadow-sm">
          {/* Controls Bar */}
          <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Tests ({report?.summary.total || 0})
              </button>
              <button
                onClick={() => setFilter('passed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === 'passed'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-emerald-400'
                }`}
              >
                Passed ({report?.summary.passed || 0})
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === 'failed'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-red-400'
                }`}
              >
                Failed ({report?.summary.failed || 0})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search test or suite..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 transition"
              />
            </div>
          </div>

          {/* Test Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Test Case</th>
                  <th className="py-3.5 px-6">Suite & File</th>
                  <th className="py-3.5 px-6">Browser</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTests.map((test) => {
                  const isExpanded = expandedTestId === test.id;
                  const isFail = test.status === 'failed' || test.status === 'timedOut';

                  return (
                    <React.Fragment key={test.id}>
                      <tr
                        onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                        className={`hover:bg-slate-800/40 cursor-pointer transition ${
                          isExpanded ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              test.status === 'passed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {test.status === 'passed' ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {test.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-200">
                          <div className="flex flex-col">
                            <span>{test.title}</span>
                            {test.error && (
                              <span className="text-xs text-red-400/90 truncate max-w-md mt-0.5">
                                {test.error.message.split('\n')[0]}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs">
                          <div className="font-mono text-slate-300">{test.file}:{test.line}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">{test.suite}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-300 text-xs">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            <Monitor className="w-3 h-3 text-cyan-400" />
                            {test.browser}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 text-xs font-mono">
                          {test.duration} ms
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            className="p-1 rounded text-slate-400 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Section with Logs, Snippet & Error Stack */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-slate-950/80 p-6 border-y border-slate-800">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                  <Terminal className="w-4 h-4 text-cyan-400" />
                                  Execution Details & Diagnostic Logs
                                </h4>
                                <span className="text-xs font-mono text-slate-500">ID: {test.id}</span>
                              </div>

                              {test.error ? (
                                <div className="space-y-3">
                                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 font-mono text-xs text-red-200 space-y-2">
                                    <div className="font-semibold text-red-300 flex items-center gap-2">
                                      <XCircle className="w-4 h-4 text-red-400" />
                                      Error Message:
                                    </div>
                                    <pre className="whitespace-pre-wrap overflow-x-auto">{test.error.message}</pre>
                                  </div>

                                  {test.error.snippet && (
                                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                                      <div className="text-slate-400 font-semibold mb-2">Code Snippet:</div>
                                      <pre className="text-yellow-200 whitespace-pre-wrap overflow-x-auto">
                                        {test.error.snippet}
                                      </pre>
                                    </div>
                                  )}

                                  {test.error.stack && (
                                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
                                      <div className="text-slate-400 font-semibold mb-1">Stack Trace:</div>
                                      <pre className="text-slate-400 whitespace-pre-wrap overflow-x-auto text-[11px]">
                                        {test.error.stack}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 text-xs flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span>Test passed without any assertion failures or uncaught errors.</span>
                                </div>
                              )}

                              {/* Test Steps if available */}
                              {test.steps && test.steps.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                                    Execution Steps:
                                  </h5>
                                  <div className="space-y-1">
                                    {test.steps.map((st, idx) => (
                                      <div
                                        key={idx}
                                        className="text-xs flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800/60"
                                      >
                                        <span className="text-slate-300">{st.title}</span>
                                        {st.duration && (
                                          <span className="text-slate-500 font-mono">{st.duration}ms</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {filteredTests.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">
                      No test results match the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
