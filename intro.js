/**
 * ====================================================
 * دكتور روبوت - نظام عرض تقديمي احترافي متطور
 * مع تأثيرات صوتية، تحريك متقدم، وتجربة مستخدم محسنة
 * ====================================================
 */

// نظام الحالة والإعدادات
const DrRobotSystem = {
    // إعدادات التطبيق
    config: {
        autoPlay: true,
        autoPlayDelay: 4000,
        transitionSpeed: 1200,
        enableSound: true,
        enableKeyboard: true,
        enableSwipe: true,
        enableParticles: true,
        enableAnalytics: true,
        enablePerformance: true
    },
    
    // حالة التطبيق
    state: {
        currentPage: 0,
        totalPages: 4,
        isPlaying: false,
        isTransitioning: false,
        userInteracted: false,
        introStarted: false,
        introCompleted: false,
        audioContext: null,
        animationFrame: null
    },
    
    // عناصر DOM
    elements: {
        startBtn: document.getElementById('start-btn'),
        landing: document.getElementById('landing-page'),
        landingLogo: document.querySelector('.landing-bg-logo img'),
        overlay: null,
        pages: [],
        letters: [],
        finalLogo: document.querySelector('.final-logo')
    },
    
    // المؤثرات الصوتية
    sounds: {
        click: null,
        transition: null,
        reveal: null,
        complete: null
    },
    
    // المؤقتات
    timers: {
        intro: null,
        transition: null,
        animation: null
    },
    
    // الإحصائيات
    analytics: {
        startTime: null,
        interactionCount: 0,
        pageViews: [],
        errors: []
    }
};

// تهيئة النظام
function initializeSystem() {
    console.log('🚀 نظام دكتور روبوت يبدأ التشغيل...');
    
    // تسجيل وقت البدء
    DrRobotSystem.analytics.startTime = Date.now();
    
    // إنشاء عنصر Overlay متطور
    createAdvancedOverlay();
    
    // جمع العناصر
    DrRobotSystem.elements.pages = Array.from(document.querySelectorAll('.intro-page'));
    DrRobotSystem.elements.letters = Array.from(document.querySelectorAll('.logo-letters span'));
    
    // تهيئة المؤثرات الصوتية
    if (DrRobotSystem.config.enableSound) {
        initializeAudioSystem();
    }
    
    // تهيئة نظام الرسوم المتحركة
    initializeAnimationSystem();
    
    // إضافة مستمعي الأحداث
    setupEventListeners();
    
    // تشغيل تأثيرات البداية
    startLandingEffects();
    
    // تتبع الأداء
    if (DrRobotSystem.config.enablePerformance) {
        setupPerformanceMonitoring();
    }
    
    console.log('✅ النظام جاهز للعمل');
}

