import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ACADEMY_BRAND_LOGO_SRC } from '../brandAssets';
import { useAcademyNavSession } from '../useAcademyNavSession';
import '../academy.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { authed } = useAcademyNavSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`academy-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/academy" className="nav-logo nav-logo-link" aria-label="MET Academy home">
          <img className="academy-brand-logo" src={ACADEMY_BRAND_LOGO_SRC} alt="" decoding="async" />
        </Link>
        <div className="nav-right">
          <div className="nav-links">
            <a href="/academy">Training</a>
          </div>
          <div className="nav-auth">{!authed ? <Link to="/sign-in" className="btn-academy btn-academy-login">Log in</Link> : null}</div>
        </div>
      </div>
    </nav>
  );
};

export default function MasterclassDetails() {
  const course = {
    title: "Advanced Lymphatic Drainage",
    duration: "12 Hours",
    modules: 8,
    instructor: "Expert MET Specialist",
    description: "Master the fundamental and advanced techniques of manual lymphatic drainage specifically tailored for post-surgical recovery.",
    syllabus: [
      { title: "Foundations", topics: ["Anatomy", "Pathology", "Contraindications"] },
      { title: "Manual Techniques", topics: ["Pump strokes", "Scoop strokes"] },
      { title: "Applications", topics: ["Face-lift", "Liposuction"] }
    ]
  };

  return (
    <div className="academy-page">
      <Navbar />

      <section style={{ padding: '160px var(--pad) 100px', background: 'var(--ink)', color: 'white' }}>
        <div className="nav-container" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <span className="btn-academy btn-academy-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Specialized Training</span>
          <h1 className="academy-h1" style={{ color: 'white', margin: '24px 0', fontSize: 'calc(64px * var(--academy-type-scale))' }}>{course.title}</h1>
          <div style={{ display: 'flex', gap: '32px', opacity: 0.6, fontSize: 'calc(14px * var(--academy-type-scale))', fontFamily: 'var(--mono)' }}>
            <span>{course.duration}</span>
            <span>{course.modules} MODULES</span>
            <span>{course.instructor}</span>
          </div>
        </div>
      </section>

      <section className="section-academy">
        <div className="academy-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '80px' }}>
          <div>
            <h2 style={{ fontSize: 'calc(32px * var(--academy-type-scale))', marginBottom: '24px' }}>Expertise Overview</h2>
            <p className="academy-lede">{course.description}</p>
            
            <div style={{ marginTop: '56px' }}>
              <h4 style={{ fontSize: 'calc(20px * var(--academy-type-scale))', fontWeight: 700, marginBottom: '32px' }}>Curriculum Syllabus</h4>
              {course.syllabus.map((module, i) => (
                <div key={i} style={{ padding: '24px', border: '1px solid var(--line-light)', borderRadius: '12px', marginBottom: '16px' }}>
                  <h5 style={{ fontSize: 'calc(18px * var(--academy-type-scale))', fontWeight: 700, marginBottom: '12px', color: 'var(--silver)' }}>Module 0{i+1}: {module.title}</h5>
                  <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7 }}>
                    {module.topics.map((t, j) => <li key={j}>• {t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ position: 'sticky', top: '120px', background: 'var(--snow)', padding: '40px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: 'calc(24px * var(--academy-type-scale))', fontWeight: 700, marginBottom: '8px' }}>Course Access</h3>
              <p style={{ opacity: 0.6, marginBottom: '32px' }}>Enroll now to start your journey.</p>
              
              <div style={{ fontSize: 'calc(42px * var(--academy-type-scale))', fontWeight: 700, marginBottom: '32px' }}>$499 <span style={{ fontSize: 'calc(16px * var(--academy-type-scale))', opacity: 0.5, fontWeight: 400 }}>USD</span></div>
              
              <button className="btn-academy btn-academy-create" style={{ width: '100%', justifyContent: 'center', padding: '18px' }}>Enroll in Masterclass</button>
              <button className="btn-academy btn-academy-login" style={{ width: '100%', justifyContent: 'center', padding: '18px', marginTop: '12px' }}>Save for later</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
