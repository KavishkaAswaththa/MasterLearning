"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles,
  Zap,
  Trophy,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Lock,
  ArrowRight,
  CheckCircle,
  Award,
  Mail,
  Phone,
  MapPin,
  Send,
  Search,
  User,
  Menu,
  X
} from "lucide-react";
import styles from "./page.module.css";

const MAIN_SLIDES = [
  {
    id: 1,
    title: "Ultimate Assessments",
    subtitle: "Experience the pinnacle of gamified learning with our responsive countdown quiz dashboards.",
    image: "/ml_slide_quiz.png",
    tag: "Quiz Portal",
    icon: BookOpen
  },
  {
    id: 2,
    title: "Gamified Progress",
    subtitle: "Track your academic journey. Earn XP points, rank on leaderboards, and unlock digital rewards.",
    image: "/ml_slide_dashboard.png",
    tag: "Progress Logs",
    icon: Trophy
  },
  {
    id: 3,
    title: "Immersive Lectures",
    subtitle: "Review video lectures at your own pace with slide-in lesson indices and downloadable materials.",
    image: "/ml_slide_classroom.png",
    tag: "Virtual Classrooms",
    icon: GraduationCap
  }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Slider State
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Mobile Search Overlay State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Contact Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Newsletter Email State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Slider controls
  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % MAIN_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setSlideIndex((prev) => (prev - 1 + MAIN_SLIDES.length) % MAIN_SLIDES.length);
  }, []);

  // Automatic slider rotation (7s)
  useEffect(() => {
    if (!isSliderHovered) {
      const timer = setInterval(nextSlide, 7000);
      return () => clearInterval(timer);
    }
  }, [isSliderHovered, nextSlide]);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer to highlight active nav link
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Detect when section occupies center viewport
      threshold: 0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    const homeEl = homeRef.current;
    const featuresEl = featuresRef.current;
    const coursesEl = coursesRef.current;
    const aboutEl = aboutRef.current;
    const contactEl = contactRef.current;

    const targets = [homeEl, featuresEl, coursesEl, aboutEl, contactEl];

    targets.forEach((target) => {
      if (target) observer.observe(target);
    });

    return () => {
      targets.forEach((target) => {
        if (target) observer.unobserve(target);
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitted(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) return;

    // Simulate API subscribe call
    setTimeout(() => {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }, 800);
  };

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Decorative Blur Blobs */}
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>
      <div className={styles.bgGlow3}></div>

      {/* Header / Navigation */}
      <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => scrollToSection("home")}>
            <div className={styles.logoIcon}>ML</div>
            <span className={styles.logoText}>
              Master<span className={styles.logoHighlight}>Learning</span>
            </span>
          </div>

          {/* Desktop Capsule Nav */}
          <div className={styles.desktopNavCapsule}>
            {["home", "features", "courses", "about", "contact"].map((sec) => (
              <span 
                key={sec}
                className={`${styles.navLink} ${activeSection === sec ? styles.navLinkActive : ""}`}
                onClick={() => scrollToSection(sec)}
              >
                {sec === "courses" ? "Curriculum" : sec.charAt(0).toUpperCase() + sec.slice(1)}
              </span>
            ))}
          </div>

          {/* Right Actions */}
          <div className={styles.navActions}>
            {/* Quick Search Input */}
            <div className={styles.searchWrapper}>
              <input 
                type="text" 
                placeholder="Search lessons..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    alert(`Search query: ${searchQuery}`);
                    setSearchQuery("");
                  }
                }}
              />
              <button className={styles.searchIconBtn} aria-label="Search button">
                <Search size={16} />
              </button>
            </div>

            {/* Mobile Search Icon Trigger */}
            <button 
              className={`${styles.iconBtn} ${styles.mobileSearchBtn}`}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search input"
            >
              <Search size={18} />
            </button>



            <div className={styles.divider}></div>

            {/* User Profile / Dashboard Redirect */}
            <Link href="/dashboard" className={styles.iconBtn} aria-label="Dashboard Link">
              <User size={18} />
            </Link>

            {/* Mobile menu toggle */}
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Sliding Search Overlay for Mobile */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className={styles.mobileSearchOverlay}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.mobileSearchInputWrapper}>
                <input
                  type="text"
                  placeholder="Search lessons..."
                  className={styles.mobileSearchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      alert(`Search query: ${searchQuery}`);
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }
                  }}
                  autoFocus
                />
                <button 
                  className={styles.searchIconBtn}
                  onClick={() => {
                    if (searchQuery.trim()) {
                      alert(`Search query: ${searchQuery}`);
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }
                  }}
                  aria-label="Submit search"
                >
                  <Search size={18} />
                </button>
              </div>
              <button 
                className={styles.iconBtn}
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Mobile search inside drawer */}
            <div className={styles.mobileSearchInputWrapper}>
              <input
                type="text"
                placeholder="Search lessons..."
                className={styles.mobileSearchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    alert(`Search query: ${searchQuery}`);
                    setSearchQuery("");
                    setMobileMenuOpen(false);
                  }
                }}
              />
              <button className={styles.searchIconBtn} aria-label="Submit mobile search">
                <Search size={18} />
              </button>
            </div>

            <ul className={styles.mobileNavLinks}>
              {["home", "features", "courses", "about", "contact"].map((sec) => (
                <li key={sec}>
                  <span 
                    className={`${styles.mobileNavLink} ${activeSection === sec ? styles.mobileNavLinkActive : ""}`}
                    onClick={() => scrollToSection(sec)}
                  >
                    <span>{sec === "courses" ? "Curriculum" : sec.charAt(0).toUpperCase() + sec.slice(1)}</span>
                    <Sparkles className={styles.mobileNavLinkIcon} size={14} />
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.mobileNavActions}>
              <Link href="/login" className={styles.btnSignIn} onClick={() => setMobileMenuOpen(false)}>
                Account Login
              </Link>
              <Link href="/dashboard" className={styles.btnSignUp} onClick={() => setMobileMenuOpen(false)}>
                My Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Slider Hero Section */}
      <section 
        id="home" 
        ref={homeRef} 
        className={styles.heroSection}
      >
        <div className={styles.heroGrid}>
          {/* Left Vertical Banner (Visible on lg/desktop only) */}
          <div className={styles.heroLeftCol}>
            <motion.img 
              src="/ml_hero_vertical.png" 
              alt="Smart Learning Features Banner" 
              className={styles.heroLeftBg}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            />
            <div className={styles.heroLeftOverlay}>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className={styles.heroLeftIcon}>
                  <Zap size={22} />
                </div>
                <h3 className={styles.heroLeftTitle}>Smart<br/>Learning</h3>
                <p className={styles.heroLeftDesc}>Track your achievements, earn badges, and dominate classroom leaderboards.</p>
                <button onClick={() => scrollToSection("features")} className={styles.btnLeftCol}>
                  Explore More <ArrowRight size={14} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right Area (Slider and Banners) */}
          <div className={styles.heroRightCol}>
            {/* Slider Container */}
            <div 
              className={styles.sliderWrapper}
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
            >
              {/* Slides */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className={styles.slideItem}
                >
                  <div className={styles.slideOverlay} />
                  <img 
                    src={MAIN_SLIDES[slideIndex].image} 
                    alt={MAIN_SLIDES[slideIndex].title} 
                    className={styles.slideBg}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className={styles.sliderArrows}>
                <button onClick={prevSlide} className={styles.arrowBtn} aria-label="Previous slide">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className={styles.arrowBtn} aria-label="Next slide">
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Slide Content Overlay */}
              <div className={styles.slideContent}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Badge */}
                    <div className={styles.slideBadge}>
                      {React.createElement(MAIN_SLIDES[slideIndex].icon, { size: 14 })}
                      <span className={styles.slideBadgeText}>{MAIN_SLIDES[slideIndex].tag}</span>
                    </div>

                    {/* Title */}
                    <h1 className={styles.slideTitle}>
                      {MAIN_SLIDES[slideIndex].title.split(" ").map((word, i) => (
                        <span key={i} className={styles.slideTitleSpan}>{word}</span>
                      ))}
                    </h1>

                    {/* Description */}
                    <p className={styles.slideDesc}>{MAIN_SLIDES[slideIndex].subtitle}</p>

                    {/* Buttons */}
                    <div className={styles.slideButtons}>
                      <button onClick={() => scrollToSection("courses")} className={`${styles.btnSliderDiscover} btn-shine`}>
                        Discover Now
                      </button>
                      <button onClick={() => scrollToSection("features")} className={styles.btnSliderCatalog}>
                        <div className={styles.sliderArrowIcon}>
                          <ChevronRight size={14} />
                        </div>
                        <span>View Catalog</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress Dots */}
              <div className={styles.sliderDots}>
                {MAIN_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`${styles.dot} ${slideIndex === i ? styles.dotActive : ""}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Banners Grid */}
            <div className={styles.bottomBannerGrid}>
              {/* Banner 1: Daily Quiz */}
              <div className={styles.bannerCard}>
                <img src="/ml_banner_quiz.png" alt="Quiz Assessment Banner" className={styles.bannerBg} />
                <div className={styles.bannerOverlay}>
                  <h3 className={styles.bannerTitle}>Daily Quiz</h3>
                  <button onClick={() => scrollToSection("courses")} className={`${styles.btnBanner} btn-shine`}>
                    Attempt Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Banner 2: Hall of Fame */}
              <div className={styles.bannerCard}>
                <div className={styles.bannerTextContent}>
                  <span className={styles.bannerBadge}>Hall of Fame</span>
                  <h3 className={styles.bannerTitle} style={{ color: "var(--foreground)" }}>Best Sellers</h3>
                  <button onClick={() => scrollToSection("about")} className={styles.bannerLinkText}>
                    Check XP Leaderboards <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section 
        id="features" 
        ref={featuresRef} 
        className={styles.section}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Core Platform Modules</span>
          <h2 className={styles.sectionTitle}>Everything you need to succeed</h2>
          <p className={styles.sectionSubtitle}>
            Our feature layers are fully integrated to deliver modular classrooms, responsive gradeboards, 
            and authenticated profiles.
          </p>
        </div>

        <motion.div 
          className={styles.featuresGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Feature 1: Quiz Portal */}
          <motion.div className={styles.featureCard} variants={fadeInUp}>
            <div className={styles.featureIconWrapper}>
              <BookOpen size={20} />
            </div>
            <h3 className={styles.featureTitle}>Interactive Quiz Portal</h3>
            <p className={styles.featureDesc}>
              Test your retention with custom multi-choice questionnaires featuring countdown timers, validation checks, and automatic grade logs.
            </p>
            <Link href="/quiz/science-101" className={styles.featureLink}>
              Try Quiz <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Feature 2: Student Dashboard */}
          <motion.div className={styles.featureCard} variants={fadeInUp}>
            <div className={styles.featureIconWrapper}>
              <Award size={20} />
            </div>
            <h3 className={styles.featureTitle}>Student Dashboard</h3>
            <p className={styles.featureDesc}>
              Monitor your study progress. Track your XP levels, rank on public leaderboards, and unlock digital profile badges.
            </p>
            <Link href="/dashboard" className={styles.featureLink}>
              View Dashboard <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Feature 3: Video Classroom */}
          <motion.div className={styles.featureCard} variants={fadeInUp}>
            <div className={styles.featureIconWrapper}>
              <GraduationCap size={20} />
            </div>
            <h3 className={styles.featureTitle}>Video Classrooms</h3>
            <p className={styles.featureDesc}>
              Stream high-definition recorded lessons with sliding chapter menus, real-time index bookmarks, and downloadable PDF worksheets.
            </p>
            <span className={styles.featureLink} style={{ opacity: 0.6, cursor: "not-allowed" }}>
              Classroom Mocked
            </span>
          </motion.div>

          {/* Feature 4: Secure Auth */}
          <motion.div className={styles.featureCard} variants={fadeInUp}>
            <div className={styles.featureIconWrapper}>
              <Lock size={20} />
            </div>
            <h3 className={styles.featureTitle}>Secure Authentication</h3>
            <p className={styles.featureDesc}>
              Integrates robust sign-up and sign-in modules with inline alerts, password visibility toggles, and stateful verification guards.
            </p>
            <Link href="/login" className={styles.featureLink}>
              Access Account <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Courses Section */}
      <section 
        id="courses" 
        ref={coursesRef} 
        className={styles.section}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Academics & Pathways</span>
          <h2 className={styles.sectionTitle}>Explore Assessment Pathways</h2>
          <p className={styles.sectionSubtitle}>
            Jump straight into curated curricula and check your learning benchmarks immediately.
          </p>
        </div>

        <motion.div 
          className={styles.coursesGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Course 1: Science */}
          <motion.div className={`${styles.courseCard} ${styles.courseCardActive}`} variants={fadeInUp}>
            <span className={styles.courseBadge}>Grade 10</span>
            <div className={styles.courseHeader}>
              <h3 className={styles.courseTitle}>Grade 10 Science Quiz</h3>
              <p className={styles.courseDesc}>
                Covers fundamentals of chemical reactions, basic genetics, electrical circuitry, and physical kinematics.
              </p>
            </div>
            <div className={styles.courseInfo}>
              <div className={styles.courseMetaItem}>⏱️ 10 Mins</div>
              <div className={styles.courseMetaItem}>📝 10 Questions</div>
            </div>
            <div className={styles.courseProgressContainer}>
              <div className={styles.courseProgressHeader}>
                <span className={styles.courseProgressLabel}>Est. Difficulty</span>
                <span className={styles.courseProgressVal}>Intermediate</span>
              </div>
              <div className={styles.courseProgressBar}>
                <div className={styles.courseProgressFill} style={{ width: "60%" }}></div>
              </div>
            </div>
            <div className={styles.courseActions}>
              <Link href="/quiz/science-101" className={styles.btnCourse}>
                Attempt Quiz <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Course 2: Mathematics */}
          <motion.div className={styles.courseCard} variants={fadeInUp}>
            <span className={styles.courseBadge}>Grade 11</span>
            <div className={styles.courseHeader}>
              <h3 className={styles.courseTitle}>Grade 11 Mathematics</h3>
              <p className={styles.courseDesc}>
                Covers geometry proofs, polynomial expressions, trigonometry foundations, and statistical measurements.
              </p>
            </div>
            <div className={styles.courseInfo}>
              <div className={styles.courseMetaItem}>⏱️ 15 Mins</div>
              <div className={styles.courseMetaItem}>📝 15 Questions</div>
            </div>
            <div className={styles.courseProgressContainer}>
              <div className={styles.courseProgressHeader}>
                <span className={styles.courseProgressLabel}>Est. Difficulty</span>
                <span className={styles.courseProgressVal}>Advanced</span>
              </div>
              <div className={styles.courseProgressBar}>
                <div className={styles.courseProgressFill} style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className={styles.courseActions}>
              <Link href="/quiz/math-202" className={styles.btnCourse}>
                Attempt Quiz <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Course 3: History */}
          <motion.div className={styles.courseCard} variants={fadeInUp}>
            <span className={styles.courseBadge}>Grade 8</span>
            <div className={styles.courseHeader}>
              <h3 className={styles.courseTitle}>Grade 8 History</h3>
              <p className={styles.courseDesc}>
                Explore ancient civilizations, medieval kingdoms, colonization transitions, and industrial revolution impacts.
              </p>
            </div>
            <div className={styles.courseInfo}>
              <div className={styles.courseMetaItem}>⏱️ 8 Mins</div>
              <div className={styles.courseMetaItem}>📝 8 Questions</div>
            </div>
            <div className={styles.courseProgressContainer}>
              <div className={styles.courseProgressHeader}>
                <span className={styles.courseProgressLabel}>Est. Difficulty</span>
                <span className={styles.courseProgressVal}>Beginner</span>
              </div>
              <div className={styles.courseProgressBar}>
                <div className={styles.courseProgressFill} style={{ width: "30%" }}></div>
              </div>
            </div>
            <div className={styles.courseActions}>
              <Link href="/dashboard" className={styles.btnCourse}>
                View Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. About Section */}
      <section 
        id="about" 
        ref={aboutRef} 
        className={styles.section}
      >
        <div className={styles.aboutGrid}>
          <motion.div 
            className={styles.aboutTextContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className={styles.sectionBadge}>About MasterLearning</span>
            <h2 className={styles.aboutTitle}>Built for modern classrooms, designed for success</h2>
            <p className={styles.aboutDesc}>
              MasterLearning was engineered to solve concurrent student assessment challenges. With modular interface cards, 
              lightweight state validation, and clean cloud setups, we bridge the gap between education and gamification.
            </p>
            
            <div className={styles.aboutFeaturesList}>
              <div className={styles.aboutFeatureItem}>
                <CheckCircle className={styles.aboutFeatureIcon} size={20} />
                <span className={styles.aboutFeatureText}>Cloud-native database bindings ready to integrate.</span>
              </div>
              <div className={styles.aboutFeatureItem}>
                <CheckCircle className={styles.aboutFeatureIcon} size={20} />
                <span className={styles.aboutFeatureText}>Clean mobile responsiveness optimized for fluid glass interfaces.</span>
              </div>
              <div className={styles.aboutFeatureItem}>
                <CheckCircle className={styles.aboutFeatureIcon} size={20} />
                <span className={styles.aboutFeatureText}>Instant, dynamic quiz feedback for students.</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.aboutStats}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className={styles.statCard} variants={fadeInUp}>
              <div className={`${styles.statVal} gradient-text`}>4+</div>
              <div className={styles.statLabel}>Core Portals</div>
            </motion.div>
            <motion.div className={styles.statCard} variants={fadeInUp}>
              <div className={`${styles.statVal} gradient-text`}>100%</div>
              <div className={styles.statLabel}>Responsive Layout</div>
            </motion.div>
            <motion.div className={styles.statCard} variants={fadeInUp}>
              <div className={`${styles.statVal} gradient-text`}>0</div>
              <div className={styles.statLabel}>Vulnerabilities</div>
            </motion.div>
            <motion.div className={styles.statCard} variants={fadeInUp}>
              <div className={`${styles.statVal} gradient-text`}>SSR</div>
              <div className={styles.statLabel}>Optimized Builds</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section 
        id="contact" 
        ref={contactRef} 
        className={styles.section}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Get In Touch</span>
          <h2 className={styles.sectionTitle}>Let&apos;s start a conversation</h2>
          <p className={styles.sectionSubtitle}>
            Have questions about MasterLearning or need assistance with your study plan? Reach out to our support team.
          </p>
        </div>

        <motion.div 
          className={styles.contactContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          {formSubmitted ? (
            <motion.div 
              style={{ textAlign: "center", padding: "2rem 0" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <CheckCircle size={56} style={{ color: "#22c55e", marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Message Sent Successfully!</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Thank you for reaching out. A MasterLearning academic adviser will contact you shortly.
              </p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className={styles.btnSecondary}
                style={{ marginTop: "1.5rem" }}
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
              {formError && (
                <div style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: 600 }}>
                  ⚠️ {formError}
                </div>
              )}
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-name" className={styles.inputLabel}>Full Name</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    placeholder="Kavishka Aswaththa"
                    className={styles.inputField}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-email" className={styles.inputLabel}>Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="student@masterlearning.com"
                    className={styles.inputField}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="contact-message" className={styles.inputLabel}>Message details</label>
                <textarea 
                  id="contact-message"
                  placeholder="How can we help your learning journey?"
                  className={styles.textArea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.btnSubmit}>
                Send Message <Send size={16} />
              </button>
            </form>
          )}

          <div className={styles.contactInfoGrid}>
            <div className={styles.contactInfoCard}>
              <div className={styles.contactInfoIcon}><Mail size={18} /></div>
              <div className={styles.contactInfoDetails}>
                <span className={styles.contactInfoLabel}>Email support</span>
                <span className={styles.contactInfoVal}>support@masterlearning.com</span>
              </div>
            </div>
            <div className={styles.contactInfoCard}>
              <div className={styles.contactInfoIcon}><Phone size={18} /></div>
              <div className={styles.contactInfoDetails}>
                <span className={styles.contactInfoLabel}>Phone line</span>
                <span className={styles.contactInfoVal}>+94 11 234 5678</span>
              </div>
            </div>
            <div className={styles.contactInfoCard}>
              <div className={styles.contactInfoIcon}><MapPin size={18} /></div>
              <div className={styles.contactInfoDetails}>
                <span className={styles.contactInfoLabel}>Location</span>
                <span className={styles.contactInfoVal}>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className={styles.footerSection}>
        <div className={styles.footerAmbientGlow}></div>
        <div className={styles.footerGrid}>
          {/* Brand Col */}
          <div className={styles.footerBranding}>
            <div className={styles.footerLogo} onClick={() => scrollToSection("home")}>
              <div className={styles.footerLogoIcon}>ML</div>
              <span className={styles.footerLogoText}>
                Master<span className={styles.logoHighlight}>Learning</span>
              </span>
            </div>
            <p className={styles.footerDesc}>
              A premium e-learning platform delivering responsive assessments and student progress tracking.
            </p>

            <div className={styles.footerSocials} style={{ marginTop: "1rem" }}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" width="18" height="18" style={{ marginTop: "2px" }}>
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Col */}
          <div className={styles.footerLinksCol}>
            <h4 className={styles.footerColTitle}>Explore</h4>
            <ul className={styles.footerLinks}>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => scrollToSection("home")}>
                  <span className={styles.footerLinksBullet}></span> Home
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => scrollToSection("features")}>
                  <span className={styles.footerLinksBullet}></span> Features
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => scrollToSection("courses")}>
                  <span className={styles.footerLinksBullet}></span> Curriculum
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => scrollToSection("about")}>
                  <span className={styles.footerLinksBullet}></span> About Us
                </span>
              </li>
            </ul>
          </div>

          {/* Portals Col */}
          <div className={styles.footerLinksCol}>
            <h4 className={styles.footerColTitle}>Portals</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/login">
                  <span className={styles.footerLinksBullet}></span> Student Login
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <span className={styles.footerLinksBullet}></span> Student Signup
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className={styles.footerLinksBullet}></span> Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/quiz/science-101">
                  <span className={styles.footerLinksBullet}></span> Science Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className={styles.footerLinksCol}>
            <h4 className={styles.footerColTitle}>Stay Updated</h4>
            <p className={styles.footerDesc}>
              Get the latest updates and newsletter.
            </p>
            {newsletterSubscribed ? (
              <div style={{ color: "#22c55e", fontSize: "0.9rem", fontWeight: 600, marginTop: "0.5rem" }}>
                ✓ Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className={styles.footerNewsletterWrapper}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={styles.footerNewsletterInput}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className={styles.btnNewsletterSubmit} aria-label="Subscribe email">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} MasterLearning E-Learning Hub. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
