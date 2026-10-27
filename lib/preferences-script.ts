export const THEME_KEY = "canopy-theme";
export const MOTION_KEY = "canopy-motion";

/**
 * Runs in <head> before first paint so the theme and motion choice never flash.
 * Keep it tiny and dependency-free.
 */
export const preferencesScript = `(function(){var d=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches;try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')d.dataset.theme=t;var m=localStorage.getItem('${MOTION_KEY}');d.dataset.motion=(m==='on'||m==='off')?m:(r?'off':'on')}catch(e){d.dataset.motion=r?'off':'on'}d.dataset.js='1'})()`;

