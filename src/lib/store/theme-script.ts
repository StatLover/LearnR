export const SETTINGS_KEY = "ra-settings";

/**
 * Runs before React hydrates (inlined in <head>) so the page never flashes the
 * wrong theme.
 */
export const themeBootScript = `(function(){try{var s=JSON.parse(localStorage.getItem('${SETTINGS_KEY}')||'{}');var t=s.theme||'system';if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;if(t==='dark'){r.classList.add('dark')}r.dataset.theme=t;r.dataset.fontSize=s.fontSize||'md';if(s.reduceMotion==='on'){r.dataset.reduceMotion='true'}if(s.editorFontSize){r.style.setProperty('--editor-font-size',s.editorFontSize+'px')}}catch(e){}})();`;
