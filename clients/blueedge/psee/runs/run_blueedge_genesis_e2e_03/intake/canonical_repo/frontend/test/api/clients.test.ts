import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/api/client';
import { vehiclesApi } from '@/api/vehicles';
import { driversApi } from '@/api/drivers';
import { tripsApi } from '@/api/trips';
import { alertsApi } from '@/api/alerts';
import { safetyApi } from '@/api/safety';
import { tankerApi } from '@/api/tanker';
import { busApi } from '@/api/bus';
import { taxiApi } from '@/api/taxi';
import { evApi } from '@/api/ev';
import { blockchainApi } from '@/api/blockchain';

describe('API Clients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('vehiclesApi', () => {
    it('list() calls GET /vehicles', async () => {
      await vehiclesApi.list();
      expect(api.get).toHaveBeenCalledWith('/vehicles');
    });
    it('list() with params appends query string', async () => {
      await vehiclesApi.list({ status: 'active', page: 1 });
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/vehicles?'));
    });
    it('getById() calls GET /vehicles/:id', async () => {
      await vehiclesApi.getById('v-123');
      expect(api.get).toHaveBeenCalledWith('/vehicles/v-123');
    });
  });

  describe('driversApi', () => {
    it('list() calls GET /drivers', async () => {
      await driversApi.list();
      expect(api.get).toHaveBeenCalledWith('/drivers');
    });
    it('getById() calls GET /drivers/:id', async () => {
      await driversApi.getById('d-456');
      expect(api.get).toHaveBeenCalledWith('/drivers/d-456');
    });
  });

  describe('tripsApi', () => {
    it('list() calls GET /trips', async () => {
      await tripsApi.list();
      expect(api.get).toHaveBeenCalledWith('/trips');
    });
  });

  describe('alertsApi', () => {
    it('list() calls GET /alerts', async () => {
      await alertsApi.list();
      expect(api.get).toHaveBeenCalledWith('/alerts');
    });
  });

  describe('safetyApi', () => {
    it('getDashboard() calls GET /safety/dashboard', async () => {
      await safetyApi.getDashboard();
      expect(api.get).toHaveBeenCalledWith('/safety/dashboard');
    });
    it('getIncidents() calls GET /safety/incidents', async () => {
      await safetyApi.getIncidents();
      expect(api.get).toHaveBeenCalledWith('/safety/incidents');
    });
    it('createIncident() calls POST /safety/incidents', async () => {
      const data = { type: 'collision', severity: 'high' };
      await safetyApi.createIncident(data);
      expect(api.post).toHaveBeenCalledWith('/safety/incidents', data);
    });
  });

  describe('tankerApi', () => {
    it('list() calls GET /tanker', async () => {
      await tankerApi.list();
      expect(api.get).toHaveBeenCalledWith('/tanker');
    });
  });

  describe('busApi', () => {
    it('list() calls GET /bus', async () => {
      await busApi.list();
      expect(api.get).toHaveBeenCalledWith('/bus');
    });
  });

  describe('taxiApi', () => {
    it('list() calls GET /taxi', async () => {
      await taxiApi.list();
      expect(api.get).toHaveBeenCalledWith('/taxi');
    });
  });

  describe('evApi', () => {
    it('getDashboard() calls GET /ev/dashboard', async () => {
      await evApi.getDashboard();
      expect(api.get).toHaveBeenCalledWith('/ev/dashboard');
    });
    it('startCharging() calls POST', async () => {
      await evApi.startCharging('ev-1', { power: 50 });
      expect(api.post).toHaveBeenCalledWith('/ev/ev-1/charging/start', { power: 50 });
    });
  });

  describe('blockchainApi', () => {
    it('list() calls GET /blockchain', async () => {
      await blockchainApi.list();
      expect(api.get).toHaveBeenCalledWith('/blockchain');
    });
    it('create() calls POST /blockchain', async () => {
      const data = { recordType: 'custody_transfer' };
      await blockchainApi.create(data);
      expect(api.post).toHaveBeenCalledWith('/blockchain', data);
    });
  });

  describe('All clients have standard CRUD', () => {
    const clients = [
      ['vehicles', vehiclesApi],
      ['drivers', driversApi],
      ['trips', tripsApi],
      ['alerts', alertsApi],
      ['safety', safetyApi],
      ['tanker', tankerApi],
      ['bus', busApi],
      ['taxi', taxiApi],
      ['ev', evApi],
      ['blockchain', blockchainApi],
    ] as const;

    for (const [name, client] of clients) {
      it(`${name}Api has list method`, () => {
        expect(typeof client.list).toBe('function');
      });
      it(`${name}Api has getById method`, () => {
        expect(typeof client.getById).toBe('function');
      });
      it(`${name}Api has create method`, () => {
        expect(typeof client.create).toBe('function');
      });
    }
  });
});
