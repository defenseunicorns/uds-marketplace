<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2024-Present The UDS Authors -->

<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  let navElement: HTMLElement;

  // Updates the --nav-height css variable
  function updateNavHeight() {
    if (navElement) {
      const navHeight = navElement.offsetHeight;
      document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
    }
  }

  // update the nav height on mount and resize using window.addEventListener
  onMount(() => {
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => {
      window.removeEventListener('resize', updateNavHeight);
    };
  });
  // ensure the nav height is updated when the page is updated specifically ensures subroutes are updated such as /apps/[:id]
  afterUpdate(updateNavHeight);
</script>

<nav
  bind:this={navElement}
  class="fixed left-0 right-0 top-0 z-50 h-[var(--navbar-height)] border-b border-gray-200 bg-gray-800 px-6 py-2.5 dark:border-gray-700"
>
  <div class="flex flex-col items-center justify-between sm:flex-row">
    <div class="mb-4 flex w-full items-center justify-between sm:mb-0 sm:w-auto">
      <a href="/" class="flex items-center text-2xl font-medium leading-9 text-white">
        <img src="/doug.svg" alt="airgap appstore logo" />
        <span>Airgap App Store</span>
      </a>
    </div>
  </div>
</nav>