// إنشاء Overlay متطور مع تأثيرات
function createAdvancedOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.innerHTML = `
        <div class="transition-content">
            <div class="spinner"></div>
            <div class="loading-text">جاري التحميل...</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="particles"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    DrRobotSystem.elements.overlay = overlay;
    
    // إنشاء جسيمات متحركة
    if (DrRobotSystem.config.enableParticles) {
        createParticles(overlay.querySelector('.particles'));
    }
}

// تهيئة نظام الصوت
function initializeAudioSystem() {
    try {
        // إنشاء سياق صوتي
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        DrRobotSystem.state.audioContext = new AudioContext();
        
        // إنشاء مؤثرات صوتية
        DrRobotSystem.sounds.click = createSoundEffect(800, 'sine');
        DrRobotSystem.sounds.transition = createSoundEffect(400, 'triangle');
        DrRobotSystem.sounds.reveal = createSoundEffect(600, 'sawtooth');
        DrRobotSystem.sounds.complete = createSoundEffect(1200, 'square');
        
        console.log('🎵 نظام الصوت مفعل');
    } catch (error) {
        console.warn('⚠️ نظام الصوت غير متاح:', error);
        DrRobotSystem.config.enableSound = false;
    }
}

// إنشاء مؤثر صوتي
function createSoundEffect(frequency, type) {
    return function(volume = 0.3, duration = 0.2) {
        if (!DrRobotSystem.config.enableSound || !DrRobotSystem.state.audioContext) return;
        
        const audioContext = DrRobotSystem.state.audioContext;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
}

// تهيئة نظام الرسوم المتحركة
function initializeAnimationSystem() {
    // إضافة فئات CSS متقدمة
    document.documentElement.classList.add('advanced-animations');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    const { startBtn, landing } = DrRobotSystem.elements;
    
    // زر البدء مع Debouncing
    startBtn.addEventListener('click', debounce(startIntroSequence, 300));
    
    // تفاعلات لوحة المفاتيح
    if (DrRobotSystem.config.enableKeyboard) {
        document.addEventListener('keydown', handleKeyboardEvents);
    }
    
    // تفاعلات اللمس والسحب
    if (DrRobotSystem.config.enableSwipe) {
        setupSwipeGestures();
    }
    
    // تتبع الرغبة في الخروج
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // تتبع تحميل الصفحة
    window.addEventListener('load', handlePageLoad);
    
    // تتبع الأخطاء
    window.addEventListener('error', handleError);
}

// تأثيرات الصفحة الرئيسية
function startLandingEffects() {
    const { landingLogo } = DrRobotSystem.elements;
    
    // تأخير لضمان تحميل الصفحة
    setTimeout(() => {
        landingLogo.style.opacity = '0.25';
        landingLogo.style.transform = 'scale(1.05) rotate(5deg)';
        landingLogo.style.filter = 'brightness(1.2) contrast(1.1)';
        
        // تأثير نبض مستمر
        startPulseAnimation(landingLogo);
        
        // تأثير تتبع الماوس
        document.addEventListener('mousemove', throttle(handleMouseMove, 50));
    }, 500);
}

// بدء التسلسل التقديمي
function startIntroSequence() {
    if (DrRobotSystem.state.introStarted) return;
    
    DrRobotSystem.state.introStarted = true;
    DrRobotSystem.analytics.interactionCount++;
    
    // تشغيل صوت النقر
    if (DrRobotSystem.sounds.click) {
        DrRobotSystem.sounds.click(0.4, 0.3);
    }
    
    const { landing, startBtn } = DrRobotSystem.elements;
    
    // تأثيرات الخروج للصفحة الرئيسية
    landing.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    landing.style.opacity = '0';
    landing.style.transform = 'scale(0.95)';
    landing.style.filter = 'blur(10px)';
    
    startBtn.style.transform = 'scale(0.8)';
    startBtn.style.opacity = '0';
    
    // بدء التسلسل التقديمي
    setTimeout(() => {
        landing.style.display = 'none';
        DrRobotSystem.state.isPlaying = true;
        showPageWithEffects(0);
    }, 800);
    
    // تتبع الحدث
    trackEvent('intro_started');
}

// عرض الصفحات مع تأثيرات متقدمة
function showPageWithEffects(pageIndex) {
    if (pageIndex >= DrRobotSystem.elements.pages.length) {
        completeIntroSequence();
        return;
    }
    
    DrRobotSystem.state.currentPage = pageIndex;
    DrRobotSystem.state.isTransitioning = true;
    
    const page = DrRobotSystem.elements.pages[pageIndex];
    page.style.pointerEvents = 'auto';
    page.style.opacity = '1';
    
    // تسجيل مشاهدة الصفحة
    DrRobotSystem.analytics.pageViews.push({
        page: pageIndex,
        timestamp: Date.now(),
        duration: 0
    });
    
    // تأثيرات خاصة لكل صفحة
    switch(pageIndex) {
        case 0: // الصفحة الأولى
        case 1: // الصفحة الثانية
            animateTextReveal(page);
            break;
        case 2: // صفحة الحروف
            animateLettersReveal();
            break;
        case 3: // الصفحة النهائية
            animateFinalLogo();
            break;
    }
    
    // تشغيل صوت الانتقال
    if (DrRobotSystem.sounds.transition) {
        DrRobotSystem.sounds.transition(0.3, 0.5);
    }
    
    // تحديد المدة بناءً على الصفحة
    const delay = pageIndex === 2 ? 3500 : 
                  pageIndex === 3 ? 4000 : 2000;
    
    // الانتقال التلقائي
    if (DrRobotSystem.config.autoPlay) {
        DrRobotSystem.timers.transition = setTimeout(() => {
            page.style.opacity = '0';
            page.style.transform = 'translateX(-100px)';
            page.style.filter = 'blur(20px)';
            
            setTimeout(() => {
                showPageWithEffects(pageIndex + 1);
            }, 500);
        }, delay);
    }
    
    // تتبع الحدث
    trackEvent('page_view', { page: pageIndex });
}

// تأثير ظهور النص
function animateTextReveal(page) {
    const text = page.querySelector('.page-text');
    if (!text) return;
    
    // إعادة التعيين
    text.style.opacity = '0';
    text.style.transform = 'translateX(100px) scale(0.8)';
    
    // التأثير المتحرك
    setTimeout(() => {
        text.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        text.style.opacity = '1';
        text.style.transform = 'translateX(0) scale(1)';
        
        // تأثير الإضاءة
        text.style.textShadow = '0 0 30px rgba(212, 175, 55, 0.7)';
        
        setTimeout(() => {
            text.style.textShadow = '0 0 60px rgba(212, 175, 55, 0.4)';
        }, 800);
    }, 200);
}

// تأثير ظهور الحروف
function animateLettersReveal() {
    const { letters } = DrRobotSystem.elements;
    
    letters.forEach((letter, index) => {
        // إعادة التعيين
        letter.style.opacity = '0';
        letter.style.transform = 'translateY(-100px) scale(0) rotate(-180deg)';
        
        // التأثير المتتابع
        setTimeout(() => {
            letter.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            letter.style.opacity = '1';
            letter.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            
            // تأثير الارتداد
            setTimeout(() => {
                letter.style.transform = 'translateY(-15px) scale(1.1)';
                
                setTimeout(() => {
                    letter.style.transform = 'translateY(0) scale(1)';
                }, 150);
            }, 600);
            
            // تشغيل صوت الظهور
            if (DrRobotSystem.sounds.reveal) {
                setTimeout(() => {
                    DrRobotSystem.sounds.reveal(0.2, 0.1);
                }, index * 100);
            }
        }, index * 200);
    });
}

// تأثير اللوجو النهائي
function animateFinalLogo() {
    const { finalLogo } = DrRobotSystem.elements;
    
    if (!finalLogo) return;
    
    // إعادة التعيين
    finalLogo.style.opacity = '0';
    finalLogo.style.transform = 'scale(0.5) rotateY(180deg)';
    finalLogo.style.filter = 'blur(20px)';
    
    // التأثير الرئيسي
    setTimeout(() => {
        finalLogo.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        finalLogo.style.opacity = '1';
        finalLogo.style.transform = 'scale(1) rotateY(0deg)';
        finalLogo.style.filter = 'blur(0px)';
        
        // تأثير التوهج المتقطع
        let glowCount = 0;
        const maxGlows = 5;
        
        function pulseGlow() {
            if (glowCount >= maxGlows) return;
            
            finalLogo.style.textShadow = '0 0 80px rgba(212, 175, 55, 0.9)';
            
            setTimeout(() => {
                finalLogo.style.textShadow = '0 0 40px rgba(212, 175, 55, 0.5)';
                glowCount++;
                
                if (glowCount < maxGlows) {
                    setTimeout(pulseGlow, 300);
                }
            }, 200);
        }
        
        setTimeout(pulseGlow, 800);
        
        // تشغيل صوت الإكمال
        if (DrRobotSystem.sounds.complete) {
            setTimeout(() => {
                DrRobotSystem.sounds.complete(0.5, 1);
            }, 500);
        }
    }, 500);
}

// إكمال التسلسل التقديمي
function completeIntroSequence() {
    DrRobotSystem.state.introCompleted = true;
    DrRobotSystem.state.isPlaying = false;
    
    // عرض Overlay مع تأثيرات
    const { overlay } = DrRobotSystem.elements;
    overlay.classList.add('show');
    
    // تحريك شريط التقدم
    const progressFill = overlay.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.transition = 'width 1.5s ease-in-out';
        progressFill.style.width = '100%';
    }
    
    // تحديث نص التحميل
    const loadingText = overlay.querySelector('.loading-text');
    if (loadingText) {
        setTimeout(() => {
            loadingText.textContent = 'جاري الانتقال إلى دكتور روبوت...';
        }, 1000);
    }
    
    // الانتقال بعد التأخير
    setTimeout(() => {
        // تسجيل إحصائيات الجلسة
        const sessionDuration = Date.now() - DrRobotSystem.analytics.startTime;
        trackEvent('intro_completed', {
            duration: sessionDuration,
            pages: DrRobotSystem.analytics.pageViews.length,
            interactions: DrRobotSystem.analytics.interactionCount
        });
        
        // الانتقال إلى الصفحة الهدف
        window.location.href = 'https://yusuffaraag000-alt.github.io/dr-robot00/#/';
    }, 2500);
    
    // تتبع الحدث
    trackEvent('intro_complete');
}

// معالجة أحداث لوحة المفاتيح
function handleKeyboardEvents(event) {
    if (!DrRobotSystem.state.isPlaying) return;
    
    switch(event.key) {
        case 'ArrowRight':
        case 'Right':
            event.preventDefault();
            nextPage();
            break;
            
        case 'ArrowLeft':
        case 'Left':
            event.preventDefault();
            previousPage();
            break;
            
        case 'Escape':
            event.preventDefault();
            skipIntro();
            break;
            
        case ' ':
        case 'Spacebar':
            event.preventDefault();
            togglePlayPause();
            break;
    }
}

// الصفحة التالية
function nextPage() {
    if (DrRobotSystem.state.isTransitioning) return;
    
    clearTimeout(DrRobotSystem.timers.transition);
    
    const currentPage = DrRobotSystem.state.currentPage;
    if (currentPage < DrRobotSystem.elements.pages.length - 1) {
        const page = DrRobotSystem.elements.pages[currentPage];
        page.style.opacity = '0';
        
        setTimeout(() => {
            showPageWithEffects(currentPage + 1);
        }, 300);
    }
}

// الصفحة السابقة
function previousPage() {
    if (DrRobotSystem.state.isTransitioning) return;
    
    clearTimeout(DrRobotSystem.timers.transition);
    
    const currentPage = DrRobotSystem.state.currentPage;
    if (currentPage > 0) {
        const page = DrRobotSystem.elements.pages[currentPage];
        page.style.opacity = '0';
        
        setTimeout(() => {
            showPageWithEffects(currentPage - 1);
        }, 300);
    }
}

// تخطي المقدمة
function skipIntro() {
    if (!DrRobotSystem.state.introStarted || DrRobotSystem.state.introCompleted) return;
    
    // تنظيف المؤقتات
    clearAllTimers();
    
    // إخفاء جميع الصفحات
    DrRobotSystem.elements.pages.forEach(page => {
        page.style.opacity = '0';
    });
    
    // الانتقال المباشر
    completeIntroSequence();
    
    trackEvent('intro_skipped');
}

// تبديل التشغيل/الإيقاف
function togglePlayPause() {
    if (!DrRobotSystem.state.isPlaying) return;
    
    DrRobotSystem.state.isPlaying = !DrRobotSystem.state.isPlaying;
    
    if (DrRobotSystem.state.isPlaying) {
        showPageWithEffects(DrRobotSystem.state.currentPage);
    } else {
        clearTimeout(DrRobotSystem.timers.transition);
    }
}

// تأثير نبض للعناصر
function startPulseAnimation(element) {
    if (!element) return;
    
    function pulse() {
        element.style.transition = 'all 2s ease-in-out';
        element.style.transform = 'scale(1.08) rotate(3deg)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1.05) rotate(0deg)';
            setTimeout(pulse, 2000);
        }, 2000);
    }
    
    pulse();
}

// معالجة حركة الماوس
function handleMouseMove(event) {
    if (!DrRobotSystem.state.introStarted) {
        const { landingLogo } = DrRobotSystem.elements;
        const x = (event.clientX / window.innerWidth - 0.5) * 20;
        const y = (event.clientY / window.innerHeight - 0.5) * 20;
        
        landingLogo.style.transform = `scale(1.05) rotate(${x * 0.5}deg) translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
}

