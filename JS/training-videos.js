// Cargar y renderizar videos de entrenamiento
document.addEventListener('DOMContentLoaded', function() {
    const videosGrid = document.getElementById('videos-grid');
    if (!videosGrid) return;

    function renderVideos(videos) {
        videosGrid.innerHTML = '';

        if (!videos || videos.length === 0) {
            videosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No videos added yet.</p>';
            return;
        }

        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.dataset.categories = video.categories?.join(',') || '';

            card.innerHTML = `
                <video class="plyr-video" controls playsinline>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support video.
                </video>
                <h3>${video.title}</h3>
                <p>${video.description || ''}</p>
            `;
            videosGrid.appendChild(card);
        });

        // Inicializar Plyr en los videos
        if (typeof Plyr !== 'undefined') {
            document.querySelectorAll('.plyr-video').forEach(video => {
                new Plyr(video);
            });
        }
    }

    // Cargar videos
    function loadVideos() {
        const backup = localStorage.getItem('training_videos_backup');
        const backupTime = localStorage.getItem('training_videos_backup_time');
        const hasRecentBackup = backup && backupTime && (Date.now() - new Date(backupTime)) / (1000 * 60 * 60) < 24;

        if (hasRecentBackup) {
            try {
                renderVideos(JSON.parse(backup));
                return;
            } catch (e) {
                console.error('Error loading backup:', e);
            }
        }

        fetch('/site-data.json')
            .then(response => {
                if (!response.ok) throw new Error('Could not load site-data.json');
                return response.json();
            })
            .then(data => {
                renderVideos(data.training_videos || []);
            })
            .catch(error => {
                console.error('Error loading videos:', error);
                if (backup) {
                    try {
                        renderVideos(JSON.parse(backup));
                    } catch (e) {
                        videosGrid.innerHTML = '<p style="color: red; text-align: center;">Error loading videos</p>';
                    }
                }
            });
    }

    loadVideos();

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            document.querySelectorAll('.video-card').forEach(card => {
                if (filter === 'all' || card.dataset.categories.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});