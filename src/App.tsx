import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import './index.css'
import type { LogEntry, Shortcut, ExportSettings, AppearanceSettings } from './types'

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
)
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
)
const ExportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
)
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
)
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
)
const TriangleUpIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 21h20z" /></svg>
)
const TriangleDownIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21L2 3h20z" /></svg>
)


const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// LogItem Component
const LogItem = ({
  log,
  selectedDate,
  updateLog,
  deleteLog,
  addLog,
}: {
  log: LogEntry,
  selectedDate: string,
  updateLog: (id: string, u: Partial<LogEntry>) => void,
  deleteLog: (id: string) => void,
  addLog: (text?: string, date?: string, time?: string, after?: string, noTime?: boolean) => void,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea to always show full content
  useLayoutEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }, [log.text])

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="card log-card">
        <div className="time-wrapper">
          <div className={`time-display-text ${!log.time ? 'is-empty' : ''}`}>
            {log.time?.slice(0, 5) || '--:--'}
          </div>
          <input
            type="time"
            value={log.time?.slice(0, 5)}
            onChange={(e) => {
              // Browser time picker returns HH:mm; append :00 for seconds
              const val = e.target.value;
              const timeWithSec = val && val.length === 5 ? val + ':00' : val;
              updateLog(log.id, { time: timeWithSec });
            }}
            onClick={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.showPicker) {
                input.showPicker();
              }
            }}
            className="time-input-overlay"
          />
        </div>
        <div className="text-content-wrapper" style={{ width: '100%' }}>
          <textarea
            ref={textareaRef}
            value={log.text}
            onChange={(e) => {
              updateLog(log.id, { text: e.target.value })
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
            placeholder="メモを入力..."
            rows={1}
          />
        </div>
        <button className="delete-btn" onClick={() => deleteLog(log.id)}>×</button>
      </div>
      <div className="insert-between">
        <button
          className="insert-circle"
          onClick={() => addLog('', selectedDate, '', log.id, true)}
        >
          +
        </button>
      </div>
    </motion.div>
  )
}

// CalendarPicker Component
const CalendarPicker = ({
  selectedDate,
  onSelectDate,
  datesWithData,
  onClose,
}: {
  selectedDate: string,
  onSelectDate: (date: string) => void,
  datesWithData: Set<string>,
  onClose: () => void,
}) => {
  const [viewYear, setViewYear] = useState(() => parseInt(selectedDate.slice(0, 4)))
  const [viewMonth, setViewMonth] = useState(() => parseInt(selectedDate.slice(5, 7)) - 1) // 0-indexed

  const todayStr = getTodayStr()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const formatDateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const handleSelect = (day: number) => {
    onSelectDate(formatDateStr(day))
    onClose()
  }

  // Build cells: leading blanks + day numbers
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = `${viewYear}年${viewMonth + 1}月`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal calendar-modal" onClick={e => e.stopPropagation()}>
        <div className="calendar-header">
          <button className="nav-btn" onClick={prevMonth}>◀</button>
          <span className="calendar-month-label">{monthLabel}</span>
          <button className="nav-btn" onClick={nextMonth}>▶</button>
        </div>
        <div className="calendar-grid">
          {weekdays.map(w => (
            <div key={w} className="calendar-weekday">{w}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} className="calendar-cell empty" />
            const dateStr = formatDateStr(day)
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            const hasData = datesWithData.has(dateStr)
            return (
              <button
                key={dateStr}
                className={[
                  'calendar-cell',
                  isToday ? 'today' : '',
                  isSelected ? 'selected' : '',
                  hasData ? 'has-data' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleSelect(day)}
              >
                <span className="calendar-day-num">{day}</span>
                {hasData && <span className="calendar-dot" />}
              </button>
            )
          })}
        </div>
        <button className="close-modal-btn" onClick={onClose}>閉じる</button>
      </div>
    </div>
  )
}

