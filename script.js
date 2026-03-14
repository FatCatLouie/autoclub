document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Закрытие меню при вертикальном свайпе (прокрутке)
    const sectionsContainer = document.querySelector('.sections-container');
    
    if (sectionsContainer && nav) {
        let scrollTimeout;
        let lastScrollTop = sectionsContainer.scrollTop;
        let isScrolling = false;
        
        sectionsContainer.addEventListener('scroll', function() {
            // Если меню активно и пользователь скроллит
            if (nav.classList.contains('active')) {
                const currentScrollTop = this.scrollTop;
                const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
                
                // Если скролл превышает пороговое значение, закрываем меню
                if (scrollDifference > 10 && !isScrolling) { // порог в 10px для исключения случайных срабатываний
                    isScrolling = true;
                    
                    // Закрываем меню
                    nav.classList.remove('active');
                    
                    // Сбрасываем флаг через небольшой таймаут
                    setTimeout(() => {
                        isScrolling = false;
                    }, 300);
                }
                
                lastScrollTop = currentScrollTop;
                
                // Очищаем предыдущий таймаут
                clearTimeout(scrollTimeout);
                
                // Устанавливаем новый таймаут для сброса lastScrollTop после остановки скролла
                scrollTimeout = setTimeout(() => {
                    lastScrollTop = sectionsContainer.scrollTop;
                }, 150);
            } else {
                // Если меню не активно, просто обновляем lastScrollTop
                lastScrollTop = sectionsContainer.scrollTop;
            }
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

    // Функция для определения, нужно ли отключить принудительную прокрутку
    function shouldDisableSnap() {
        return window.innerHeight < 725;
    }

    // Функция для обновления класса у контейнера секций
    function updateSnapClass() {
        if (sectionsContainer) {
            if (shouldDisableSnap()) {
                sectionsContainer.classList.add('no-snap');
            } else {
                sectionsContainer.classList.remove('no-snap');
            }
        }
    }

    // Проверяем при загрузке
    updateSnapClass();

    // Проверяем при изменении размера окна
    window.addEventListener('resize', function() {
        updateSnapClass();
    });

    // Функция для инициализации свайпов
    function initSwipe(element, options) {
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;
        const minSwipeDistance = 50; // минимальное расстояние для свайпа

        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const distance = touchEndX - touchStartX;
            
            if (Math.abs(distance) >= minSwipeDistance) {
                if (distance > 0) {
                    // Свайп вправо - предыдущий слайд
                    options.onSwipeRight();
                } else {
                    // Свайп влево - следующий слайд
                    options.onSwipeLeft();
                }
            }
            
            // Сброс
            touchStartX = 0;
            touchEndX = 0;
            isSwiping = false;
        }, { passive: true });
    }

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
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
            
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
                resetAutoScroll();
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
            resetAutoScroll();
        });
        
        galleryPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateGallery();
            resetAutoScroll();
        });
        
        // Инициализация свайпов для галереи
        initSwipe(galleryTrack, {
            onSwipeLeft: () => {
                currentIndex = (currentIndex + 1) % slideCount;
                updateGallery();
                resetAutoScroll();
            },
            onSwipeRight: () => {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateGallery();
                resetAutoScroll();
            }
        });
        
        // Запускаем автопрокрутку
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
                resetServicesAutoScroll();
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
            resetServicesAutoScroll();
        });
        
        servicesPrev.addEventListener('click', () => {
            currentServiceIndex = (currentServiceIndex - 1 + serviceCount) % serviceCount;
            updateServices();
            resetServicesAutoScroll();
        });

        // Инициализация свайпов для карусели услуг
        initSwipe(servicesTrack, {
            onSwipeLeft: () => {
                currentServiceIndex = (currentServiceIndex + 1) % serviceCount;
                updateServices();
                resetServicesAutoScroll();
            },
            onSwipeRight: () => {
                currentServiceIndex = (currentServiceIndex - 1 + serviceCount) % serviceCount;
                updateServices();
                resetServicesAutoScroll();
            }
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
                resetServicesAutoScroll();
                
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
        
        // Запускаем автопрокрутку услуг
        resetServicesAutoScroll();
    }

    // Логика для кнопки "Записаться" с выпадающим меню
    const bookButton = document.getElementById('mainBookButton');
    const dropdown = document.getElementById('contactDropdown');
    
    if (bookButton && dropdown && sectionsContainer) {
        // Открытие/закрытие дропдауна при клике на кнопку
        bookButton.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Закрытие дропдауна при клике вне его
        document.addEventListener('click', function(e) {
            if (!bookButton.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Закрытие дропдауна при скролле
        sectionsContainer.addEventListener('scroll', function() {
            dropdown.classList.remove('show');
        });

        // Закрытие дропдауна при нажатии на пункты меню
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                dropdown.classList.remove('show');
            });
        });

        // Предотвращение закрытия при клике внутри дропдауна
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});