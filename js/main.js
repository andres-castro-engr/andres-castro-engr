document.querySelectorAll('.video-placeholder').forEach(function(place){
    var play = place.querySelector('.play-btn');
    var video = place.querySelector('video.card-video');
    if(!play || !video) return;
    video.style.display = 'none';

    function showAndPlay(){
        place.classList.add('video-playing');
        function doPlay(){
            video.style.display = 'block';
            var p = video.play();
            if(p && p.catch) p.catch(function(err){ console.warn('video play failed:', err); });
        }

        // Ensure `src` is set from `data-src` so the video can load/play.
        if(!video.src){
            var ds = video.getAttribute('data-src') || video.dataset.src;
            if(ds){
                video.src = ds;
            }
        }

        if(video.readyState >= 1){ 
            doPlay();
        } else {
            var onMeta = function(){
                video.removeEventListener('loadedmetadata', onMeta);
                doPlay();
            };
            video.addEventListener('loadedmetadata', onMeta);
            try { video.load(); } catch(e){ console.warn('video load failed:', e); }
        }
    }

    play.addEventListener('click', function(e){
        e.stopPropagation();
        showAndPlay();
    });

    video.addEventListener('ended', function(){
        video.currentTime = 0;
        place.classList.remove('video-playing');
        video.style.display = 'none';
    });
});

