/* ==========================================================================
   NARENDRA PORTFOLIO - JAVASCRIPT INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
    });
  }

  // 2. Smooth Navigation Scrolling with Fixed Header Offset
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetId === '#hero' ? 0 : offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if open
        if (mobileDrawer) {
          mobileDrawer.classList.add('hidden');
        }

        // Active State Update
        navLinks.forEach(link => link.classList.remove('active'));
        if (this.classList.contains('nav-link')) {
          this.classList.add('active');
        }
      }
    });
  });

  // 2b. Active Section Tracker (ScrollSpy based on viewport intersection)
  const onScroll = () => {
    const scrollPosition = window.innerHeight * 0.35;
    let currentSectionId = 'hero';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= scrollPosition && rect.bottom >= scrollPosition) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Handle bottom of page
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 60) {
      currentSectionId = 'testimonials';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on page load

  // 3. Laptop Typewriter Effect
  const typewriterElement = document.getElementById('typewriter-text');
  const typewriterPhrases = [
    "Architecting full-stack AI automation systems...",
    "Building scalable Next.js & Python backends...",
    "Deploying autonomous Claude & GPT reasoning agents...",
    "Optimizing real-time databases & sub-50ms APIs..."
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 50;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 25;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 55;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typingSpeed = 400; // Pause before next
    }

    setTimeout(typeEffect, typingSpeed);
  }

  setTimeout(typeEffect, 1000);

  // --- 4. Hover Listener for Services Card Stack (Open on Hover) ---
  const servicesCardStack = document.querySelector('.services-card-stack');
  if (servicesCardStack) {
    servicesCardStack.addEventListener('mouseenter', () => {
      servicesCardStack.classList.add('stack-hovered');
    });

    servicesCardStack.addEventListener('mouseleave', () => {
      servicesCardStack.classList.remove('stack-hovered');
    });
  }

  // --- 4b. Mobile-Only Auto-Scroll for WHAT I OFFER (Services) Cards Deck ---
  const servicesDeck = document.querySelector('.services-card-stack') || document.querySelector('.services-cards-deck');
  if (servicesDeck) {
    let autoScrollInterval = null;
    let isUserInteracting = false;
    let resumeTimeout = null;
    let scrollDirection = 1; // 1 = right, -1 = left

    const startMobileAutoScroll = () => {
      if (window.innerWidth > 768) {
        stopMobileAutoScroll();
        return;
      }

      if (autoScrollInterval) return;

      autoScrollInterval = setInterval(() => {
        if (isUserInteracting || window.innerWidth > 768) return;

        const maxScroll = servicesDeck.scrollWidth - servicesDeck.clientWidth;
        if (maxScroll <= 0) return;

        if (servicesDeck.scrollLeft >= maxScroll - 3) {
          scrollDirection = -1;
        } else if (servicesDeck.scrollLeft <= 3) {
          scrollDirection = 1;
        }

        servicesDeck.scrollBy({
          left: scrollDirection * 2,
          behavior: 'auto'
        });
      }, 30);
    };

    const stopMobileAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    // Pause on user touch interaction, then resume after 2s of inactivity
    const pauseOnInteraction = () => {
      isUserInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 2000);
    };

    servicesDeck.addEventListener('touchstart', pauseOnInteraction, { passive: true });
    servicesDeck.addEventListener('touchmove', pauseOnInteraction, { passive: true });
    servicesDeck.addEventListener('touchend', pauseOnInteraction, { passive: true });

    // Initialize on mobile and adjust on resize
    startMobileAutoScroll();
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        startMobileAutoScroll();
      } else {
        stopMobileAutoScroll();
      }
    });
  }

  // 5. Client Stories (Social Proof) Testimonial Carousel Slider
  const testimonialsTrack = document.getElementById('testimonials-track');
  const prevTestimonialBtn = document.getElementById('testimonial-prev-btn');
  const nextTestimonialBtn = document.getElementById('testimonial-next-btn');

  if (testimonialsTrack && prevTestimonialBtn && nextTestimonialBtn) {
    let currentSlide = 0;
    const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    const getVisibleCards = () => {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const updateSliderPosition = () => {
      if (!cards.length) return;
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, totalCards - visibleCards);
      
      if (currentSlide > maxSlide) currentSlide = maxSlide;
      if (currentSlide < 0) currentSlide = 0;

      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24; // 1.5rem = 24px
      const offset = currentSlide * (cardWidth + gap);

      testimonialsTrack.style.transform = `translateX(-${offset}px)`;
    };

    prevTestimonialBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, totalCards - visibleCards);
      currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
      updateSliderPosition();
    });

    nextTestimonialBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, totalCards - visibleCards);
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      updateSliderPosition();
    });

    window.addEventListener('resize', updateSliderPosition);
  }

  // 6. Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const contactEmail = document.getElementById('contact-email');

  if (copyEmailBtn && contactEmail) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(contactEmail.textContent.trim()).then(() => {
        const originalHtml = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Copied!';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalHtml;
        }, 2000);
      });
    });
  }

  // 7. Interactive Project Modals
  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  const modalDetails = {
    'modal-1': {
      title: 'PromptForge AI — Multi-Agent Prompt Suite',
      category: 'AI & Machine Learning Systems',
      description: 'An enterprise evaluation platform built to test, benchmark, and deploy mission-critical system prompts across OpenAI, Anthropic, and open-source models with statistical confidence.',
      metrics: ['99.2% prompt evaluation consistency', 'Zero regression deployment hooks', 'Sub-80ms benchmark runner'],
      stack: ['Next.js 14', 'TypeScript', 'Claude 3.5 Sonnet API', 'FastAPI', 'Redis']
    },
    'modal-2': {
      title: 'Nexus Analytics Cloud — Streaming Dashboard',
      category: 'Full-Stack Web Application',
      description: 'Ultra-low latency financial streaming portal rendering real-time candlestick charts, automated SQL query generators, and granular user permission matrices.',
      metrics: ['100k+ events/sec throughput', 'Sub-50ms end-to-end latency', 'Custom WebSocket broker'],
      stack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'TailwindCSS']
    },
    'modal-3': {
      title: 'AutoFlow Ingest Engine — Vector Pipeline',
      category: 'Automation & Data Pipelines',
      description: 'Autonomous worker orchestrator for ingesting heterogeneous enterprise PDF files, financial tables, and technical manuals into high-dimensional vector embeddings.',
      metrics: ['5M+ daily vector insertions', 'Automatic OCR failover recovery', 'Self-healing worker nodes'],
      stack: ['Python', 'Pinecone', 'Docker', 'Temporal.io', 'AWS S3']
    }
  };

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const data = modalDetails[modalId];

      if (data && modalContent && projectModal) {
        modalContent.innerHTML = `
          <div class="mb-4">
            <span class="text-xs font-mono text-terracotta uppercase font-bold tracking-wider">${data.category}</span>
            <h3 class="text-2xl font-bold text-paper mt-1">${data.title}</h3>
          </div>
          <p class="text-sm text-paper-muted leading-relaxed mb-6">${data.description}</p>
          
          <div class="mb-6">
            <h4 class="text-xs font-mono text-paper uppercase tracking-wider mb-2 font-semibold">Key Highlights & Metrics:</h4>
            <ul class="space-y-1.5 text-xs text-paper-muted font-mono">
              ${data.metrics.map(m => `<li class="flex items-center gap-2"><span class="text-terracotta">&bull;</span> ${m}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-mono text-paper uppercase tracking-wider mb-2 font-semibold">Tech Stack:</h4>
            <div class="flex flex-wrap gap-2">
              ${data.stack.map(s => `<span class="tech-pill">${s}</span>`).join('')}
            </div>
          </div>
        `;

        projectModal.classList.remove('hidden');
      }
    });
  });

  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.add('hidden');
      }
    });
  }

  // --- Initialize EmailJS ---
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "43TsqjoiCvqkTClw8"
    });
  }

  // 8. Contact Form Handling via Real EmailJS Send
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fromName = document.getElementById('from_name')?.value.trim();
      const fromEmail = document.getElementById('from_email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      // Basic validation
      if (!fromName || !fromEmail || !subject || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'text-center text-xs font-semibold p-3.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30';
        formStatus.classList.remove('hidden');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fromEmail)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'text-center text-xs font-semibold p-3.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30';
        formStatus.classList.remove('hidden');
        return;
      }

      const originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-sm"></i> <span>Sending...</span>';
      submitBtn.disabled = true;
      formStatus.classList.add('hidden');

      const templateParams = {
        from_name: fromName,
        from_email: fromEmail,
        subject: subject,
        message: message
      };

      emailjs.send("service_hrw5veq", "template_935e2od", templateParams)
        .then(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;

          formStatus.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
          formStatus.className = 'text-center text-xs font-semibold p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
          formStatus.classList.remove('hidden');

          contactForm.reset();

          setTimeout(() => {
            formStatus.classList.add('hidden');
          }, 6000);
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;

          formStatus.textContent = 'Failed to send message. Please try again or reach out directly at overlordyt621@gmail.com.';
          formStatus.className = 'text-center text-xs font-semibold p-3.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30';
          formStatus.classList.remove('hidden');
        });
    });
  }

  // 9. Interactive Sticky Notes Tilt Hover Sound / Vibration feedback
  const stickyNotes = document.querySelectorAll('.sticky-note');
  stickyNotes.forEach(note => {
    note.addEventListener('mouseenter', () => {
      note.style.zIndex = '30';
    });
    note.addEventListener('mouseleave', () => {
      note.style.zIndex = '1';
    });
  });
});
