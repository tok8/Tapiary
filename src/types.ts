export interface LogEntry {
    id: string;
    time: string; // ISO string for sorting, or HH:mm for display
    date: string; // YYYY-MM-DD for grouping
    text: string;
    order: number;
    parentId?: string; // ID of the log directly above. undefined if at top or has its own time.
    createdAt?: number; // Timestamp for stable tie-breaking
}

export interface Shortcut {
    id: string;
    label: string;
}

export interface AppTheme {
    mode: 'light' | 'dark';
}

export interface ExportSettings {
    includeHeaderDate: boolean;
    includeLogDate: boolean;
    includeSeconds: boolean;
    delimiter: 'space' | 'tab' | 'comma';
    quoteText: boolean;
    newlineHandling: 'keep' | 'space' | 'escape';
}

export interface AppearanceSettings {
    showScrollButtons: boolean;
}
