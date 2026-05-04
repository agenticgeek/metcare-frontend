import type Hls from 'hls.js';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { AcademyNav } from '../AcademyNav';
import { getAcademyCopy } from '../academyCopy';
import {
  LANDING_FREE_HLS_ITEMS,
  LANDING_TESTIMONIAL_YOUTUBE_ITEMS,
  type LandingVideoOpenPayload,
  publicVideoUrl,
  titleFromVideoFilename,
  youtubeEmbedUrl,
  youtubePosterUrl,
} from '../landingTestimonialVideos';
import { useAcademyNavSession } from '../useAcademyNavSession';
import { useLang } from '../../useLang';
import '../academy.css';

const revealEase = [0.22, 1, 0.36, 1] as const;

const revealViewport = { once: true, amount: 0.22 } as const;

function cardReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: revealViewport,
    transition: { duration: 0.62, delay, ease: revealEase },
  };
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

function LandingHlsVideo({
  manifestUrl,
  videoRef,
}: {
  manifestUrl: string;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = manifestUrl;
      void video.play().catch(() => {});
      return () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }

    let cancelled = false;
    void import('hls.js').then(({ default: HlsCtor }) => {
      if (cancelled || !videoRef.current) return;
      if (!HlsCtor.isSupported()) return;
      const hls = new HlsCtor({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(manifestUrl);
      hls.attachMedia(video);
      hls.on(HlsCtor.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => {});
      });
    });

    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute('src');
        v.load();
      }
    };
  }, [manifestUrl, videoRef]);

  return (
    <video
      ref={videoRef}
      className="academy-testimonial-modal-native"
      controls
      autoPlay
      playsInline
    />
  );
}

