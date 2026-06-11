// ══════════════════════════════════════════════════════════════
// Global Type Declarations for Blue Edge Fleet Management
// ══════════════════════════════════════════════════════════════

// Leaflet (loaded via CDN)
declare const L: any;

// Chart.js (loaded via CDN)
declare const Chart: any;

// Lucide React Icons (used across components)
declare const DownloadIcon: React.FC<any>;
declare const PrinterIcon: React.FC<any>;
declare const FileJsonIcon: React.FC<any>;
declare const SearchIcon: React.FC<any>;
declare const ChevronLeftIcon: React.FC<any>;
declare const ChevronRightIcon: React.FC<any>;

// Vite env
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
