// --- Google Translate widget handling ---
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
    // signal ready
    window._gt_ready = true;
}
(function(){
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.defer = true;
    s.onload = function(){ window._gt_script_loaded = true; };
    document.body.appendChild(s);
})();

// --- Google Translate toggle handling ---
(function(){
    var toggle = document.getElementById('translate-toggle');
    var dropdown = document.getElementById('translate-dropdown');
    var gtEl = document.getElementById('google_translate_element');
    var searchInput = document.getElementById('translate-search');

    if(!toggle || !dropdown) return;

    function ensureGtReady(cb){
        if(window._gt_ready) return cb();
        var tries = 0;
        var iv = setInterval(function(){
            if(window._gt_ready || window._gt_script_loaded){ clearInterval(iv); return cb(); }
            if(++tries > 50){ clearInterval(iv); console.warn('Google Translate script not available'); }
        }, 200);
    }

    function openDropdown(){
        toggle.setAttribute('aria-expanded', 'true');
        dropdown.classList.remove('hidden');
        if(gtEl){
            gtEl.style.display = 'block';
            ensureGtReady(function(){
                // The widget initializes itself when the script loads.
                // Try focusing the select inside the widget (if present).
                try{
                    var sel = gtEl.querySelector('select');
                    if(sel) sel.focus();
                }catch(e){ /* ignore */ }
            });
        }
        if(searchInput) searchInput.focus();
    }

    function closeDropdown(){
        toggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.add('hidden');
    }

    toggle.addEventListener('click', function(e){
        e.stopPropagation();
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        if(expanded) closeDropdown(); else openDropdown();
    });

    // Close when clicking outside
    document.addEventListener('click', function(e){
        if(!dropdown.contains(e.target) && e.target !== toggle){
            closeDropdown();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeDropdown(); });
})();