import { c as createComponent, a as createAstro, b as addAttribute, r as renderHead, d as renderSlot, e as renderTemplate } from './astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */

const $$Astro = createAstro();
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Test Automation Agent Dashboard"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> <div class="min-h-screen flex flex-col"> <header class="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-primary to-accent text-white shadow-md gradient-bg"> <div class="container flex h-16 items-center px-6"> <div class="mr-4 flex"> <a href="/" class="flex items-center space-x-2 group"> <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md transition-transform transform group-hover:scale-110"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-primary"> <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z"></path> <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z"></path> <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z"></path> </svg> </div> <span class="font-bold text-xl tracking-tight">Test Automation Agent</span> </a> </div> <nav class="flex items-center space-x-3 lg:space-x-4 mx-6"> <a href="/" class="text-sm font-medium transition-colors hover:text-white hover:bg-primary/20 px-4 py-2 rounded-md border border-white/10 hover:border-white/30 active:scale-95">
Dashboard
</a> <a href="/tests" class="text-sm font-medium text-white/90 transition-colors hover:text-white hover:bg-primary/20 px-4 py-2 rounded-md border border-white/10 hover:border-white/30 active:scale-95">
Test Suites
</a> <a href="/reports" class="text-sm font-medium text-white/90 transition-colors hover:text-white hover:bg-primary/20 px-4 py-2 rounded-md border border-white/10 hover:border-white/30 active:scale-95">
Reports
</a> <a href="/manual-tests" class="text-sm font-medium text-white/90 transition-colors hover:text-white hover:bg-primary/20 px-4 py-2 rounded-md border border-white/10 hover:border-white/30 active:scale-95">
Manual Tests
</a> <a href="/config" class="text-sm font-medium text-white/90 transition-colors hover:text-white hover:bg-primary/20 px-4 py-2 rounded-md border border-white/10 hover:border-white/30 active:scale-95">
Configuration
</a> </nav> </div> </header> <div class="page-transition-enter page-transition-enter-active"> <main class="flex-1 container py-8 px-6"> ${renderSlot($$result, $$slots["default"])} </main> </div> <footer class="border-t py-6 bg-gradient-to-r from-primary/5 to-accent/5"> <div class="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row px-6"> <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Test Automation Agent. All rights reserved.
</p> <div class="flex space-x-4"> <a href="/config" class="text-sm text-muted-foreground hover:text-accent transition-colors">Settings</a> <a href="#" class="text-sm text-muted-foreground hover:text-accent transition-colors">Documentation</a> <a href="#" class="text-sm text-muted-foreground hover:text-accent transition-colors">Support</a> </div> </div> </footer> </div> </body></html>`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $ };
