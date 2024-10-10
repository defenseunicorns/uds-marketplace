<script lang="ts">
  import { base } from '$app/paths';
  import { twMerge } from 'tailwind-merge';

  const responsiveImageStyling = 'w-[50%] sm:w-[33%]  2xl:w-auto';

  type Link = { title: string; href: string; external?: boolean };
  const sections: { [category: string]: Link[] } = {
    'For Missions': [
      { title: 'Benefits of Deploying on UDS', href: '/benefits' },
      {
        title: 'Available Contracting Vehicles',
        href: 'https://www.defenseunicorns.com/contracts',
        external: true
      },
      { title: 'Request An App Not in App Store', href: '/request' }
    ],
    'Defense Unicorns': [
      { title: 'About Company', href: 'https://www.defenseunicorns.com/', external: true },
      { title: 'Products', href: 'https://www.defenseunicorns.com/uds', external: true },
      { title: 'Contact Us', href: 'https://www.defenseunicorns.com/contactus', external: true }
    ],
    'For Partners': [
      { title: 'Contact Vendor Relations', href: 'mailto:sam.k@defenseunicorns.com' }
    ]
  };
</script>

<div id="footer">
  <div
    id="guarantee"
    class=" flex w-full flex-col items-center justify-center gap-5 bg-[url('/images/doug_world_official_faded.png')] bg-[length:100%_458.084%] bg-[position:-1.761px_-15.844px] bg-no-repeat"
  >
    <div class="2xl:w-8/10 flex w-11/12 flex-col items-center justify-between sm:flex-row xl:w-4/5">
      <img
        alt="unicorn guarantee"
        src="{base}/images/unicorn_guarantee.png"
        class={twMerge('h-auto py-4 xl:py-8', responsiveImageStyling)}
      />
      <div class="flex flex-col items-center gap-2 pb-[0.87rem] pt-4 2xl:pt-8">
        <img
          alt="within 2 weeks"
          src="{base}/images/within_2_weeks.png"
          class={twMerge('h-auto', responsiveImageStyling)}
        />
        <div class="text-center text-sm font-medium 2xl:text-xl">
          <div>Your chosen applications will be deliverable to your target environment</div>
          <div>with documentation for an ATO</div>
        </div>
        <div class="text-center text-xs font-light leading-tight text-gray-400">
          *Guaranteed timeline is for supported infrastructures. Timeline starts after the
          completion of technical prerequisites.
        </div>
      </div>
    </div>
  </div>

  <div id="links" class="flex w-full justify-center">
    <div class="flex w-4/5 flex-col justify-between gap-8 py-16 sm:flex-row">
      {#each Object.entries(sections) as section}
        <div
          id={`link-section-${section[0]}`}
          class="flex w-full flex-col items-center gap-4 sm:items-start"
        >
          <div class="text-sm font-semibold uppercase">{section[0]}</div>
          {#each section[1] as link}
            <a href={link.href} class="link" target={link.external ? '_blank' : ''}>{link.title}</a>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <div id="copyright" class="flex w-full justify-center bg-gray-800 py-8">
    <div class="flex flex-col items-center">
      <div class="text-center text-xl font-medium">Created By</div>
      <img alt="Defense Unicorns" src="{base}/images/defense_unicorns.png" class="w-[262px]" />
      <div class="text-center text-gray-400">
        © 2024 Defense Unicorns, Inc. All rights reserved.
      </div>
    </div>
  </div>
</div>
