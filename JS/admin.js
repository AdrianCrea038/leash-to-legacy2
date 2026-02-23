// js/admin.js - Panel de Administración CORREGIDO
// REEMPLAZA TODO el contenido de este archivo

document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin panel loaded');

  // =============================================
  // MENÚ - CAMBIO DE SECCIONES
  // =============================================
  const menuItems = document.querySelectorAll('.menu-item, .submenu li');
  const sections = document.querySelectorAll('.section');

  const serviceItem = document.querySelector('.menu-item.has-submenu');
  if (serviceItem) {
    serviceItem.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('active');
    });
  }

  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (this.classList.contains('has-submenu')) return;

      menuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      sections.forEach(sec => sec.classList.add('hidden'));

      const sectionKey = this.getAttribute('data-section');
      if (sectionKey) {
        const targetId = 'section-' + sectionKey;
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
      }
    });
  });

  // =============================================
  // FUNCIONES DE GUARDADO
  // =============================================
  async function getCurrentSiteData() {
    try {
      const response = await fetch('/site-data.json?' + Date.now());
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {}
    
    const backup = localStorage.getItem('site_data_backup');
    if (backup) {
      try {
        return JSON.parse(backup);
      } catch (e) {}
    }
    
    return {
      hero: { imagen: 'IMG/Perro home.png', subtitulo: 'DOG OBEDIENCE AND SERVICE DOG TRAINING' },
      about_us: { titulo: 'About Us', texto: '' },
      boarding: { titulo: 'Boarding Service', texto: '', imagen: 'IMG/Boarding-Service.png' },
      puppy: { titulo: 'Puppy Concierge', texto: '', imagen: 'IMG/Puppy-Concierge.png' },
      blog: { titulo: '', texto: '', imagen: 'IMG/bio.png' },
      redes_sociales: { facebook: '#', instagram: '#', tiktok: '#', youtube: '#', whatsapp: '#' },
      training_videos: [],
      email_recipient: 'shawn@leashtolegacy.org'
    };
  }

  async function saveSiteData(updatedData, message) {
    localStorage.setItem('site_data_backup', JSON.stringify(updatedData));
    localStorage.setItem('site_data_backup_time', new Date().toISOString());
    
    try {
      const response = await fetch('/.netlify/functions/update-site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        alert(message + ' ✅ (saved to GitHub)');
      } else {
        alert(message + ' ⚠️ (saved locally)');
      }
    } catch (error) {
      alert(message + ' ⚠️ (saved locally)');
    }
  }

  // =============================================
  // HERO SECTION
  // =============================================
  const heroImageInput = document.getElementById('hero-image-url');
  const heroPreviewImg = document.getElementById('preview-img');
  if (heroImageInput && heroPreviewImg) {
    heroImageInput.addEventListener('input', function() {
      heroPreviewImg.src = this.value.trim() || 'IMG/Perro home.png';
    });
  }

  const heroForm = document.getElementById('hero-form');
  if (heroForm) {
    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('hero-image-url').value = data.hero?.imagen || 'IMG/Perro home.png';
      document.getElementById('hero-subtitle').value = data.hero?.subtitulo || 'DOG OBEDIENCE AND SERVICE DOG TRAINING';
      if (heroPreviewImg) heroPreviewImg.src = data.hero?.imagen || 'IMG/Perro home.png';
    })();

    heroForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.hero = {
        imagen: document.getElementById('hero-image-url')?.value.trim() || 'IMG/Perro home.png',
        subtitulo: document.getElementById('hero-subtitle')?.value.trim() || 'DOG OBEDIENCE AND SERVICE DOG TRAINING'
      };
      await saveSiteData(currentData, 'Hero updated');
    });
  }

  // =============================================
  // ABOUT US
  // =============================================
  const aboutForm = document.getElementById('about-form');
  if (aboutForm) {
    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('about-title').value = data.about_us?.titulo || 'About Us';
      document.getElementById('about-content').value = data.about_us?.texto || '';
    })();

    aboutForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.about_us = {
        titulo: document.getElementById('about-title')?.value.trim() || 'About Us',
        texto: document.getElementById('about-content')?.value || ''
      };
      await saveSiteData(currentData, 'About Us updated');
    });
  }

  // =============================================
  // SOCIAL LINKS
  // =============================================
  const redesForm = document.getElementById('redes-form');
  if (redesForm) {
    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('facebook-url').value = data.redes_sociales?.facebook || '#';
      document.getElementById('instagram-url').value = data.redes_sociales?.instagram || '#';
      document.getElementById('tiktok-url').value = data.redes_sociales?.tiktok || '#';
      document.getElementById('youtube-url').value = data.redes_sociales?.youtube || '#';
      document.getElementById('whatsapp-url').value = data.redes_sociales?.whatsapp || '#';
    })();

    redesForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.redes_sociales = {
        facebook: document.getElementById('facebook-url')?.value || '#',
        instagram: document.getElementById('instagram-url')?.value || '#',
        tiktok: document.getElementById('tiktok-url')?.value || '#',
        youtube: document.getElementById('youtube-url')?.value || '#',
        whatsapp: document.getElementById('whatsapp-url')?.value || '#'
      };
      await saveSiteData(currentData, 'Social links updated');
    });
  }

  // =============================================
  // BLOG
  // =============================================
  const blogImageInput = document.getElementById('blog-image-url');
  const blogPreviewImg = document.getElementById('blog-preview-img');
  if (blogImageInput && blogPreviewImg) {
    blogImageInput.addEventListener('input', function() {
      blogPreviewImg.src = this.value.trim() || 'IMG/bio.png';
    });
  }

  const blogForm = document.getElementById('blog-form');
  if (blogForm) {
    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('blog-title').value = data.blog?.titulo || '';
      document.getElementById('blog-content').value = data.blog?.texto || '';
      document.getElementById('blog-image-url').value = data.blog?.imagen || 'IMG/bio.png';
      if (blogPreviewImg) blogPreviewImg.src = data.blog?.imagen || 'IMG/bio.png';
    })();

    blogForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.blog = {
        titulo: document.getElementById('blog-title')?.value.trim() || '',
        texto: document.getElementById('blog-content')?.value || '',
        imagen: document.getElementById('blog-image-url')?.value.trim() || 'IMG/bio.png'
      };
      await saveSiteData(currentData, 'Blog updated');
    });
  }

  // =============================================
  // BOARDING
  // =============================================
  const boardingImageInput = document.getElementById('boarding-image-url');
  const boardingPreviewImg = document.getElementById('boarding-preview-img');
  if (boardingImageInput && boardingPreviewImg) {
    boardingImageInput.addEventListener('input', function() {
      boardingPreviewImg.src = this.value.trim() || 'IMG/Boarding-Service.png';
    });
  }

  const boardingForm = document.getElementById('boarding-form');
  if (boardingForm) {
    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('boarding-title').value = data.boarding?.titulo || 'Boarding Service';
      document.getElementById('boarding-content').value = data.boarding?.texto || '';
      document.getElementById('boarding-image-url').value = data.boarding?.imagen || 'IMG/Boarding-Service.png';
      if (boardingPreviewImg) boardingPreviewImg.src = data.boarding?.imagen || 'IMG/Boarding-Service.png';
    })();

    boardingForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.boarding = {
        titulo: document.getElementById('boarding-title')?.value.trim() || 'Boarding Service',
        texto: document.getElementById('boarding-content')?.value || '',
        imagen: document.getElementById('boarding-image-url')?.value.trim() || 'IMG/Boarding-Service.png'
      };
      await saveSiteData(currentData, 'Boarding updated');
    });
  }

  // =============================================
  // PUPPY
  // =============================================
  const puppyImageInput = document.getElementById('puppy-image-url');
  const puppyPreviewImg = document.getElementById('puppy-preview-img');
  if (puppyImageInput && puppyPreviewImg) {
    puppyImageInput.addEventListener('input', function() {
      puppyPreviewImg.src = this.value.trim() || 'IMG/Puppy-Concierge.png';
    });
  }

  const puppyForm = document.getElementById('puppy-form');
  if (puppyForm) {
    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('puppy-title').value = data.puppy?.titulo || 'Puppy Concierge';
      document.getElementById('puppy-content').value = data.puppy?.texto || '';
      document.getElementById('puppy-image-url').value = data.puppy?.imagen || 'IMG/Puppy-Concierge.png';
      if (puppyPreviewImg) puppyPreviewImg.src = data.puppy?.imagen || 'IMG/Puppy-Concierge.png';
    })();

    puppyForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.puppy = {
        titulo: document.getElementById('puppy-title')?.value.trim() || 'Puppy Concierge',
        texto: document.getElementById('puppy-content')?.value || '',
        imagen: document.getElementById('puppy-image-url')?.value.trim() || 'IMG/Puppy-Concierge.png'
      };
      await saveSiteData(currentData, 'Puppy Concierge updated');
    });
  }

  // =============================================
  // TRAINING VIDEOS
  // =============================================
  let trainingVideos = [];

  function renderVideos(filter = 'all') {
    const videosList = document.getElementById('videos-list');
    if (!videosList) return;

    videosList.innerHTML = '';

    const filteredVideos = filter === 'all' ? trainingVideos : trainingVideos.filter(v => v.categories?.includes(filter));

    if (filteredVideos.length === 0) {
      videosList.innerHTML = '<p class="no-videos">No videos added yet.</p>';
      return;
    }

    filteredVideos.forEach(video => {
      const div = document.createElement('div');
      div.className = 'video-item';
      div.innerHTML = `
        <video controls src="${video.url}" style="width:100%; height:150px; object-fit:cover;"></video>
        <div class="video-info">
          <h4>${video.title}</h4>
          <p>${video.description || ''}</p>
          <div class="video-categories">${video.categories?.join(', ') || ''}</div>
          <button class="delete-video" data-id="${video.id}">Delete</button>
        </div>
      `;
      videosList.appendChild(div);
    });

    document.querySelectorAll('.delete-video').forEach(btn => {
      btn.addEventListener('click', async function() {
        const id = parseInt(this.dataset.id);
        if (confirm('Delete this video?')) {
          trainingVideos = trainingVideos.filter(v => v.id !== id);
          renderVideos(filter);
          localStorage.setItem('training_videos_backup', JSON.stringify(trainingVideos));
          
          const currentData = await getCurrentSiteData();
          currentData.training_videos = trainingVideos;
          await saveSiteData(currentData, 'Video deleted');
        }
      });
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderVideos(this.dataset.filter);
    });
  });

  (async function loadVideos() {
    const data = await getCurrentSiteData();
    trainingVideos = data.training_videos || [];
    
    const backup = localStorage.getItem('training_videos_backup');
    if (backup && trainingVideos.length === 0) {
      try {
        trainingVideos = JSON.parse(backup);
      } catch (e) {}
    }
    
    renderVideos('all');
  })();

  const trainingForm = document.getElementById('training-video-form');
  if (trainingForm) {
    trainingForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const title = document.getElementById('video-title')?.value.trim();
      const url = document.getElementById('video-url')?.value.trim();
      const description = document.getElementById('video-description')?.value.trim() || '';
      const categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);

      if (!title || !url) {
        alert('Please enter title and URL');
        return;
      }
      if (categories.length === 0) {
        alert('Select at least one category');
        return;
      }

      const newVideo = {
        id: Date.now(),
        title,
        url,
        description,
        categories
      };

      trainingVideos.push(newVideo);
      renderVideos('all');
      trainingForm.reset();

      localStorage.setItem('training_videos_backup', JSON.stringify(trainingVideos));
      
      const currentData = await getCurrentSiteData();
      currentData.training_videos = trainingVideos;
      await saveSiteData(currentData, 'Video added');
    });
  }

  // =============================================
  // EMAIL RECIPIENT
  // =============================================
  const configSection = document.getElementById('section-config');
  if (configSection && !document.getElementById('email-config-form')) {
    const emailField = document.createElement('div');
    emailField.className = 'sub-section';
    emailField.innerHTML = `
      <h3>Email Configuration</h3>
      <form id="email-config-form">
        <div class="form-group">
          <label>Contact Form Recipient Email</label>
          <input type="email" id="email-recipient" placeholder="shawn@leashtolegacy.org">
          <p class="note">All contact form messages will be sent to this email address</p>
        </div>
        <button type="submit">Save Email Settings</button>
      </form>
    `;
    configSection.appendChild(emailField);

    (async function() {
      const data = await getCurrentSiteData();
      document.getElementById('email-recipient').value = data.email_recipient || 'shawn@leashtolegacy.org';
    })();

    document.getElementById('email-config-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const currentData = await getCurrentSiteData();
      currentData.email_recipient = document.getElementById('email-recipient').value.trim() || 'shawn@leashtolegacy.org';
      await saveSiteData(currentData, 'Email recipient updated');
    });
  }

  // =============================================
  // TEST GITHUB BUTTON
  // =============================================
  const btnTest = document.getElementById('btn-probar-github');
  const resultado = document.getElementById('resultado-probar');
  if (btnTest && resultado) {
    btnTest.addEventListener('click', async function() {
      resultado.textContent = 'Testing connection...';
      resultado.style.color = '#333';
      
      try {
        const data = await getCurrentSiteData();
        const response = await fetch('/.netlify/functions/update-site-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          resultado.textContent = '✅ GitHub connection successful!';
          resultado.style.color = 'green';
        } else {
          resultado.textContent = '⚠️ GitHub token not configured. Saving locally only.';
          resultado.style.color = 'orange';
        }
      } catch (error) {
        resultado.textContent = '⚠️ Working locally (GitHub not configured)';
        resultado.style.color = 'orange';
      }
    });
  }
});