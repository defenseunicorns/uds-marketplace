// SPDX-License-Identifier: Apache-2.0
import { type Application, Architecture, Category, Infrastructure } from '$lib/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applicationStore } from './applicationstore';

describe('applicationsStore', () => {
  const sampleApp: Application = {
    metadata: { name: 'app1' },
    spec: {
      title: 'App 1',
      description: 'This is app 1',
      vendor: { name: 'Vendor 1', url: 'https://vendor1.com' },
      categories: [Category.Security],
      infrastructure: [Infrastructure.OnPrem],
      architecture: [Architecture.Amd64]
    }
  } as Application;

  const anotherApp: Application = {
    metadata: { name: 'app2' },
    spec: {
      title: 'App 2',
      description: 'This is app 2',
      vendor: { name: 'Vendor 2', url: 'https://vendor2.com' },
      categories: [Category.Arcade],
      infrastructure: [Infrastructure.AWSGovCloudUS],
      architecture: [Architecture.Arm64]
    }
  } as Application;

  beforeEach(() => {
    applicationStore.update((store) => ({
      ...store,
      loading: false,
      error: undefined,
      appMap: new Map(),
      filteredApplications: [],
      selectedFilters: new Map(),
      searchQuery: ''
    }));
  });

  it('should populate catalog and miniSearch', () => {
    applicationStore.populateCatalog([sampleApp, anotherApp]);
    expect(applicationStore.getApplications().length).toEqual(2);
  });

  it('should get application by name', () => {
    applicationStore.populateCatalog([sampleApp, anotherApp]);
    expect(applicationStore.getAppByName('app1')).toEqual(sampleApp);
    expect(applicationStore.getAppByName('nonexistent')).toBeUndefined();
  });

  it('should search applications', () => {
    applicationStore.populateCatalog([sampleApp, anotherApp]);
    applicationStore.setSearchQuery('app1');
    applicationStore.filterApplications();
    let filteredApps: Application[] = [];
    applicationStore.subscribe((store) => {
      filteredApps = store.filteredApplications;
    })();
    expect(filteredApps[0]).toStrictEqual(sampleApp);

    applicationStore.setSearchQuery('vendor 2');
    applicationStore.filterApplications();
    applicationStore.subscribe((store) => {
      filteredApps = store.filteredApplications;
    })();
    expect(filteredApps[0]).toStrictEqual(anotherApp);

    applicationStore.setSearchQuery('nonexistent');
    applicationStore.filterApplications();
    applicationStore.subscribe((store) => {
      filteredApps = store.filteredApplications;
    })();
    expect(filteredApps.length).toBe(0);
  });

  it('should filter applications', () => {
    applicationStore.populateCatalog([sampleApp, anotherApp]);
    const filters = new Map([
      ['spec.categories', [Category.Security]],
      ['spec.infrastructure', [Infrastructure.OnPrem]]
    ]);
    applicationStore.setSelectedFilters(filters);
    applicationStore.filterApplications();
    let filteredApps: Application[] = [];
    applicationStore.subscribe((store) => {
      filteredApps = store.filteredApplications;
    })();
    expect(filteredApps).toEqual([sampleApp]);
  });

  it('should sort applications alphabetically after fetching (before any search is triggered)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [anotherApp, sampleApp] // reverse alphabetical order
    });

    await applicationStore.fetchCatalog();
    let filteredApps: Application[] = [];
    applicationStore.subscribe((store) => {
      filteredApps = store.filteredApplications;
    })();
    expect(filteredApps).toEqual([sampleApp, anotherApp]);
  });

  it('should fetch catalog', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [sampleApp, anotherApp]
    });

    await applicationStore.fetchCatalog();
    expect(applicationStore.getApplications()).toEqual([sampleApp, anotherApp]);
  });

  it('should handle fetch errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found'
    });

    await applicationStore.fetchCatalog();
    let error: string | undefined;
    applicationStore.subscribe((store) => {
      error = store.error;
    })();
    expect(error).toBe('Failed to fetch applications: Not Found');
  });
});
