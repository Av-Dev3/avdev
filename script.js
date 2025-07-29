document.addEventListener("DOMContentLoaded", () => {
  // Navigation functionality
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "none";
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".skill-category, .service-card, .project-card, .testimonial-card, .stat"
  );

  animateElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Social media hover effects
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach(link => {
    link.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-2px) scale(1.05)";
    });
    
    link.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Button hover effects
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(button => {
    button.addEventListener("mouseenter", function() {
      if (!this.classList.contains("btn-primary")) {
        this.style.transform = "translateY(-2px)";
      }
    });
    
    button.addEventListener("mouseleave", function() {
      if (!this.classList.contains("btn-primary")) {
        this.style.transform = "translateY(0)";
      }
    });
  });

  // Project card hover effects
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-8px)";
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
    });
    
    card.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    });
  });

  // Service card hover effects
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-8px)";
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
    });
    
    card.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    });
  });

  // Skill item hover effects
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach(item => {
    item.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });
    
    item.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Testimonial card hover effects
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  testimonialCards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)";
    });
    
    card.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    });
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });

  // Form validation (if contact form exists)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Basic form validation
      const name = this.querySelector('input[name="name"]');
      const email = this.querySelector('input[name="email"]');
      const message = this.querySelector('textarea[name="message"]');
      
      if (!name.value || !email.value || !message.value) {
        alert("Please fill in all fields");
        return;
      }
      
      if (!isValidEmail(email.value)) {
        alert("Please enter a valid email address");
        return;
      }
      
      // Here you would typically send the form data
      alert("Thank you for your message! I'll get back to you soon.");
      this.reset();
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Loading animation
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  // Parallax effect for hero section
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroSection.style.transform = `translateY(${rate}px)`;
    });
  }

  // Counter animation for stats
  const stats = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.textContent;
        const duration = 2000;
        const increment = parseInt(finalValue) / (duration / 16);
        let currentValue = 0;
        
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= parseInt(finalValue)) {
            target.textContent = finalValue;
            clearInterval(timer);
          } else {
            target.textContent = Math.floor(currentValue) + "+";
          }
        }, 16);
        
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => {
    statsObserver.observe(stat);
  });

  // Portfolio filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterableProjectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      filterableProjectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project card hover effects for portfolio page
  const portfolioProjectCards = document.querySelectorAll('.portfolio-projects .project-card');
  portfolioProjectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    });
  });


});
