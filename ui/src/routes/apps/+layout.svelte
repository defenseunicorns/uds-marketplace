<script lang="ts">
  import { applicationStore } from '$lib/stores';
  import { onMount } from 'svelte';
  import Sidebar from '$lib/features/catalog/Sidebar/Sidebar.svelte';

  onMount(async () => {
    await applicationStore.fetchCatalog();
  });
</script>

<Sidebar routes={['/apps']} />
<div class="max-w-[calc(100% - var(--sidebar-width))] w-full">
  <slot />
</div>
