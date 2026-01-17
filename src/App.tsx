import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import type { LogEntry, Shortcut } from './types'

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

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getTodayStr())
  const datePickerRef = useRef<HTMLInputElement>(null)

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

  const sortLogs = (list: LogEntry[]) => {
    return [...list].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.time && b.time) {
        if (a.time !== b.time) return a.time.localeCompare(b.time);
      }
      return a.order - b.order;
    });
  };

  const sortedLogs = useMemo(() => sortLogs(logs), [logs]);

  const normalizeOrders = (list: LogEntry[]) => {
    return list.map((item, index) => ({ ...item, order: index + 1 }));
  };

  const filteredLogs = useMemo(() => {
    return sortedLogs.filter(log => log.date === selectedDate)
  }, [sortedLogs, selectedDate])

  const addLog = (text = '', dateStr?: string, timeStr?: string, afterId?: string, noTime = false, insertBeforeFirst = false) => {
    const now = new Date()
    const targetDate = dateStr || selectedDate
    const isToday = targetDate === getTodayStr()
    const newEntry: LogEntry = {
      id: crypto.randomUUID(),
      date: targetDate,
      time: noTime ? '' : (timeStr || (isToday ? now.toTimeString().slice(0, 5) : '')),
      text: text,
      order: 0
    }

    let nextLogs: LogEntry[];
    if (insertBeforeFirst) {
      const index = logs.findIndex(l => l.date === targetDate)
      nextLogs = [...logs];
      if (index !== -1) {
        nextLogs.splice(index, 0, newEntry);
      } else {
        nextLogs.push(newEntry);
      }
    } else if (afterId) {
      const index = logs.findIndex(l => l.id === afterId)
      nextLogs = [...logs];
      nextLogs.splice(index + 1, 0, newEntry);
    } else {
      nextLogs = [...logs, newEntry];
    }

    setLogs(normalizeOrders(nextLogs));
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
    if (confirm('ログを削除しますか？')) {
      const nextLogs = logs.filter(log => log.id !== id);
      setLogs(normalizeOrders(nextLogs));
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const exportAsText = () => {
    const header = `【${formatDisplayDate(selectedDate)}】\n`
    const body = filteredLogs.map(log => `${log.time || '--:--'} ${log.text}`).join('\n')
    const text = header + body
    navigator.clipboard.writeText(text)
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
          <button onClick={() => setIsSettingsOpen(true)} className="icon-btn" title="Settings">
            <SettingsIcon />
          </button>
        </div>
      </header>

      <main className="timeline">
        <div className="date-header">
          <button className="nav-btn" onClick={() => navigateDate(-1)}>◀</button>
          <div className="date-display" onClick={() => datePickerRef.current?.showPicker()}>
            {formatDisplayDate(selectedDate)}
          </div>
          <button className="nav-btn" onClick={() => navigateDate(1)}>▶</button>
          <input
            type="date"
            ref={datePickerRef}
            className="hidden-date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
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
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="card log-card">
                      <div className="time-wrapper">
                        <div className={`time-display-text ${!log.time ? 'is-empty' : ''}`}>
                          {log.time || '--:--'}
                        </div>
                        <input
                          type="time"
                          value={log.time}
                          onChange={(e) => updateLog(log.id, { time: e.target.value })}
                          className="time-input-overlay"
                        />
                      </div>
                      <textarea
                        value={log.text}
                        onChange={(e) => updateLog(log.id, { text: e.target.value })}
                        placeholder="メモを入力..."
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
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
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="shortcut-bar">
        {shortcuts.map(s => (
          <button key={s.id} onClick={() => addLog(s.label)}>{s.label}</button>
        ))}
        <button className="edit-shortcuts-btn" onClick={() => setIsSettingsOpen(true)} title="Edit buttons">
          <EditIcon />
        </button>
      </footer>

      <button className="add-main-btn" onClick={() => addLog()}>+</button>

      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>ボタン設定</h2>
            <div className="shortcut-edit-list">
              {shortcuts.map(s => (
                <div key={s.id} className="shortcut-item-edit">
                  <input
                    value={s.label}
                    onChange={e => updateShortcut(s.id, e.target.value)}
                  />
                  <button className="delete-btn" onClick={() => deleteShortcut(s.id)}>×</button>
                </div>
              ))}
              <button className="insert-btn" onClick={addShortcut}>+ ボタンを追加</button>
            </div>
            <button className="close-modal-btn" onClick={() => setIsSettingsOpen(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
