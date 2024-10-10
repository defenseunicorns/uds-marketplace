<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Close } from 'carbon-icons-svelte';

  export let searchQuery = '';
  export let handleSearch: (searchQuery: string) => void = (searchQuery: string) => {
    console.log('searchQuery', searchQuery);
    console.log('Replace in props');
  };

  let isFocused = false;
  let hasFocusedOnce = false;
  let timeoutId: number | undefined;
  let searchInput: HTMLInputElement;

  function debouncedSearch(query: string) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      if (hasFocusedOnce) {
        handleSearch(query);
      }
    }, 500) as unknown as number;
  }

  function clearSearch() {
    searchQuery = '';
    handleSearch('');
    searchInput.focus();
  }

  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInput.focus();
      }
      if ((event.key === 'Escape' || event.key === 'Esc') && isFocused) {
        clearSearch();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  $: {
    debouncedSearch(searchQuery);
  }
</script>

<form class="mx-auto w-full max-w-md">
  <label for="application-search" class="sr-only text-sm font-medium text-gray-900 dark:text-white">
    Search
  </label>
  <div class="relative">
    <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
      <Search class="h-4 w-4 text-gray-500 dark:text-gray-400 md:h-5 md:w-5" />
    </div>
    <input
      bind:this={searchInput}
      type="search"
      id="application-search"
      class="block h-[2.3125rem] w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pe-10 ps-8 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:p-4 md:pe-14 md:ps-10 md:text-sm [&::-webkit-search-cancel-button]:hidden"
      placeholder="Search apps"
      bind:value={searchQuery}
      on:focus={() => {
        isFocused = true;
        hasFocusedOnce = true;
      }}
      on:blur={() => (isFocused = false)}
    />
    <div class="absolute inset-y-0 end-0 flex items-center pe-2 md:pe-3">
      {#if searchQuery}
        <button
          type="button"
          class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          on:click|preventDefault={clearSearch}
        >
          <Close class="h-4 w-4 md:h-6 md:w-6" />
        </button>
      {/if}
    </div>
  </div>
</form>
