export interface LogEntry {
    id: string;
    time: string; // ISO string for sorting, or HH:mm for display
    date: string; // YYYY-MM-DD for grouping
    text: string;
    order: number;
}

export interface Shortcut {
    id: string;
    label: string;
}

export interface AppTheme {
    mode: 'light' | 'dark';
}
