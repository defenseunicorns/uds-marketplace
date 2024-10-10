<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2024-Present The UDS Authors -->
<script lang="ts">
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import tailwindConfig from '$lib/tailwind-config';
  import { Category, Security, Infrastructure } from '$lib/types';
  import { ChevronDown } from 'carbon-icons-svelte';
  import { applicationStore, type Filter } from '$lib/stores';
  import type {
    CatalogStore,
    SelectedFilters
  } from '$lib/stores/applicationstore/applicationstore';
  import { SearchInput } from '$lib/components';

  export const isOpen = writable(true);
  export let routes: string[] = [];

  const sidebarFilters: Filter[] = [
    {
      label: 'Category',
      values: Object.values(Category) as string[],
      field: 'spec.categories'
    },
    {
      label: 'Supported Infrastructure',
      values: (() => {
        // Types are auto-generated in alphabetical order, but we want to manually order "Edge" to the end
        const infraValues = Object.values(Infrastructure) as string[];
        const edgeIndex = infraValues.indexOf(Infrastructure.Edge);
        if (edgeIndex !== -1) {
          // Remove "on-prem" from its current position
          const [onPrem] = infraValues.splice(edgeIndex, 1);
          // Add "on-prem" to the end of the array
          infraValues.push(onPrem);
        }

        return infraValues;
      })(),
      field: 'spec.infrastructure'
    },
    {
      label: 'Security',
      values: Object.values(Security) as string[],
      field: 'spec.security'
    }
  ];

  let innerWidth: number;
  let selectedFilters: SelectedFilters;
  let openedFilters: { [key: string]: boolean } = { [sidebarFilters[0].label]: true };
  let scrolling = false;

  const mdBreakpoint = parseInt(tailwindConfig.theme.screens.md);

  // Subscribe to the application store
  const unsubscribeCatalog = applicationStore.subscribe((store) => {
    selectedFilters = store.selectedFilters;
  });

  // Toggle the collapsed state of a filter

  function toggleFilter(filter: string) {
    openedFilters[filter] = !openedFilters[filter];
  }

  // Handle filter change
  function handleFilterChange(filter: Filter, category: string) {
    applicationStore.update((store: CatalogStore) => {
      // Update the selected filters
      const filterValues = store.selectedFilters.get(filter.field) || [];

      // Add or remove the category from the selected filters
      if (!filterValues.includes(category)) {
        filterValues.push(category);
      } else {
        filterValues.splice(filterValues.indexOf(category), 1);
      }

      // Update the selected filters
      store.selectedFilters.set(filter.field, filterValues);
      return store;
    });

    // Filter the applications
    applicationStore.filterApplications();
  }

  // Clear the selected filters
  function clearFilters() {
    applicationStore.setSelectedFilters(new Map());
    applicationStore.filterApplications();
  }

  // Update the sidebar visibility on window resize
  function handleResize() {
    isOpen.set(!isSmallScreen);
  }

  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearFilters();
      unsubscribeCatalog();
      window.removeEventListener('resize', handleResize);
    };
  });

  $: isSmallScreen = innerWidth < mdBreakpoint;
  $: isValidRoute = routes.includes($page.url.pathname);
  $: {
    if (isSmallScreen) {
      clearFilters();
    }
  }

  function handleSearch(searchQuery: string) {
    applicationStore.setSearchQuery(searchQuery);
    applicationStore.filterApplications();
  }
</script>

<svelte:window bind:innerWidth on:resize={handleResize} />

{#if isValidRoute}
  <div
    id="filter-sidebar"
    class="custom-scroll flex max-h-[calc(100vh-var(--navbar-height))] w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] flex-col items-start justify-start gap-3 overflow-y-auto border-r border-gray-700 bg-gray-800"
    class:translate-x-0={$isOpen}
    class:-translate-x-full={!$isOpen}
    class:hidden={isSmallScreen}
    class:md:block={!isSmallScreen}
    class:scroll-active={scrolling}
    on:scroll={() => (scrolling = true)}
    on:scrollend={() => (scrolling = false)}
  >
    <div>
      <div class="sticky top-0 z-10 bg-gray-800 p-4">
        <div class="flex items-center justify-between pb-3">
          <h6 class="text-sm font-medium text-black dark:text-white">Filters</h6>
          <div class="flex items-center space-x-3">
            <button
              on:click={clearFilters}
              class="text-primary-600 dark:text-primary-500 flex items-center text-sm font-medium text-blue-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
        <SearchInput {handleSearch} />
      </div>
      {#each sidebarFilters as filter}
        <div class="flex w-full flex-col items-start justify-start gap-3 p-4">
          <button
            class="flex w-full items-center justify-between text-start text-base font-semibold text-white"
            on:click={() => toggleFilter(filter.label)}
          >
            <span>{filter.label}</span>
            <span
              class="h-5 w-5 transform transition-transform duration-200"
              class:rotate-180={!openedFilters[filter.label]}
            >
              <ChevronDown />
            </span>
          </button>
          <div
            class:hidden={!openedFilters[filter.label]}
            id="filter-values-{filter.label}"
            class="mt-2 flex w-full flex-col items-start justify-start gap-3"
          >
            {#each filter.values || [] as category}
              <div class="flex w-full items-center justify-start">
                <label class="flex items-center gap-2 rounded" for={`category-${category}`}>
                  <input
                    id={`category-${category}`}
                    type="checkbox"
                    checked={selectedFilters.get(filter.field)?.includes(category)}
                    on:change={() => handleFilterChange(filter, category)}
                    class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-white">{category}</span>
                </label>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
