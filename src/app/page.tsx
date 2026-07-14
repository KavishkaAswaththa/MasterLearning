"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  GraduationCap, 
  Lock, 
  ArrowRight, 
  Menu, 
  X, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Send 
} from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Contact Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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
          <div className={styles.logo} onClick={() => scrollToSection("home")}>
            <div className={styles.logoIcon}>ML</div>
            <span className="gradient-text">MasterLearning</span>
          </div>

          <ul className={styles.navLinks}>
            {["home", "features", "courses", "about", "contact"].map((sec) => (
              <li key={sec}>
                <span 
                  className={`${styles.navLink} ${activeSection === sec ? styles.navLinkActive : ""}`}
                  onClick={() => scrollToSection(sec)}
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <Link href="/login" className={styles.btnSignIn}>
              Sign In
            </Link>
            <Link href="/signup" className={styles.btnSignUp}>
              Get Started
            </Link>
          </div>

          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
            <ul className={styles.mobileNavLinks}>
              {["home", "features", "courses", "about", "contact"].map((sec) => (
                <li key={sec}>
                  <span 
                    className={`${styles.mobileNavLink} ${activeSection === sec ? styles.mobileNavLinkActive : ""}`}
                    onClick={() => scrollToSection(sec)}
                  >
                    {sec.charAt(0).toUpperCase() + sec.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.mobileNavActions}>
              <Link href="/login" className={styles.btnSignIn} onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.btnSignUp} onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section 
        id="home" 
        ref={homeRef} 
        className={`${styles.section} ${styles.heroSection}`}
      >
        <div className={styles.heroGrid}>
          <motion.div 
            className={styles.heroTextContent}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className={styles.heroBadge}>🚀 Gamified Learning Experience</span>
            <h1 className={styles.heroTitle}>
              Reimagine How You <br/>
              <span className="gradient-text">Master New Skills</span>
            </h1>
            <p className={styles.heroSubtitle}>
              MasterLearning is a scalable, cloud-native e-learning platform with gamified assessment 
              pathways, real-time rewards tracking, and interactive video classrooms.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                Explore Dashboard <ArrowRight size={18} />
              </Link>
              <button onClick={() => scrollToSection("courses")} className={styles.btnSecondary}>
                Browse Quizzes
              </button>
            </div>
          </motion.div>

          <motion.div 
            className={styles.heroIllustration}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Premium Animated Dashboard Mock */}
            <motion.div 
              className={styles.mockDashboardWrapper}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className={styles.mockNavbar}>
                <div className={styles.mockDots}>
                  <span className={styles.mockDot} style={{ backgroundColor: "#ef4444" }}></span>
                  <span className={styles.mockDot} style={{ backgroundColor: "#eab308" }}></span>
                  <span className={styles.mockDot} style={{ backgroundColor: "#22c55e" }}></span>
                </div>
                <div className={styles.mockTitle}>MasterLearning Platform V1.0</div>
                <div style={{ width: 38 }}></div>
              </div>

              <div className={styles.mockGrid}>
                <div className={styles.mockMain}>
                  <div className={styles.mockGraph}>
                    <div className={styles.mockGraphLine}>
                      <motion.div 
                        className={styles.mockGraphBar} 
                        style={{ height: "40%" }}
                        animate={{ height: ["40%", "75%", "40%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                      <motion.div 
                        className={styles.mockGraphBar} 
                        style={{ height: "60%" }}
                        animate={{ height: ["60%", "90%", "60%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      ></motion.div>
                      <motion.div 
                        className={styles.mockGraphBar} 
                        style={{ height: "30%" }}
                        animate={{ height: ["30%", "65%", "30%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      ></motion.div>
                      <motion.div 
                        className={styles.mockGraphBar} 
                        style={{ height: "70%" }}
                        animate={{ height: ["70%", "45%", "70%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className={styles.mockDetails}>
                    <div className={styles.mockTextLine} style={{ width: "80%" }}></div>
                    <div className={styles.mockTextLine} style={{ width: "50%" }}></div>
                  </div>
                </div>

                <div className={styles.mockSidebar}>
                  <div className={styles.mockProgressCircle}>
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      85% XP
                    </motion.span>
                  </div>
                  <div className={styles.mockLeaderboard}>
                    <div className={styles.mockUserRow}>
                      <span className={styles.mockAvatar}></span>
                      <div className={styles.mockTextLine} style={{ width: "30px" }}></div>
                    </div>
                    <div className={styles.mockUserRow}>
                      <span className={styles.mockAvatar} style={{ background: "var(--color-purple)" }}></span>
                      <div className={styles.mockTextLine} style={{ width: "40px" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
              <BookOpen size={24} />
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
              <Award size={24} />
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
              <GraduationCap size={24} />
            </div>
            <h3 className={styles.featureTitle}>Video Classrooms</h3>
            <p className={styles.featureDesc}>
              Stream high-definition recorded sessions with sliding chapter menus, real-time index bookmarks, and downloadable PDF worksheets.
            </p>
            <span className={styles.featureLink} style={{ opacity: 0.6, cursor: "not-allowed" }}>
              Classroom Mocked
            </span>
          </motion.div>

          {/* Feature 4: Secure Auth */}
          <motion.div className={styles.featureCard} variants={fadeInUp}>
            <div className={styles.featureIconWrapper}>
              <Lock size={24} />
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
        <div className={styles.footerGrid}>
          <div className={styles.footerBranding}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>ML</div>
              <span className="gradient-text">MasterLearning</span>
            </div>
            <p className={styles.footerDesc}>
              A high-performance cloud e-learning platform delivering responsive assessments and profile progress logs.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.socialLink} aria-label="Twitter">🕊️</a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">💼</a>
              <a href="#" className={styles.socialLink} aria-label="GitHub">💻</a>
            </div>
          </div>

          <div className={styles.footerLinksCol}>
            <h4 className={styles.footerColTitle}>Navigation</h4>
            <ul className={styles.footerLinks}>
              <li><span style={{ cursor: "pointer" }} onClick={() => scrollToSection("home")}>Home</span></li>
              <li><span style={{ cursor: "pointer" }} onClick={() => scrollToSection("features")}>Features</span></li>
              <li><span style={{ cursor: "pointer" }} onClick={() => scrollToSection("courses")}>Curriculum</span></li>
              <li><span style={{ cursor: "pointer" }} onClick={() => scrollToSection("about")}>About</span></li>
            </ul>
          </div>

          <div className={styles.footerLinksCol}>
            <h4 className={styles.footerColTitle}>Portals</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/login">Student Sign In</Link></li>
              <li><Link href="/signup">Student Register</Link></li>
              <li><Link href="/dashboard">Main Dashboard</Link></li>
              <li><Link href="/quiz/science-101">Science Assessment</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 MasterLearning E-Learning Hub. Built for the Mini-Hackathon 24-Hour Plan.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