function LandingPublicVideoLightbox({
  payload,
  onClose,
}: {
  payload: LandingVideoOpenPayload | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang } = useLang();
  const t = getAcademyCopy(lang);

  useEffect(() => {
    if (!payload) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [payload, onClose]);

  useEffect(() => {
    if (payload) {
      document.body.style.overflow = 'hidden';
      queueMicrotask(() => closeRef.current?.focus());
    }
    return () => {
      document.body.style.overflow = '';
      videoRef.current?.pause();
    };
  }, [payload]);

  if (!payload) return null;

  const title =
    (payload.title && payload.title.trim()) ||
    (payload.kind === 'file'
      ? titleFromVideoFilename(payload.file)
      : payload.kind === 'youtube'
        ? payload.id
        : 'Video');

  return (
    <div
      className="academy-dashboard-modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="landing-public-video-modal-title"
    >
      <div className="academy-dashboard-modal-backdrop" aria-hidden="true" onClick={onClose} />
      <div className="academy-dashboard-modal-panel">
        <div
          className={
            payload.kind === 'youtube'
              ? 'academy-dashboard-modal-head academy-dashboard-modal-head--youtube-only'
              : 'academy-dashboard-modal-head'
          }
        >
          {payload.kind === 'youtube' ? (
            <span id="landing-public-video-modal-title" className="academy-visually-hidden">
              {title}
            </span>
          ) : (
            <h2 id="landing-public-video-modal-title" className="academy-dashboard-modal-title">
              {title}
            </h2>
          )}
          <button
            ref={closeRef}
            type="button"
            className="academy-dashboard-modal-close"
            onClick={onClose}
            aria-label={t.portal.dashboardModalClose}
          >
            ×
          </button>
        </div>
        <div className="academy-dashboard-modal-video">
          {payload.kind === 'youtube' ? (
            <iframe
              key={payload.id}
              className="academy-testimonial-modal-iframe"
              src={youtubeEmbedUrl(payload.id, true)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : payload.kind === 'hls' ? (
            <LandingHlsVideo key={payload.manifestUrl} videoRef={videoRef} manifestUrl={payload.manifestUrl} />
          ) : (
            <video
              ref={videoRef}
              key={publicVideoUrl(payload.file)}
              className="academy-testimonial-modal-native"
              src={publicVideoUrl(payload.file)}
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LandingTestimonialYoutubeCard({
  item,
  delayIndex,
  onOpen,
}: {
  item: (typeof LANDING_TESTIMONIAL_YOUTUBE_ITEMS)[number];
  delayIndex: number;
  onOpen: (payload: LandingVideoOpenPayload) => void;
}) {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const [posterOk, setPosterOk] = useState(true);
  const thumb = youtubePosterUrl(item.id);

  return (
    <motion.article
      className="academy-testimonial-card academy-testimonial-card--media-only"
      {...cardReveal(0.08 + delayIndex * 0.06)}
    >
      <button
        type="button"
        className="academy-testimonial-card-hit"
        onClick={() => onOpen({ kind: 'youtube', id: item.id, title: item.title })}
        aria-label={`${t.portal.moduleWatch}: ${item.title}`}
      />
      <div className="academy-testimonial-thumb">
        {posterOk ? (
          <img
            className="academy-testimonial-thumb-video"
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPosterOk(false)}
          />
        ) : null}
        <span className="academy-mini-play academy-testimonial-play-hint" aria-hidden="true">
          <PlayIcon />
        </span>
      </div>
    </motion.article>
  );
}

function FreeAccessVideoCard({
  video,
  posterSrc,
  manifestUrl,
  delayIndex,
  onOpen,
}: {
  video: { title: string; duration: string; description: string };
  posterSrc: string;
  manifestUrl: string;
  delayIndex: number;
  onOpen: (payload: LandingVideoOpenPayload) => void;
}) {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const [posterOk, setPosterOk] = useState(true);

  return (
    <motion.article className="academy-video-card" {...cardReveal(delayIndex * 0.07)}>
      <button
        type="button"
        className="academy-video-card-hit"
        onClick={() => onOpen({ kind: 'hls', manifestUrl, title: video.title })}
        aria-label={`${t.portal.moduleWatch}: ${video.title}`}
      />
      <div className="academy-video-thumb">
        <span>{t.ui.freeBadge}</span>
        {posterOk ? (
          <img
            className="academy-video-thumb-video"
            src={posterSrc}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPosterOk(false)}
          />
        ) : null}
        <div className="academy-mini-play academy-video-play-hint" aria-hidden="true">
          <PlayIcon />
        </div>
      </div>
      <div className="academy-video-body">
        <span>
          0{delayIndex + 1} / {video.duration}
        </span>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </motion.article>
  );
}

const Arrow = () => (
  <svg className="academy-arrow" viewBox="0 0 18 10" fill="none" aria-hidden="true">
    <path d="M1 5h16m0 0L13 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 18 18" aria-hidden="true">
    <path d="M4 9.4l3.1 3.1L14 5.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function AcademyLandingPage() {
  const { lang } = useLang();
  const t = getAcademyCopy(lang);
  const { authed } = useAcademyNavSession();
  const duplicatedStats = [...t.hero.stats, ...t.market.stats];
  const [landingVideoModal, setLandingVideoModal] = useState<LandingVideoOpenPayload | null>(null);

  return (
    <div className="academy-page" id="top">
      <AcademyNav t={t} />
      <LandingPublicVideoLightbox payload={landingVideoModal} onClose={() => setLandingVideoModal(null)} />

      <section className="academy-hero">
        <div className="academy-hero-glow academy-hero-glow-one" aria-hidden="true" />
        <div className="academy-hero-glow academy-hero-glow-two" aria-hidden="true" />
        <div className="academy-hero-copy">
          <motion.span
            className="academy-pill"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[t.hero.kicker, t.hero.pillSuffix].filter(Boolean).join(' / ')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            className="academy-hero-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            <strong>{t.hero.subtitle}.</strong> {t.hero.description}
          </motion.p>
          {!authed ? (
            <motion.div
              className="academy-actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              <Link className="academy-btn academy-btn-primary" to="/academy/formations">
                {t.hero.ctaPrimary}
                <Arrow />
              </Link>
              <button type="button" className="academy-btn academy-btn-ghost">
                {t.hero.ctaSecondary}
                <Arrow />
              </button>
            </motion.div>
          ) : null}
        </div>

        <motion.div
          className="academy-hero-stage"
          initial={{ opacity: 0, scale: 0.94, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <div className="academy-stage-frame">
            <div className="academy-stage-topline">
              <span>{t.hero.stageTopLeft}</span>
              <span>{t.hero.stageTopRight}</span>
            </div>
            <div className="academy-video-orb-wrap">
              <div className="academy-video-orb">
                <PlayIcon />
              </div>
            </div>
            <div className="academy-stage-copy">
              <span>{t.hero.stageCopyLine1}</span>
              <strong>{t.hero.stageCopyLine2}</strong>
            </div>
          </div>
          <motion.div className="academy-floating-card academy-floating-card-one" {...cardReveal(0.12)}>
            <span>{t.hero.floatingOneLabel}</span>
            <strong>{t.hero.floatingOneStrong}</strong>
          </motion.div>
          <motion.div className="academy-floating-card academy-floating-card-two" {...cardReveal(0.22)}>
            <span>{t.hero.floatingTwoLabel}</span>
            <strong>{t.hero.floatingTwoStrong}</strong>
          </motion.div>
        </motion.div>
      </section>

      <div className="academy-metric-ribbon" aria-label={t.ui.metricsAria}>
        <div className="academy-metric-track">
          {[...duplicatedStats, ...duplicatedStats].map((stat, i) => (
            <span key={`${stat.label}-${i}`}>
              <em>{stat.value}</em>
              {stat.label}
            </span>
          ))}
        </div>
      </div>

      <section className="academy-section academy-manifesto">
        <motion.div className="academy-section-label" {...cardReveal(0)}>
          <span>{t.ui.manifesto.num}</span>
          {t.ui.manifesto.label}
        </motion.div>
        <div className="academy-manifesto-grid">
          <motion.div className="academy-manifesto-head" {...cardReveal(0)}>
            <h2>{t.mission.title}</h2>
            <p>{t.mission.description}</p>
          </motion.div>
          <motion.div className="academy-observation-panel" {...cardReveal(0.1)}>
            <span>{t.ui.observation}</span>
            <p>{t.mission.observation}</p>
            <div className="academy-panel-line" />
            <strong>{t.mission.training}</strong>
          </motion.div>
        </div>
      </section>

      <section className="academy-section academy-human-gap">
        <div className="academy-human-visual">
          <motion.div className="academy-portrait-card" {...cardReveal(0)}>
            <div className="academy-portrait-ring" />
            <span>{t.ui.humanPortraitLine1}</span>
            <strong>{t.ui.humanPortraitLine2}</strong>
          </motion.div>
        </div>
        <motion.div className="academy-human-copy" {...cardReveal(0.08)}>
          <div className="academy-section-label">
            <span>{t.ui.humanSection.num}</span>
            {t.ui.humanSection.label}
          </div>
          <h2>{t.philosophy.title}</h2>
          <p className="academy-fact">{t.philosophy.strikingFact}</p>
          <p className="academy-insight">{t.philosophy.insight}</p>
          <div className="academy-capability-list">
            <h3>{t.philosophy.capabilitiesTitle}</h3>
            {t.philosophy.capabilities.map((capability) => (
              <div key={capability}>
                <CheckIcon />
                <span>{capability}</span>
              </div>
            ))}
          </div>
          <blockquote>{t.philosophy.quote}</blockquote>
        </motion.div>
      </section>

      <section className="academy-section academy-market">
        <motion.div className="academy-section-heading" {...cardReveal(0)}>
          <div>
            <div className="academy-section-label">
              <span>{t.ui.marketSection.num}</span>
              {t.ui.marketSection.label}
            </div>
            <h2>{t.market.title}</h2>
          </div>
          <p>{t.market.subtitle}</p>
        </motion.div>
        <div className="academy-market-grid">
          {t.market.stats.map((stat, i) => (
            <motion.article
              key={stat.label}
              className="academy-market-card"
              {...cardReveal(i * 0.07)}
            >
              <span>0{i + 1}</span>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="training" className="academy-section academy-training">
        <div className="academy-training-shell">
          <motion.div className="academy-training-copy" {...cardReveal(0)}>
            <div className="academy-section-label">
              <span>{t.ui.trainingSection.num}</span>
              {t.ui.trainingSection.label}
            </div>
            <h2>{t.masterclasses.title}</h2>
            <p>{t.masterclasses.description}</p>
            <div className="academy-access-strip">
              <span>{t.masterclasses.programTitle}</span>
              <strong>{t.masterclasses.access}</strong>
              <em>{t.masterclasses.accessDetail}</em>
            </div>
          </motion.div>
          <motion.div className="academy-training-console-wrap" {...cardReveal(0.1)}>
            <div className="academy-training-console">
              <span className="academy-console-label">{t.ui.consoleLabel}</span>
              <p>{t.masterclasses.availability}</p>
              <div className="academy-console-grid">
                {t.ui.consoleFeatures.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="academy-section academy-career">
        <motion.div className="academy-section-heading" {...cardReveal(0)}>
          <div>
            <div className="academy-section-label">
              <span>{t.ui.careerSection.num}</span>
              {t.ui.careerSection.label}
            </div>
            <h2>{t.career.title}</h2>
          </div>
          <p>{t.career.subtitle}</p>
        </motion.div>
        <div className="academy-career-grid">
          {t.career.benefits.map((benefit, i) => (
            <motion.div key={benefit.title} className="academy-career-card" {...cardReveal(i * 0.06)}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="free" className="academy-section academy-videos">
        <motion.div className="academy-section-heading" {...cardReveal(0)}>
          <div>
            <div className="academy-section-label">
              <span>{t.ui.videosSection.num}</span>
              {t.ui.videosSection.label}
            </div>
            <h2>{t.freeVideos.title}</h2>
          </div>
          <p>{t.freeVideos.description}</p>
        </motion.div>
        <div className="academy-video-grid">
          {t.freeVideos.modules.map((video, i) => {
            const stream = LANDING_FREE_HLS_ITEMS[i];
            if (!stream) {
              return (
                <motion.article
                  key={video.title}
                  className="academy-video-card academy-video-card--offline"
                  {...cardReveal(i * 0.07)}
                >
                  <div className="academy-video-thumb">
                    <span>{t.ui.freeBadge}</span>
                    <div className="academy-mini-play academy-mini-play--muted" aria-hidden="true">
                      <PlayIcon />
                    </div>
                  </div>
                  <div className="academy-video-body">
                    <span>
                      0{i + 1} / {video.duration}
                    </span>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    {!authed ? (
                      <button type="button" className="academy-btn academy-btn-primary" disabled>
                        {t.freeVideos.cta}
                      </button>
                    ) : null}
                  </div>
                </motion.article>
              );
            }
            return (
              <FreeAccessVideoCard
                key={video.title}
                video={video}
                posterSrc={stream.posterUrl}
                manifestUrl={stream.manifestUrl}
                delayIndex={i}
                onOpen={setLandingVideoModal}
              />
            );
          })}
        </div>
        <motion.div className="academy-unlock-panel" {...cardReveal(0.12)}>
          <div className="academy-unlock-copy">
            <span className="academy-unlock-kicker">{t.ui.unlockKicker}</span>
            <h3>{t.freeVideos.unlockCta}</h3>
            <p>{t.freeVideos.unlockDesc}</p>
            <div className="academy-unlock-proof" aria-label="Included with your account">
              {t.ui.unlockProof.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
          <div className="academy-unlock-actions">
            {!authed ? (
              <Link className="academy-btn academy-btn-light" to="/sign-in">
                {t.nav.logIn}
              </Link>
            ) : null}
            <Link className="academy-btn academy-btn-ghost-light" to="/academy/formations">
              {t.freeVideos.seeAll}
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="academy-section academy-skills">
        <motion.div className="academy-section-heading" {...cardReveal(0)}>
          <div>
            <div className="academy-section-label">
              <span>{t.ui.skillsSection.num}</span>
              {t.ui.skillsSection.label}
            </div>
            <h2>{t.skills.title}</h2>
          </div>
          <p>{t.skills.description}</p>
        </motion.div>
        <div className="academy-skill-grid">
          {t.skills.items.map((skill, i) => (
            <motion.div key={skill.title} className="academy-skill-card" {...cardReveal(i * 0.06)}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="academy-section academy-testimonials">
        <motion.div className="academy-section-heading" {...cardReveal(0)}>
          <div>
            <div className="academy-section-label">
              <span>{t.ui.testimonialsSection.num}</span>
              {t.ui.testimonialsSection.label}
            </div>
            <h2>{t.testimonials.title}</h2>
          </div>
          <p>{t.testimonials.subtitle}</p>
        </motion.div>
        <div className="academy-testimonial-grid">
          {LANDING_TESTIMONIAL_YOUTUBE_ITEMS.map((item, i) => (
            <LandingTestimonialYoutubeCard key={item.id} item={item} delayIndex={i} onOpen={setLandingVideoModal} />
          ))}
        </div>
      </section>

      <section className="academy-section academy-journey">
        <div className="academy-journey-ambient academy-journey-ambient-one" aria-hidden="true" />
        <div className="academy-journey-ambient academy-journey-ambient-two" aria-hidden="true" />
        <motion.div className="academy-section-heading academy-section-heading-center" {...cardReveal(0)}>
          <div>
            <div className="academy-section-label">
              <span>{t.ui.journeySection.num}</span>
              {t.ui.journeySection.label}
            </div>
            <h2>{t.howItWorks.title}</h2>
            <p>{t.howItWorks.subtitle}</p>
          </div>
        </motion.div>
        <div className="academy-journey-rail">
          <div className="academy-journey-progress" aria-hidden="true">
            <span />
          </div>
          {t.howItWorks.steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="academy-journey-step"
              {...cardReveal(i * 0.1)}
            >
              <div className="academy-journey-orb" aria-hidden="true">
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="academy-section academy-faq">
        <motion.div {...cardReveal(0)}>
          <div className="academy-section-label">
            <span>{t.ui.faqSection.num}</span>
            {t.ui.faqSection.label}
          </div>
          <h2>{t.faq.title}</h2>
          <p>{t.faq.subtitle}</p>
        </motion.div>
        <div className="academy-faq-list">
          {t.faq.questions.map((item, i) => (
            <motion.div key={item.q} className="academy-faq-item-wrap" {...cardReveal(i * 0.05)}>
              <details className="academy-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="academy-final">
        <motion.div className="academy-final-inner" {...cardReveal(0)}>
          <span className="academy-final-eyebrow">{t.finalCta.eyebrow}</span>
          <h2>{t.finalCta.title}</h2>
          <p className="academy-final-lede">{t.finalCta.subtitle}</p>
          {!authed ? (
            <div className="academy-actions academy-actions-center academy-final-actions">
              <Link className="academy-btn academy-btn-ghost-light academy-final-cta-primary" to="/academy/formations">
                {t.finalCta.ctaPrimary}
                <Arrow />
              </Link>
              <button type="button" className="academy-btn academy-btn-ghost-light academy-final-cta-secondary">
                {t.finalCta.ctaSecondary}
                <Arrow />
              </button>
            </div>
          ) : null}
        </motion.div>

        <motion.footer className="academy-final-footer" {...cardReveal(0.1)}>
          <div className="academy-final-footer-inner">
            <div className="academy-brand academy-brand-footer">
              <span className="academy-brand-mark">M</span>
              <span>METCARE<sup>®</sup></span>
            </div>
            <div className="academy-final-footer-links">
              <p>{t.ui.footerCopyright}</p>
              <div className="academy-final-legal">
                <a href="#">{t.ui.footerPrivacy}</a>
                <a href="#">{t.ui.footerTerms}</a>
                <a href="#">{t.ui.footerLegal}</a>
              </div>
            </div>
          </div>
        </motion.footer>
      </section>
    </div>
  );
}
