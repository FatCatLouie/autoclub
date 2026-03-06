document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Закрываем мобильное меню
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const container = document.querySelector('.sections-container');
                const targetPosition = targetSection.offsetTop - container.offsetTop;
                
                container.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Галерея (О нас)
    const galleryTrack = document.querySelector('.gallery-track');
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const galleryPrev = document.querySelector('.gallery-btn.prev');
    const galleryNext = document.querySelector('.gallery-btn.next');
    const galleryDotsContainer = document.querySelector('.gallery-dots');
    
    if (galleryTrack && gallerySlides.length > 0) {
        let currentIndex = 0;
        const slideCount = gallerySlides.length;
        
        // Создаем dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            galleryDotsContainer.appendChild(dot);
        }
        
        const galleryDots = document.querySelectorAll('.gallery-dot');
        
        function updateGallery() {
            galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            galleryDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateGallery();
        }
        
        galleryNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateGallery();
        });
        
        galleryPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateGallery();
        });
        
        // Автоматическая прокрутка галереи
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateGallery();
        }, 10000);
    }

    // Карусель услуг
    const servicesTrack = document.querySelector('.services-track');
    const serviceCards = document.querySelectorAll('.service-card');
    const servicesPrev = document.querySelector('.services-btn.prev');
    const servicesNext = document.querySelector('.services-btn.next');
    const servicesDotsContainer = document.querySelector('.services-dots');
    
    if (servicesTrack && serviceCards.length > 0) {
        let currentServiceIndex = 0;
        const serviceCount = serviceCards.length;
        
        // Создаем dots для услуг
        for (let i = 0; i < serviceCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('services-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToService(i));
            servicesDotsContainer.appendChild(dot);
        }
        
        const servicesDots = document.querySelectorAll('.services-dot');
        
        function updateServices() {
            servicesTrack.style.transform = `translateX(-${currentServiceIndex * 100}%)`;
            
            servicesDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentServiceIndex);
            });
        }
        
        function goToService(index) {
            currentServiceIndex = index;
            updateServices();
        }
        
        servicesNext.addEventListener('click', () => {
            currentServiceIndex = (currentServiceIndex + 1) % serviceCount;
            updateServices();
        });
        
        servicesPrev.addEventListener('click', () => {
            currentServiceIndex = (currentServiceIndex - 1 + serviceCount) % serviceCount;
            updateServices();
        });

        // Переход к конкретной услуге с главной
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => {
            item.addEventListener('click', function() {
                const serviceId = this.dataset.service;
                let targetIndex = 0;
                
                switch(serviceId) {
                    case 'detailing': targetIndex = 0; break;
                    case 'electrics': targetIndex = 1; break;
                    case 'carbon': targetIndex = 2; break;
                    case 'maintenance': targetIndex = 3; break;
                }
                
                goToService(targetIndex);
                
                // Прокручиваем к секции услуг
                const servicesSection = document.querySelector('#services');
                const container = document.querySelector('.sections-container');
                const targetPosition = servicesSection.offsetTop - container.offsetTop;
                
                container.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если открыто
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            });
        });
    }

    // Обработка кнопки "Записаться"
    const bookingButtons = document.querySelectorAll('.hero-button');
    bookingButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Спасибо за интерес к нашим услугам! Наш менеджер свяжется с вами в ближайшее время.');
        });
    });
});