// إعداد إيماءات السحب
function setupSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (event) => {
        if (!DrRobotSystem.state.isPlaying) return;
        
        const touchEndX = event.changedTouches[0].screenX;
        const touchEndY = event.changedTouches[0].screenY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // التأكد من أن السحر أفقياً أكثر من رأسيًا
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                nextPage();
            } else if (diffX < -50) {
                previousPage();
            }
        }
    });
}

// تتبع الأحداث
function trackEvent(eventName, data = {}) {
    if (!DrRobotSystem.config.enableAnalytics) return;
    
    const eventData = {
        event: eventName,
        timestamp: Date.now(),
        ...data
    };
    
    console.log('📊 حدث:', eventData);
    
    // يمكن إضافة إرسال البيانات إلى خدمة تحليلات هنا
    // sendToAnalytics(eventData);
}

// معالجة الأخطاء
function handleError(event) {
    const error = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
    };
    
    DrRobotSystem.analytics.errors.push(error);
    console.error('❌ خطأ:', error);
}

// معالجة تغيير حالة الصفحة
function handleVisibilityChange() {
    if (document.hidden) {
        // الصفحة غير مرئية، إيقاف المؤثرات
        if (DrRobotSystem.state.audioContext) {
            DrRobotSystem.state.audioContext.suspend();
        }
        clearAllTimers();
    } else {
        // الصفحة مرئية، استئناف المؤثرات
        if (DrRobotSystem.state.audioContext) {
            DrRobotSystem.state.audioContext.resume();
        }
    }
}