function App() {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('tapiary-data')
    return saved ? JSON.parse(saved) : []
  })
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tapiary-theme')
    return (saved as 'light' | 'dark') || 'light'
  })
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    const saved = localStorage.getItem('tapiary-shortcuts')
    return saved ? JSON.parse(saved) : [
      { id: '1', label: '服薬' },
      { id: '2', label: '就寝' }
    ]
  })
  const [exportSettings, setExportSettings] = useState<ExportSettings>(() => {
    const saved = localStorage.getItem('tapiary-export-settings')
    return saved ? JSON.parse(saved) : {
      includeHeaderDate: true,
      includeLogDate: false,
      includeSeconds: false,
      delimiter: 'space',
      quoteText: false,
      newlineHandling: 'keep'
    }
  })
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('tapiary-appearance')
    return saved ? JSON.parse(saved) : { showScrollButtons: true }
  })

  const [isAppSettingsOpen, setIsAppSettingsOpen] = useState(false)
  const [isShortcutSettingsOpen, setIsShortcutSettingsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getTodayStr())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false)
  const [newLogTime, setNewLogTime] = useState('')
  const [newLogText, setNewLogText] = useState('')
  const newLogTextRef = useRef<HTMLTextAreaElement>(null)


  useEffect(() => {
    localStorage.setItem('tapiary-data', JSON.stringify(logs))
  }, [logs])

  useEffect(() => {
    localStorage.setItem('tapiary-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('tapiary-shortcuts', JSON.stringify(shortcuts))
  }, [shortcuts])

  useEffect(() => {
    localStorage.setItem('tapiary-export-settings', JSON.stringify(exportSettings))
  }, [exportSettings])

  useEffect(() => {
    localStorage.setItem('tapiary-appearance', JSON.stringify(appearance))
  }, [appearance])

  // Migration: Ensure all logs have createdAt and correct parentId structure
  useEffect(() => {
    setLogs(prev => {
      const needsMigration = prev.some(l => !l.createdAt);
      if (!needsMigration) return prev;

      const now = Date.now();
      let lastAnchorId: string | undefined = undefined;

      return prev.map((log, index) => {
        const isAnchor = !!log.time;
        // If it's an anchor, it becomes the new lastAnchorId
        // If it's a child, it adopts the lastAnchorId (or keeps its own if valid, but for migration we assume sequential)
        // We only migrate if parentId is missing for a no-time log.
        let pid = log.parentId;
        if (!isAnchor && pid === undefined) {
          pid = lastAnchorId;
        }

        const newLog = {
          ...log,
          createdAt: log.createdAt || (now + index), // Stable sort for existing
          parentId: pid
        };

        if (isAnchor) lastAnchorId = log.id;
        return newLog;
      });
    });
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortLogs = (list: LogEntry[]) => {
    const anchors = list.filter(l => !!l.time);
    const children = list.filter(l => !l.time);

    // Sort anchors by Date -> Time -> CreatedAt
    anchors.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.time !== b.time) return a.time.localeCompare(b.time);
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

    // Group children by parentId
    const childrenMap = new Map<string, LogEntry[]>();
    children.forEach(c => {
      const pid = c.parentId || 'root';
      const arr = childrenMap.get(pid) || [];
      arr.push(c);
      childrenMap.set(pid, arr);
    });

    // Flatten list
    let result: LogEntry[] = [];

    // 1. Root children (no-time logs at top of day)
    const rootChildren = childrenMap.get('root');
    if (rootChildren) {
      rootChildren.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      result.push(...rootChildren);
    }

    // 2. Anchors and their children
    anchors.forEach(anchor => {
      result.push(anchor);
      const kids = childrenMap.get(anchor.id);
      if (kids) {
        kids.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        result.push(...kids);
      }
    });

    return result;
  };

  const sortedLogs = useMemo(() => sortLogs(logs), [logs]);

  const normalizeOrders = (list: LogEntry[]) => {
    return list.map((item, index) => ({ ...item, order: index + 1 }));
  };

  const filteredLogs = useMemo(() => {
    return sortedLogs.filter(log => log.date === selectedDate)
  }, [sortedLogs, selectedDate])

  const datesWithData = useMemo(() => {
    const dates = new Set<string>()
    logs.forEach(l => { if (l.date) dates.add(l.date) })
    return dates
  }, [logs])

  const addLog = (text = '', dateStr?: string, timeStr?: string, afterId?: string, noTime = false, insertBeforeFirst = false) => {
    const now = new Date()
    const targetDate = dateStr || selectedDate
    const isToday = targetDate === getTodayStr()
    const timeVal = noTime ? '' : (timeStr || (isToday ? now.toTimeString().slice(0, 8) : '')); // HH:mm:ss

    let parentId: string | undefined = undefined;

    if (noTime) {
      if (insertBeforeFirst) {
        parentId = undefined;
      } else if (afterId) {
        const prevLog = logs.find(l => l.id === afterId);
        if (prevLog) {
          // If prev matches anchor, it's the parent. If prev is child, share its parent.
          parentId = prevLog.time ? prevLog.id : prevLog.parentId;
        }
      } else {
        // Append at end. Find last anchor.
        const todayLogs = logs.filter(l => l.date === targetDate);
        const lastLog = todayLogs[todayLogs.length - 1];
        if (lastLog) {
          parentId = lastLog.time ? lastLog.id : lastLog.parentId;
        }
      }
    }

    const newEntry: LogEntry = {
      id: crypto.randomUUID(),
      date: targetDate,
      time: timeVal,
      text: text,
      order: 0, // Legacy field
      createdAt: now.getTime(),
      parentId: parentId
    }

    setLogs(prev => [...prev, newEntry]);
  }

  const updateLog = (id: string, updates: Partial<LogEntry>) => {
    const nextLogs = logs.map(log => log.id === id ? { ...log, ...updates } : log);
    const isTimeUpdate = 'time' in updates;
    let finalLogs = nextLogs;
    if (isTimeUpdate) {
      finalLogs = sortLogs(nextLogs);
    }
    setLogs(normalizeOrders(finalLogs));
  }

  const deleteLog = (id: string) => {
    const logToDelete = logs.find(l => l.id === id);
    if (!logToDelete) return;

    const timeDisplay = logToDelete.time?.slice(0, 5) || '--:--';
    const textPreview = logToDelete.text ? (logToDelete.text.length > 20 ? logToDelete.text.slice(0, 20) + '...' : logToDelete.text) : '(空)';

    if (confirm(`以下のログを削除しますか？\n${timeDisplay} ${textPreview}`)) {
      const isAnchor = !!logToDelete.time;
      let newParentId: string | undefined = undefined;

      if (isAnchor) {
        const sorted = sortLogs(logs);
        const idx = sorted.findIndex(l => l.id === id);
        if (idx > 0) {
          const prev = sorted[idx - 1];
          newParentId = prev.time ? prev.id : prev.parentId;
        }
      }

      setLogs(prev => prev.filter(l => l.id !== id).map(l => {
        if (l.parentId === id) {
          return { ...l, parentId: newParentId };
        }
        return l;
      }));
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const exportAsText = () => {
    const lines: string[] = []

    if (exportSettings.includeHeaderDate) {
      lines.push(`${formatDisplayDate(selectedDate)}`)
    }

    filteredLogs.forEach(log => {
      const parts: string[] = []

      // Time Part
      if (exportSettings.includeLogDate) {
        // Full YYYY-MM-DD HH:mm(:ss)
        const timeDisplay = log.time
          ? (exportSettings.includeSeconds ? log.time.slice(0, 8) : log.time.slice(0, 5))
          : '--:--';
        parts.push(log.date + ' ' + timeDisplay)
      } else {
        // Just Time
        const timeDisplay = log.time
          ? (exportSettings.includeSeconds ? log.time.slice(0, 8) : log.time.slice(0, 5))
          : '--:--';
        parts.push(timeDisplay)
      }

      // Text Part
      let text = log.text
      if (exportSettings.newlineHandling === 'space') {
        text = text.replace(/\n/g, ' ')
      } else if (exportSettings.newlineHandling === 'escape') {
        text = text.replace(/\n/g, '\\n')
      }

      if (exportSettings.quoteText) {
        text = `"${text.replace(/"/g, '""')}"`
      }

      parts.push(text)

      const delims = {
        space: ' ',
        tab: '\t',
        comma: ','
      }
      lines.push(parts.join(delims[exportSettings.delimiter]))
    })

    const result = lines.join('\n')
    navigator.clipboard.writeText(result)
    alert(`${selectedDate} のログをコピーしました！`)
  }

  // Shortcut management
  const updateShortcut = (id: string, label: string) => {
    setShortcuts(shortcuts.map(s => s.id === id ? { ...s, label } : s))
  }
  const addShortcut = () => {
    setShortcuts([...shortcuts, { id: crypto.randomUUID(), label: '新しいボタン' }])
  }
  const deleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id))
  }

  const openNewLogModal = () => {
    const now = new Date();
    setNewLogTime(now.toTimeString().slice(0, 8)); // HH:mm:ss
    setNewLogText('');
    setIsNewLogModalOpen(true);
    setTimeout(() => newLogTextRef.current?.focus(), 100);
  }

  const submitNewLog = () => {
    addLog(newLogText, selectedDate, newLogTime);
    setIsNewLogModalOpen(false);
  }

  // Date navigation
  const navigateDate = (days: number) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    setSelectedDate(current.toISOString().split('T')[0])
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} (${weekdays[d.getDay()]})`
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tapiary</h1>
        <div className="header-actions">
          <button onClick={toggleTheme} className="icon-btn">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button onClick={exportAsText} className="icon-btn" title="Export current day">
            <ExportIcon />
          </button>
          <button onClick={() => setIsAppSettingsOpen(true)} className="icon-btn" title="Settings">
            <SettingsIcon />
          </button>
        </div>
      </header>

      <main className="timeline">
        <div className="date-header">
          <button className="nav-btn" onClick={() => navigateDate(-1)}>◀</button>
          <div className="date-display" onClick={() => setIsCalendarOpen(true)}>
            {formatDisplayDate(selectedDate)}
          </div>
          <button className="nav-btn" onClick={() => navigateDate(1)}>▶</button>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="log-section"
          >
            {filteredLogs.length === 0 ? (
              <div className="empty-state">記録がありません</div>
            ) : (
              <>
                <div className="insert-between" style={{ height: '20px', marginTop: '0' }}>
                  <button
                    className="insert-circle"
                    onClick={() => addLog('', selectedDate, '', undefined, true, true)}
                  >
                    +
                  </button>
                </div>
                {filteredLogs.map((log) => (
                  <LogItem
                    key={log.id}
                    log={log}
                    selectedDate={selectedDate}
                    updateLog={updateLog}
                    deleteLog={deleteLog}
                    addLog={addLog}
                  />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="shortcut-bar">
        <div className="shortcut-scroll-area">
          {shortcuts.map(s => (
            <button key={s.id} onClick={() => addLog(s.label)}>{s.label}</button>
          ))}
        </div>
        <button className="edit-shortcuts-btn" onClick={() => setIsShortcutSettingsOpen(true)} title="Edit buttons">
          <EditIcon />
        </button>
      </footer>

      {appearance.showScrollButtons && (
        <>
          <button className="scroll-top-btn" onClick={scrollToTop} title="一番上へ">
            <TriangleUpIcon />
          </button>
          <button className="scroll-bottom-btn" onClick={scrollToBottom} title="一番下へ">
            <TriangleDownIcon />
          </button>
        </>
      )}
      <button className="add-main-btn" onClick={openNewLogModal}>+</button>

      {isNewLogModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewLogModalOpen(false)}>
          <div className="modal new-log-modal" onClick={e => e.stopPropagation()}>
            <h2>新しいログ</h2>
            <div className="new-log-time-display">
              <input
                className="new-log-time-input"
                type="text"
                value={newLogTime.slice(0, 5)}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^0-9:]/g, '');
                  if (v.length === 2 && !v.includes(':') && newLogTime.slice(0, 5).length === 1) v += ':';
                  if (v.length > 5) v = v.slice(0, 5);
                  // Preserve existing seconds or default to :00
                  const seconds = newLogTime.length >= 8 ? newLogTime.slice(5, 8) : ':00';
                  setNewLogTime(v.length === 5 ? v + seconds : v);
                }}
                placeholder="--:--"
                maxLength={5}
              />
            </div>
            <textarea
              ref={newLogTextRef}
              value={newLogText}
              onChange={(e) => setNewLogText(e.target.value)}
              placeholder="メモを入力..."
              className="new-log-text-input"
              rows={3}
            />
            <div className="new-log-actions">
              <button className="cancel-btn" onClick={() => setIsNewLogModalOpen(false)}>キャンセル</button>
              <button className="submit-btn" onClick={submitNewLog}>追加</button>
            </div>
          </div>
        </div>
      )}

      {isShortcutSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsShortcutSettingsOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>ボタン設定</h2>
            <div className="shortcut-edit-list">
              <Reorder.Group axis="y" values={shortcuts} onReorder={setShortcuts} style={{ listStyle: 'none', padding: 0 }}>
                {shortcuts.map(s => (
                  <Reorder.Item key={s.id} value={s} style={{ marginBottom: '0.5rem' }}>
                    <div className="shortcut-item-edit">
                      <span className="drag-handle">☰</span>
                      <input
                        value={s.label}
                        onChange={e => updateShortcut(s.id, e.target.value)}
                      />
                      <button className="delete-btn" onClick={() => deleteShortcut(s.id)}>×</button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <button className="insert-btn" onClick={addShortcut}>+ ボタンを追加</button>
            </div>
            <button className="close-modal-btn" onClick={() => setIsShortcutSettingsOpen(false)}>閉じる</button>
          </div>
        </div>
      )}

      {isAppSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsAppSettingsOpen(false)}>
          <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
            <h2>アプリ設定</h2>

            <div className="settings-section">
              <h3>表示設定 (Appearance)</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={appearance.showScrollButtons}
                    onChange={e => setAppearance({ ...appearance, showScrollButtons: e.target.checked })}
                  />
                  スクロールボタンを表示する
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>エクスポート設定</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={exportSettings.includeHeaderDate}
                    onChange={e => setExportSettings({ ...exportSettings, includeHeaderDate: e.target.checked })}
                  />
                  ヘッダーに日付を含める ({formatDisplayDate(selectedDate)})
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={exportSettings.includeLogDate}
                    onChange={e => setExportSettings({ ...exportSettings, includeLogDate: e.target.checked })}
                  />
                  ログ各行に日付を含める
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={exportSettings.includeSeconds}
                    onChange={e => setExportSettings({ ...exportSettings, includeSeconds: e.target.checked })}
                  />
                  秒数を含める
                </label>
              </div>
              <div className="setting-item">
                <label>区切り文字:</label>
                <select
                  value={exportSettings.delimiter}
                  onChange={e => setExportSettings({ ...exportSettings, delimiter: e.target.value as any })}
                >
                  <option value="space">スペース</option>
                  <option value="tab">タブ (Tab)</option>
                  <option value="comma">カンマ (CSV)</option>
                </select>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={exportSettings.quoteText}
                    onChange={e => setExportSettings({ ...exportSettings, quoteText: e.target.checked })}
                  />
                  テキストを " " で囲む
                </label>
              </div>
              <div className="setting-item">
                <label>改行の扱い:</label>
                <select
                  value={exportSettings.newlineHandling}
                  onChange={e => setExportSettings({ ...exportSettings, newlineHandling: e.target.value as any })}
                >
                  <option value="keep">そのまま (Keep)</option>
                  <option value="space">スペースに置換</option>
                  <option value="escape">¥n (リテラル)に置換</option>
                </select>
              </div>
            </div>

            <button className="close-modal-btn" onClick={() => setIsAppSettingsOpen(false)}>閉じる</button>
          </div>
        </div>
      )}

      {isCalendarOpen && (
        <CalendarPicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          datesWithData={datesWithData}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}
    </div>
  )
}

export default App
