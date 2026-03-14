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
            if (this.getAttribute('href').startsWith('tel:') || this.getAttribute('href').startsWith('https')) {
                return;
            }
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
        let autoScrollInterval;
        
        // Функция для сброса и перезапуска таймера
        function resetAutoScroll() {
            // Очищаем существующий интервал
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
            
            // Запускаем новый интервал
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                updateGallery();
            }, 10000);
        }
        
        // Создаем dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoScroll(); // Сбрасываем таймер при клике на dot
            });
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
            resetAutoScroll(); // Сбрасываем таймер при клике на next
        });
        
        galleryPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateGallery();
            resetAutoScroll(); // Сбрасываем таймер при клике на prev
        });
        
        // Запускаем автопрокрутку при загрузке страницы
        resetAutoScroll();
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
        let servicesAutoScrollInterval;
        
        // Функция для сброса и перезапуска таймера услуг
        function resetServicesAutoScroll() {
            if (servicesAutoScrollInterval) {
                clearInterval(servicesAutoScrollInterval);
            }
            
            servicesAutoScrollInterval = setInterval(() => {
                currentServiceIndex = (currentServiceIndex + 1) % serviceCount;
                updateServices();
            }, 10000);
        }
        
        // Создаем dots для услуг
        for (let i = 0; i < serviceCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('services-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToService(i);
                resetServicesAutoScroll(); // Сбрасываем таймер при клике на dot
            });
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
            resetServicesAutoScroll(); // Сбрасываем таймер при клике на next
        });
        
        servicesPrev.addEventListener('click', () => {
            currentServiceIndex = (currentServiceIndex - 1 + serviceCount) % serviceCount;
            updateServices();
            resetServicesAutoScroll(); // Сбрасываем таймер при клике на prev
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
                    case 'repair': targetIndex = 2; break;
                    case 'motorsports': targetIndex = 3; break;
                    case 'exhaust': targetIndex = 4; break;
                }
                
                goToService(targetIndex);
                resetServicesAutoScroll(); // Сбрасываем таймер при переходе с главной
                
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
        
        // Запускаем автопрокрутку услуг при загрузке страницы
        resetServicesAutoScroll();
    }
});