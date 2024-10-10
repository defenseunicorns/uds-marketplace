<script lang="ts">
  import 'flowbite';
  import { initFlowbite } from 'flowbite';
  import 'flowbite/dist/flowbite.css';
  import { afterNavigate } from '$app/navigation';
  import { Navbar } from '$lib/features/navigation';
  import '../app.postcss';
  import Footer from '$lib/components/Footer.svelte';

  afterNavigate(initFlowbite);
</script>

<div class="flex min-h-screen flex-col transition-all duration-300 ease-in-out dark:text-white">
  <Navbar />

  <main class="mt-[var(--navbar-height)] flex h-full flex-1">
    <slot />
  </main>
  <Footer />
</div>
