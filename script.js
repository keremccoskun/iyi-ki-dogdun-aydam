const openBtn = document.getElementById('openBtn');
const openingScreen = document.getElementById('openingScreen');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicText = document.querySelector('.music-text');
const vinyl = document.querySelector('.vinyl');

// Müzik Çalar
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicText.textContent = "Ajda Pekkan-Sen Olurdun Yine";
        vinyl.style.animationPlayState = "running";
    } else {
        bgMusic.pause();
        musicText.textContent = "SILENT";
        vinyl.style.animationPlayState = "paused";
    }
}

musicToggle.addEventListener('click', toggleMusic);

openBtn.addEventListener('click', function() {
    bgMusic.volume = 0.4;
    toggleMusic(); 

    openingScreen.classList.add('fade-out');
    
    setTimeout(function() {
        mainContent.style.display = 'block';
        setTimeout(function() {
            mainContent.classList.add('visible');
        }, 50);
    }, 500);
});

// YENİ VE KESİN ÇÖZÜM: ZAMAN AYARLI OTOMATİK KAYMA VE TUT-ÇEK
const scrollGallery = document.getElementById('scrollGallery');

let isDown = false;
let startX;
let scrollLeft;
let hasDragged = false; 

let lastScrollTime = 0;
// HIZ AYARI BURADA: Sayı BÜYÜDÜKÇE kayma hızı YAVAŞLAR (25 çok tatlı bir hızdır)
const scrollDelay = 25; 

function autoScroll(timestamp) {
    if (!lastScrollTime) lastScrollTime = timestamp;
    
    if (scrollGallery && !isDown) {
        // Sadece belirlenen milisaniye geçtiğinde tam 1 piksel kaydır
        if (timestamp - lastScrollTime >= scrollDelay) {
            scrollGallery.scrollLeft += 1;
            lastScrollTime = timestamp;
        }
    }
    requestAnimationFrame(autoScroll);
}

if (scrollGallery) {
    requestAnimationFrame(autoScroll); // Döngüyü başlat

    // PC (Mouse) İçin Tut-Çek Kontrolleri
    scrollGallery.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false; 
        startX = e.pageX - scrollGallery.offsetLeft;
        scrollLeft = scrollGallery.scrollLeft;
    });

    scrollGallery.addEventListener('mouseleave', () => {
        isDown = false; 
    });

    scrollGallery.addEventListener('mouseup', () => {
        isDown = false; 
    });

    scrollGallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollGallery.offsetLeft;
        const walk = (x - startX) * 2; 
        if (Math.abs(walk) > 5) hasDragged = true; 
        scrollGallery.scrollLeft = scrollLeft - walk;
    });

    // Mobil (Touch) İçin Tut-Çek Kontrolleri
    scrollGallery.addEventListener('touchstart', (e) => {
        isDown = true;
        hasDragged = false;
        startX = e.touches[0].pageX - scrollGallery.offsetLeft;
        scrollLeft = scrollGallery.scrollLeft;
    });

    scrollGallery.addEventListener('touchend', () => {
        isDown = false;
    });

    scrollGallery.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - scrollGallery.offsetLeft;
        const walk = (x - startX) * 2;
        if (Math.abs(walk) > 5) hasDragged = true;
        scrollGallery.scrollLeft = scrollLeft - walk;
    });
}

// Fotoğraf Kaydırma (Slider) Okları
const memoryCards = document.querySelectorAll('.memory-card');
memoryCards.forEach(function(card) {
    const medias = card.querySelectorAll('.memory-media'); 
    const prevBtn = card.querySelector('.prev-btn');
    const nextBtn = card.querySelector('.next-btn');
    let currentIndex = 0; 

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            if(hasDragged) return; 
            medias[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % medias.length;
            medias[currentIndex].classList.add('active');
        });

        prevBtn.addEventListener('click', function(e) {
            if(hasDragged) return;
            medias[currentIndex].classList.remove('active');
            currentIndex = (currentIndex - 1 + medias.length) % medias.length;
            medias[currentIndex].classList.add('active');
        });
    }
});

// Büyütme (Lightbox)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');
const allMedias = document.querySelectorAll('.memory-media');

allMedias.forEach(function(media) {
    media.addEventListener('click', function(e) {
        if (hasDragged) {
            e.preventDefault();
            return; 
        }
        if (this.tagName === 'IMG') {
            lightbox.classList.add('visible');
            lightboxImg.src = this.src;
        }
    });
});

closeLightbox.addEventListener('click', function() {
    lightbox.classList.remove('visible');
});

lightbox.addEventListener('click', function(e) {
    if (e.target !== lightboxImg) {
        lightbox.classList.remove('visible');
    }
});