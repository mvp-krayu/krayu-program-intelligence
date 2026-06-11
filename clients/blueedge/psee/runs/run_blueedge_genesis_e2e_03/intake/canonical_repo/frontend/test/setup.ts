// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Test Setup (Vitest + Testing Library)
// ══════════════════════════════════════════════════════════════

import '@testing-library/jest-dom';

// ── Mock WebSocket Context ──
vi.mock('@/socket', () => ({
  useSocketContext: () => ({ connected: true, socket: null }),
  useSocketEvent: vi.fn(),
  useFleetPositions: () => ({ positions: [], count: 5 }),
  SocketProvider: ({ children }: any) => children,
}));

// ── Mock API Client ──
vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
  apiRequest: vi.fn().mockResolvedValue({ data: {} }),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(() => 'mock-token'),
  setOnUnauthorized: vi.fn(),
}));

// ── Mock useToast ──
vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useToast: () => ({
      show: vi.fn(),
      Toast: () => null,
    }),
    usePrefs: () => ({
      prefs: { darkMode: true, compactView: false, showMap: true },
      setPref: vi.fn(),
      resetPrefs: vi.fn(),
    }),
    useApi: (url: string) => ({
      data: { items: [], total: 0 },
      loading: false,
      error: null,
      refetch: vi.fn(),
    }),
    useApiMutation: () => ({
      mutate: vi.fn().mockResolvedValue({}),
      saving: false,
    }),
  };
});

// ── Mock useApiQuery ──
vi.mock('@/hooks/useApiQuery', () => ({
  useApiQuery: (fn: any) => ({
    data: { items: [], total: 0 },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useApiMutation: () => ({
    mutate: vi.fn().mockResolvedValue({}),
    saving: false,
  }),
}));

// ── Mock Chart.js (canvas not available in jsdom) ──
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  ArcElement: vi.fn(),
  BarElement: vi.fn(),
  CategoryScale: vi.fn(),
  Filler: vi.fn(),
  Legend: vi.fn(),
  LineElement: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  DoughnutController: vi.fn(),
  PieController: vi.fn(),
}));

vi.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
  Doughnut: () => null,
  Pie: () => null,
}));

// ── Mock Leaflet ──
vi.mock('leaflet', () => ({
  map: vi.fn(),
  tileLayer: vi.fn(),
  marker: vi.fn(),
  icon: vi.fn(),
  latLng: vi.fn(),
  default: { map: vi.fn(), tileLayer: vi.fn(), marker: vi.fn(), icon: vi.fn() },
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => children,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  Polyline: () => null,
  Circle: () => null,
  useMap: () => ({ setView: vi.fn(), fitBounds: vi.fn() }),
}));

// ── Mock Router ──
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  };
});

// ── Global matchMedia mock ──
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── ResizeObserver mock ──
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── Canvas mock for charts ──
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(), clearRect: vi.fn(), getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(), createImageData: vi.fn(() => []), setTransform: vi.fn(),
  drawImage: vi.fn(), save: vi.fn(), fillText: vi.fn(), restore: vi.fn(),
  beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(),
  stroke: vi.fn(), translate: vi.fn(), scale: vi.fn(), rotate: vi.fn(),
  arc: vi.fn(), fill: vi.fn(), measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(), rect: vi.fn(), clip: vi.fn(),
  canvas: { width: 800, height: 600 },
});