// معالجة تحميل الصفحة
function handlePageLoad() {
    const loadTime = Date.now() - DrRobotSystem.analytics.startTime;
    trackEvent('page_loaded', { loadTime });
}

// تنظيف جميع المؤقتات
function clearAllTimers() {
    clearTimeout(DrRobotSystem.timers.intro);
    clearTimeout(DrRobotSystem.timers.transition);
    clearTimeout(DrRobotSystem.timers.animation);
    
    if (DrRobotSystem.state.animationFrame) {
        cancelAnimationFrame(DrRobotSystem.state.animationFrame);
    }
}

// مراقبة الأداء
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        const perfData = {
            memory: window.performance.memory,
            timing: window.performance.timing,
            navigation: window.performance.navigation
        };
        
        console.log('📈 بيانات الأداء:', perfData);
    }
}

// أدوات مساعدة: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// أدوات مساعدة: Throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// إنشاء جسيمات متحركة
function createParticles(container) {
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
        
        // تحريك الجسيم
        animateParticle(particle);
    }
}

// تحريك الجسيم
function animateParticle(particle) {
    const duration = Math.random() * 5 + 3;
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    
    particle.style.transition = `all ${duration}s linear`;
    particle.style.transform = `translate(${x}px, ${y}px)`;
    particle.style.opacity = '0';
    
    setTimeout(() => {
        particle.style.transition = 'none';
        particle.style.transform = 'translate(0, 0)';
        particle.style.opacity = '0.5';
        
        setTimeout(() => {
            animateParticle(particle);
        }, 100);
    }, duration * 1000);
}

// تهيئة النظام عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', initializeSystem);

// توفير واجهة عامة للاستخدام
window.DrRobot = {
    start: startIntroSequence,
    next: nextPage,
    prev: previousPage,
    skip: skipIntro,
    togglePlay: togglePlayPause,
    config: DrRobotSystem.config,
    state: DrRobotSystem.state
};

console.log('🎯 نظام دكتور روبوت جاهز للاستخدام!');