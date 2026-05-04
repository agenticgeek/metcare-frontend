import type { Lang } from '../langContext';

export type AcademyCopy = {
  nav: {
    training: string;
    freeVideos: string;
    faq: string;
    logIn: string;
    brandAria: string;
  };
  hero: {
    kicker: string;
    pillSuffix: string;
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { label: string; value: string }[];
    stageTopLeft: string;
    stageTopRight: string;
    stageCopyLine1: string;
    stageCopyLine2: string;
    floatingOneLabel: string;
    floatingOneStrong: string;
    floatingTwoLabel: string;
    floatingTwoStrong: string;
  };
  ui: {
    metricsAria: string;
    manifesto: { num: string; label: string };
    observation: string;
    humanPortraitLine1: string;
    humanPortraitLine2: string;
    humanSection: { num: string; label: string };
    marketSection: { num: string; label: string };
    trainingSection: { num: string; label: string };
    consoleLabel: string;
    consoleFeatures: string[];
    careerSection: { num: string; label: string };
    videosSection: { num: string; label: string };
    freeBadge: string;
    unlockKicker: string;
    unlockProof: string[];
    skillsSection: { num: string; label: string };
    testimonialsSection: { num: string; label: string };
    testimonialTag: string;
    journeySection: { num: string; label: string };
    faqSection: { num: string; label: string };
    finalKicker: string;
    footerCopyright: string;
    footerPrivacy: string;
    footerTerms: string;
    footerLegal: string;
  };
  mission: {
    title: string;
    description: string;
    observation: string;
    training: string;
  };
  philosophy: {
    title: string;
    strikingFact: string;
    insight: string;
    capabilitiesTitle: string;
    capabilities: string[];
    quote: string;
  };
  market: {
    title: string;
    subtitle: string;
    stats: { label: string; value: string }[];
  };
  masterclasses: {
    title: string;
    description: string;
    programTitle: string;
    access: string;
    accessDetail: string;
    availability: string;
  };
  career: {
    title: string;
    subtitle: string;
    benefits: { title: string; description: string }[];
  };
  freeVideos: {
    title: string;
    description: string;
    modules: { title: string; duration: string; description: string }[];
    cta: string;
    unlockCta: string;
    unlockDesc: string;
    seeAll: string;
  };
  skills: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  faq: {
    title: string;
    subtitle: string;
    questions: { q: string; a: string }[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  formationsPage: {
    title: string;
    lead1: string;
    lead2: string;
    cardTitle: string;
    cardBody: string;
    cardCta: string;
    howTitle: string;
    howSteps: { title: string; body: string }[];
    howCtaPrimary: string;
    howLearnMore: string;
    leadMagnetTitle: string;
    leadMagnetBody: string;
    leadMagnetCta: string;
  };
  auth: {
    loginKicker: string;
    loginTitle: string;
    loginLead: string;
    email: string;
    password: string;
    forgotPassword: string;
    submitLogin: string;
  };
  portal: {
    loading: string;
    submitting: string;
    backToSite: string;
    showPassword: string;
    hidePassword: string;
    forgotPasswordTitle: string;
    forgotPasswordLead: string;
    forgotSubmit: string;
    forgotSuccess: string;
    forgotBackSignIn: string;
    resetPasswordTitle: string;
    resetPasswordSubmit: string;
    activateTitle: string;
    activateSubmit: string;
    confirmPassword: string;
    newPassword: string;
    tokenMissing: string;
    tokenInvalid: string;
    tokenUsed: string;
    tokenExpired: string;
    passwordsMismatch: string;
    passwordTooShort: string;
    pleaseFillAll: string;
    dashboardWelcome: string;
    dashboardModules: string;
    dashboardEmpty: string;
    dashboardLogout: string;
    dashboardLoadError: string;
    moduleWatch: string;
    modulePrev: string;
    moduleBackToModules: string;
    moduleNext: string;
    moduleOpenError: string;
    moduleList: string;
    moduleSidebarTitle: string;
    studentArea: string;
    signInGeneric: string;
    durationLabel: string;
    dashboardModalClose: string;
    dashboardOpenFullPlayer: string;
    dashboardTopVideos: string;
    dashboardPaginationPrev: string;
    dashboardPaginationNext: string;
    /** Use {{current}} and {{total}} placeholders. */
    dashboardPaginationPage: string;
    dashboardPaginationAria: string;
  };
};

const EN: AcademyCopy = {
  nav: {
    training: 'Training',
    freeVideos: 'Free videos',
    faq: 'FAQ',
    logIn: 'Log in',
    brandAria: 'MET Academy home'
  },
  hero: {
    kicker: 'MET Academy',
    pillSuffix: 'international patient journey',
    title: 'Develop your practice, at your own pace',
    subtitle: 'An immersion into the heart of the patient journey',
    description:
      'Become an expert in post-operative care with METCARE® and join a network of over 1,300 certified professionals who are transforming the journey of thousands of patients every day in plastic, reconstructive and reparative surgery.',
    ctaPrimary: 'Discover our online classes',
    ctaSecondary: 'Download the guide',
    stats: [
      { label: 'certified experts', value: '+ 1,300' },
      { label: 'partner surgeons', value: '2,500' },
      { label: 'member countries', value: '27' }
    ],
    stageTopLeft: 'MET Academy',
    stageTopRight: 'Protocol 01',
    stageCopyLine1: 'Discover the METCARE universe',
    stageCopyLine2: '+ 1,300 professionals trained',
    floatingOneLabel: 'Care',
    floatingOneStrong: 'Precision + kindness',
    floatingTwoLabel: 'Access',
    floatingTwoStrong: '3 months / 24-7'
  },
  ui: {
    metricsAria: 'Academy metrics',
    manifesto: { num: '01', label: 'Mission signal' },
    observation: 'Observation',
    humanPortraitLine1: 'Human sensitivity',
    humanPortraitLine2: 'Listening before technique',
    humanSection: { num: '02', label: 'Necessary profession' },
    marketSection: { num: '03', label: 'Global market' },
    trainingSection: { num: '04', label: 'Academy command center' },
    consoleLabel: 'Upcoming release',
    consoleFeatures: ['Video modules', 'Resources', 'Mobile access', 'Certification'],
    careerSection: { num: '05', label: 'Career architecture' },
    videosSection: { num: '06', label: 'Free access studio' },
    freeBadge: 'Free',
    unlockKicker: 'Free module access',
    unlockProof: ['Track progress', 'Free previews', 'Certificate path'],
    skillsSection: { num: '07', label: 'Capability matrix' },
    testimonialsSection: { num: '08', label: 'Experience wall' },
    testimonialTag: 'MET CARE',
    journeySection: { num: '09', label: 'Journey' },
    faqSection: { num: '10', label: 'Questions' },
    finalKicker: 'MET Academy / international authority',
    footerCopyright: '© 2026 MET Academy. Developed with artistic soul and precision.',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms & Conditions',
    footerLegal: 'Legal Notice'
  },
  mission: {
    title: 'Each year, we support more than 8,000 transformations.',
    description:
      'Our mission is simple: to train the next generation of pre- and post-operative experts, capable of supporting, securing and transforming the patient journey in cosmetic surgery.',
    observation:
      'The observation remains the same: there is a lack of trained, humane professionals capable of securing each step of the surgical process.',
    training:
      'MET Academy trains pre- and post-operative experts through recognized professional programs, accessible online and at your own pace.'
  },
  philosophy: {
    title: 'This profession exists out of necessity, not because of a trend.',
    strikingFact:
      'In cosmetic surgery, one fact is striking: 90% of those operated on are women... but 90% of surgeons are men, who themselves have never had surgery.',
    insight:
      'Between the two, there is a lack of space for listening, understanding, emotion, and human sensitivity.',
    capabilitiesTitle: 'We train professionals capable of:',
    capabilities: [
      'Reassuring patients',
      'Accompanying them',
      'Understanding fears and vulnerabilities',
      'Explaining transformations',
      'Intervening on the body with precision and kindness'
    ],
    quote: 'This profession is not just about aesthetics. It is profoundly human.'
  },
  market: {
    title: 'A rapidly growing international market',
    subtitle: 'All these patients need competent experts trained in pre- and post-operative care.',
    stats: [
      { label: 'Daily procedures in France', value: '+1,300' },
      { label: 'Interventions per year', value: '500K+' },
      { label: 'Market in 2025 (×3 in 10 years)', value: '€17 bn' }
    ]
  },
  masterclasses: {
    title: 'Discover our Masterclasses',
    description:
      'Online courses specifically designed to provide you with in-depth and unique expertise in pre- and post-operative care, accessible wherever you are and at your own pace.',
    programTitle: 'A 100% online, flexible and interactive training program',
    access: '3 months of 24/7 access',
    accessDetail: 'Unlimited access to video modules and resources, on computer and mobile.',
    availability: 'The training courses will be available soon.'
  },
  career: {
    title: 'Unveil your career',
    subtitle:
      'Give meaning back to your practice, rediscover the human element at the heart of your profession and flourish in a path that combines care, expertise and well-being.',
    benefits: [
      {
        title: 'Powerful professional network',
        description: 'Work hand in hand with internationally recognized HD plastic surgeons.'
      },
      {
        title: 'Passion rediscovered',
        description: 'Rediscover your passion for your profession in a caring environment that respects your well-being.'
      },
      {
        title: 'Exceptional support',
        description: 'Provide exceptional human and technical support throughout the pre- and post-operative process.'
      },
      {
        title: 'Certificate of completion',
        description: 'Obtain an official certificate of completion and an initiation certificate.'
      }
    ]
  },
  freeVideos: {
    title: 'Free videos',
    description:
      'Discover our free access modules. A free preview to familiarize yourself with our teaching approach and the METCARE® universe.',
    modules: [
      {
        title: 'Introduction to post-operative care',
        duration: '15 min',
        description: 'Discover the essential basics and best practices for supporting your patients.'
      },
      {
        title: 'Lymphatic drainage techniques',
        duration: '12 min',
        description: 'Learn the fundamental techniques of lymphatic drainage and their post-surgical benefits.'
      },
      {
        title: 'Cosmetic repair: the basics',
        duration: '18 min',
        description: 'Introduction to cosmetic repair techniques and professional camouflage.'
      }
    ],
    cta: 'Watch for free',
    unlockCta: 'Sign in to unlock your free modules',
    unlockDesc:
      'Access all of our training courses, track your progress and obtain your MET completion certificate.',
    seeAll: 'See all training courses'
  },
  skills: {
    title: 'What you will be able to do',
    description: 'Develop your skills with recognized professional techniques in the post-operative field.',
    items: [
      {
        title: 'Post-operative care',
        description: 'Master the care protocols, scar management and personalized support for your patients.'
      },
      {
        title: 'Lymphatic drainage',
        description: 'Advanced manual lymphatic drainage techniques to optimize recovery and reduce edema.'
      },
      {
        title: 'Cosmetic repair',
        description: 'Camouflage techniques and aesthetic repair to restore your patients’ confidence.'
      }
    ]
  },
  howItWorks: {
    title: 'How it works',
    subtitle: 'A simple and structured course to develop your post-operative care skills.',
    steps: [
      {
        title: 'Receive your access',
        description:
          'Your administrator creates your MET Academy account. Activate it from your email, then sign in.'
      },
      {
        title: 'Follow the modules',
        description: 'Learn at your own pace with our video modules and track your progress in real time.'
      },
      {
        title: 'Receive your diploma',
        description: 'Obtain your MET completion certificate as soon as you finish your training to enhance your expertise.'
      }
    ]
  },
  testimonials: {
    title: 'They share their experience with you',
    subtitle: 'Discover the feedback from our trained professionals and their experience with MET Academy.'
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our training programs',
    questions: [
      {
        q: 'How do I access the training courses?',
        a: 'Your administrator enables your access. Sign in and open the training area from your dashboard once modules are live.'
      },
      { q: 'Are there any prerequisites?', a: 'Our programs are designed for healthcare and allied professionals involved in peri-operative care.' },
      { q: 'How long does a training course last?', a: 'You get flexible access—typically several months—with progress you control.' },
      { q: 'How does payment work?', a: 'Secure checkout options will be available at launch; details follow when enrollment opens.' },
      { q: 'Is the certificate of attendance recognized?', a: 'You receive an official MET completion certificate; recognition depends on your local regulations.' }
    ]
  },
  finalCta: {
    eyebrow: 'Immediate availability',
    title: 'Become a leading authority in your region!',
    subtitle:
      'Seize the opportunity to stand out with My Esthetic Travel®. In a rapidly growing market where demand exceeds supply, our expertise opens the doors to a promising professional future.',
    ctaPrimary: 'Discover our online classes',
    ctaSecondary: 'Make an appointment'
  },
  formationsPage: {
    title: 'MET Academy trainings',
    lead1: 'A curated selection of professional post-operative and restorative programmes.',
    lead2: 'Online access, at your own pace. Exclusive MET Academy training.',
    cardTitle: 'Trainings are coming soon.',
    cardBody: 'When your administrator has enabled your access, sign in to enter the student area.',
    cardCta: 'Sign in',
    howTitle: 'How does it work?',
    howSteps: [
      {
        title: 'Receive your access',
        body: 'Your organisation provisions your account; use the activation email you receive.'
      },
      {
        title: 'Choose a training',
        body: 'Guided video modules and validation quizzes.'
      },
      {
        title: 'Obtain your MET follow-up certificate',
        body: 'Show your expertise to your patients with confidence.'
      }
    ],
    howCtaPrimary: 'Sign in',
    howLearnMore: 'Learn more',
    leadMagnetTitle: 'Still unsure?',
    leadMagnetBody: 'Discover the MET method in a glance with our free guide.',
    leadMagnetCta: 'Download the free guide'
  },
  auth: {
    loginKicker: 'Secure access',
    loginTitle: 'Log in',
    loginLead: 'Access your MET Academy account.',
    email: 'E-mail',
    password: 'Password',
    forgotPassword: 'Forgot your password?',
    submitLogin: 'Log in'
  },
  portal: {
    loading: 'Loading…',
    submitting: 'Please wait…',
    backToSite: 'Back to MET Academy',
    showPassword: 'Show',
    hidePassword: 'Hide',
    forgotPasswordTitle: 'Forgot password',
    forgotPasswordLead: 'Enter your email. If an account exists, you will receive a reset link.',
    forgotSubmit: 'Send reset link',
    forgotSuccess:
      'If an account exists with this email, you will receive a reset link shortly.',
    forgotBackSignIn: 'Back to sign in',
    resetPasswordTitle: 'New password',
    resetPasswordSubmit: 'Reset my password',
    activateTitle: 'Activate your account',
    activateSubmit: 'Activate my account',
    confirmPassword: 'Confirm password',
    newPassword: 'New password',
    tokenMissing: 'This link is invalid or incomplete.',
    tokenInvalid: 'This link is invalid.',
    tokenUsed: 'This link has already been used. Sign in directly.',
    tokenExpired: 'This link has expired — contact your administrator.',
    passwordsMismatch: 'Passwords do not match.',
    passwordTooShort: 'Password must be at least 8 characters.',
    pleaseFillAll: 'Please fill in all fields.',
    dashboardWelcome: 'Welcome, {{name}}',
    dashboardModules: 'Modules',
    dashboardEmpty: 'Modules will be available soon.',
    dashboardLogout: 'Log out',
    dashboardLoadError: 'Unable to load modules. Try signing in again.',
    moduleWatch: 'Watch',
    modulePrev: 'Previous module',
    moduleBackToModules: 'Back to modules',
    moduleNext: 'Next module',
    moduleOpenError: 'This module is not available.',
    moduleList: 'All modules',
    moduleSidebarTitle: 'Modules',
    studentArea: 'Student area',
    signInGeneric: 'Unable to sign in. Please try again.',
    durationLabel: 'Duration',
    dashboardModalClose: 'Close',
    dashboardOpenFullPlayer: 'Open full player',
    dashboardTopVideos: 'Start here — top picks',
    dashboardPaginationPrev: 'Previous',
    dashboardPaginationNext: 'Next',
    dashboardPaginationPage: 'Page {{current}} of {{total}}',
    dashboardPaginationAria: 'Module list pages'
  }
};

const FR: AcademyCopy = {
  nav: {
    training: 'Formations',
    freeVideos: 'Vidéos gratuites',
    faq: 'FAQ',
    logIn: 'Se connecter',
    brandAria: 'Accueil MET Academy'
  },
  hero: {
    kicker: 'La référence internationale en formation pré & post-opératoire',
    pillSuffix: '',
    title: 'Faites évoluer votre pratique, à votre rythme',
    subtitle: 'Une immersion au cœur du parcours patient',
    description:
      "Devenez expert(e) du soin post-opératoire avec METCARE® et rejoignez un réseau de +1 300 professionnels certifiés qui transforment chaque jour le parcours de milliers de patients en chirurgie plastique, réparatrice et reconstructrice.",
    ctaPrimary: 'Découvrir nos classes en ligne',
    ctaSecondary: 'Télécharger le guide',
    stats: [
      { label: 'experts certifiés', value: '+ 1 300' },
      { label: 'chirurgiens partenaires', value: '2 500' },
      { label: 'pays membres', value: '27' }
    ],
    stageTopLeft: 'MET Academy',
    stageTopRight: 'Protocole 01',
    stageCopyLine1: "Découvrez l'univers METCARE",
    stageCopyLine2: '+ 1 300 experts certifiés',
    floatingOneLabel: 'Soins',
    floatingOneStrong: 'Précision + bienveillance',
    floatingTwoLabel: 'Accès',
    floatingTwoStrong: '3 mois / 24h-24'
  },
  ui: {
    metricsAria: 'Indicateurs MET Academy',
    manifesto: { num: '01', label: 'Notre mission' },
    observation: 'Le constat',
    humanPortraitLine1: 'Sensibilité humaine',
    humanPortraitLine2: "Écouter avant la technique",
    humanSection: { num: '02', label: 'Un métier nécessaire' },
    marketSection: { num: '03', label: 'Marché international' },
    trainingSection: { num: '04', label: 'Espace formations' },
    consoleLabel: 'Bientôt disponible',
    consoleFeatures: ['Modules vidéo', 'Ressources', 'Accès mobile', 'Certification'],
    careerSection: { num: '05', label: 'Votre carrière' },
    videosSection: { num: '06', label: 'Accès gratuits' },
    freeBadge: 'Gratuit',
    unlockKicker: 'Modules gratuits',
    unlockProof: ['Suivi de progression', 'Aperçus gratuits', 'Parcours attestation'],
    skillsSection: { num: '07', label: 'Compétences' },
    testimonialsSection: { num: '08', label: 'Témoignages' },
    testimonialTag: 'MET CARE',
    journeySection: { num: '09', label: 'Parcours' },
    faqSection: { num: '10', label: 'Questions' },
    finalKicker: 'MET Academy / référence internationale',
    footerCopyright: '© 2026 My Esthetic Travel — MET Academy',
    footerPrivacy: 'Politique de confidentialité',
    footerTerms: 'Conditions générales',
    footerLegal: 'Mentions légales'
  },
  mission: {
    title: 'Chaque année, nous accompagnons plus de 8 000 transformations.',
    description:
      "Notre mission est simple : former les prochaines générations d'experts du pré & post-opératoire, capables d'accompagner, sécuriser et transformer le parcours des patients en chirurgie esthétique.",
    observation:
      "Le constat est toujours le même : il manque de professionnel(le)s formé(e)s, humain(e)s et capables de sécuriser chaque étape du parcours opératoire.",
    training:
      "MET Academy forme les expert(e)s du pré et post-opératoire grâce à des programmes professionnalisants reconnus, accessibles en ligne et à votre rythme."
  },
  philosophy: {
    title: 'Ce métier existe par nécessité, pas par tendance.',
    strikingFact:
      "Dans la chirurgie esthétique, un fait frappe : 90 % des personnes opérées sont des femmes… mais 90 % des chirurgiens sont des hommes, eux-mêmes jamais opérés.",
    insight:
      "Entre les deux, il manque un espace d'écoute, de compréhension, d'émotion, de sensibilité humaine.",
    capabilitiesTitle: 'Nous formons des professionnel(le)s capables de :',
    capabilities: [
      'Rassurer',
      'Accompagner',
      'Comprendre les peurs et les vulnérabilités',
      'Expliquer les transformations',
      'Intervenir sur le corps avec précision et bienveillance'
    ],
    quote: "Ce métier n'est pas seulement esthétique. Il est profondément humain."
  },
  market: {
    title: 'Un marché international en pleine croissance',
    subtitle:
      'Tous ces patients ont besoin d’experts compétents formés aux soins pré et post-opératoires',
    stats: [
      { label: 'Actes quotidiens en France', value: '+1 300' },
      { label: 'Interventions par an', value: '500K+' },
      { label: 'Marché en 2025 (×3 en 10 ans)', value: '17 Mds €' }
    ]
  },
  masterclasses: {
    title: 'Découvrez nos Masterclass',
    description:
      "Des formations en ligne spécialement conçues pour vous transmettre une expertise approfondie et unique dans les soins pré et post-opératoires, accessibles où que vous soyez et à votre rythme.",
    programTitle: 'Une formation 100 % en ligne, flexible et interactive',
    access: "3 mois d'accès 24h/24",
    accessDetail: 'Accès illimité aux modules vidéo et ressources, sur ordinateur et mobile.',
    availability: 'Les formations seront bientôt disponibles.'
  },
  career: {
    title: 'Révélez votre carrière',
    subtitle:
      "Redonnez du sens à votre pratique, retrouvez l'humain au cœur de votre métier et épanouissez-vous dans une voie qui allie soin, expertise et bien-être.",
    benefits: [
      {
        title: 'Réseau professionnel puissant',
        description:
          'Travaillez main dans la main avec des chirurgiens plasticiens HD reconnus internationalement.'
      },
      {
        title: 'Passion retrouvée',
        description:
          'Retrouvez la passion pour votre métier dans un environnement bienveillant et respectueux de votre bien-être.'
      },
      {
        title: 'Accompagnement exceptionnel',
        description:
          'Offrez un soutien humain et technique exceptionnel dans le parcours pré et post-opératoire.'
      },
      {
        title: 'Attestation de suivi',
        description: 'Obtenez une attestation de suivi officielle et une certification initiatique.'
      }
    ]
  },
  freeVideos: {
    title: 'Vidéos gratuites',
    description:
      "Découvrez nos modules en accès libre. Un aperçu offert pour vous familiariser avec notre approche pédagogique et l'univers METCARE®.",
    modules: [
      {
        title: 'Introduction aux soins post‑opératoires',
        duration: '15 min',
        description:
          'Découvrez les bases essentielles et les bonnes pratiques pour accompagner vos patientes.'
      },
      {
        title: 'Techniques de drainage lymphatique',
        duration: '12 min',
        description:
          'Apprenez les gestes fondamentaux du drainage lymphatique et leurs bienfaits post‑chirurgicaux.'
      },
      {
        title: 'Réparation esthétique : les bases',
        duration: '18 min',
        description: 'Introduction aux techniques de réparation esthétique et camouflage professionnel.'
      }
    ],
    cta: 'Regarder gratuitement',
    unlockCta: 'Connectez-vous pour débloquer vos modules gratuits',
    unlockDesc:
      "Accédez à l'intégralité de nos formations, suivez votre progression et obtenez votre attestation de suivi MET.",
    seeAll: 'Voir toutes les formations'
  },
  skills: {
    title: 'Ce que vous saurez faire',
    description:
      'Développez vos compétences avec des techniques professionnelles reconnues dans le domaine post‑opératoire.',
    items: [
      {
        title: 'Soins post‑opératoires',
        description:
          'Maîtrisez les protocoles de soins, la gestion des cicatrices et l’accompagnement personnalisé de vos patientes.'
      },
      {
        title: 'Drainage lymphatique',
        description:
          'Techniques avancées de drainage lymphatique manuel pour optimiser la récupération et réduire les œdèmes.'
      },
      {
        title: 'Réparation esthétique',
        description:
          'Techniques de camouflage et réparation esthétique pour restaurer la confiance de vos patientes.'
      }
    ]
  },
  howItWorks: {
    title: 'Comment ça marche',
    subtitle: 'Un parcours simple et structuré pour développer vos compétences en soins post‑opératoires.',
    steps: [
      {
        title: 'Recevoir votre accès',
        description:
          'Votre administrateur crée votre compte MET Academy. Activez-le depuis votre e-mail, puis connectez-vous.'
      },
      {
        title: 'Suivre les modules',
        description: 'Apprenez à votre rythme avec nos modules vidéo et suivez votre progression en temps réel.'
      },
      {
        title: 'Recevoir votre diplôme',
        description:
          "Obtenez votre attestation de suivi MET dès la fin de votre formation pour valoriser votre expertise."
      }
    ]
  },
  testimonials: {
    title: 'Elles vous partagent leur expérience',
    subtitle: 'Découvrez les retours de nos professionnelles formées et leur expérience avec MET Academy.'
  },
  faq: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que vous devez savoir sur nos formations',
    questions: [
      {
        q: 'Comment accéder aux formations ?',
        a: 'Votre administrateur active votre accès. Connectez-vous et ouvrez l’espace formations dès l’ouverture des modules.'
      },
      {
        q: 'Y a‑t‑il des prérequis ?',
        a: 'Les parcours s’adressent aux professionnels de santé et aux métiers du soin en lien avec le pré et post-opératoire.'
      },
      {
        q: 'Combien de temps dure une formation ?',
        a: 'Un accès flexible sur plusieurs mois, avec une progression que vous pilotez à votre rythme.'
      },
      {
        q: 'Comment se passe le paiement ?',
        a: 'Des moyens de paiement sécurisés seront proposés à l’ouverture des inscriptions.'
      },
      {
        q: 'L’attestation de suivi est‑elle reconnue ?',
        a: 'Vous recevez une attestation de suivi MET ; la reconnaissance dépend du cadre réglementaire de votre pays.'
      }
    ]
  },
  finalCta: {
    eyebrow: 'Disponibilité immédiate',
    title: 'Devenez une référence incontournable dans votre région !',
    subtitle:
      "Saisissez l'opportunité de vous démarquer avec My Esthetic Travel®. Dans un marché en pleine croissance où la demande dépasse l'offre, notre expertise vous ouvre les portes d'un avenir professionnel prometteur.",
    ctaPrimary: 'Découvrir nos classes en ligne',
    ctaSecondary: 'Prendre rendez-vous'
  },
  formationsPage: {
    title: 'Formations MET Academy',
    lead1: 'Sélection de formations professionnelles post-opératoires et réparatrices.',
    lead2: 'Accès en ligne, à votre rythme. Formation exclusive MET Academy.',
    cardTitle: 'Les formations arrivent prochainement.',
    cardBody: 'Lorsque votre administrateur a activé votre accès, connectez-vous pour entrer dans l’espace étudiant.',
    cardCta: 'Se connecter',
    howTitle: 'Comment ça marche ?',
    howSteps: [
      {
        title: 'Recevoir votre accès',
        body: 'Votre organisation crée votre compte ; utilisez l’e-mail d’activation que vous recevez.'
      },
      {
        title: 'Choisissez une formation',
        body: 'Modules vidéo guidés, quiz de validation.'
      },
      {
        title: 'Obtenez votre attestation de suivi MET',
        body: 'Valorisez vos compétences auprès des patientes.'
      }
    ],
    howCtaPrimary: 'Se connecter',
    howLearnMore: 'En savoir plus',
    leadMagnetTitle: 'Vous hésitez encore ?',
    leadMagnetBody: "Découvrez la méthode MET en un clin d'œil grâce à notre guide gratuit.",
    leadMagnetCta: 'Télécharger le guide gratuit'
  },
  auth: {
    loginKicker: 'Accès sécurisé',
    loginTitle: 'Se connecter',
    loginLead: 'Accédez à votre compte MET Academy.',
    email: 'E-mail',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    submitLogin: 'Se connecter'
  },
  portal: {
    loading: 'Chargement…',
    submitting: 'Veuillez patienter…',
    backToSite: 'Retour à MET Academy',
    showPassword: 'Afficher',
    hidePassword: 'Masquer',
    forgotPasswordTitle: 'Mot de passe oublié',
    forgotPasswordLead:
      'Indiquez votre e-mail. Si un compte existe, vous recevrez un lien de réinitialisation.',
    forgotSubmit: 'Envoyer le lien',
    forgotSuccess:
      'Si un compte existe avec cet e-mail, vous recevrez un lien de réinitialisation sous peu.',
    forgotBackSignIn: 'Retour à la connexion',
    resetPasswordTitle: 'Nouveau mot de passe',
    resetPasswordSubmit: 'Réinitialiser mon mot de passe',
    activateTitle: 'Activez votre compte',
    activateSubmit: 'Activer mon compte',
    confirmPassword: 'Confirmer le mot de passe',
    newPassword: 'Nouveau mot de passe',
    tokenMissing: 'Ce lien est invalide ou incomplet.',
    tokenInvalid: 'Ce lien est invalide.',
    tokenUsed: 'Ce lien a déjà été utilisé. Connectez-vous directement.',
    tokenExpired: 'Ce lien a expiré — contactez votre administrateur.',
    passwordsMismatch: 'Les mots de passe ne correspondent pas.',
    passwordTooShort: 'Votre mot de passe doit contenir au moins 8 caractères.',
    pleaseFillAll: 'Veuillez remplir tous les champs.',
    dashboardWelcome: 'Bienvenue, {{name}}',
    dashboardModules: 'Modules',
    dashboardEmpty: 'Les modules seront disponibles prochainement.',
    dashboardLogout: 'Déconnexion',
    dashboardLoadError: 'Impossible de charger les modules. Reconnectez-vous.',
    moduleWatch: 'Regarder',
    modulePrev: 'Module précédent',
    moduleBackToModules: 'Retour aux modules',
    moduleNext: 'Module suivant',
    moduleOpenError: 'Ce module n’est pas disponible.',
    moduleList: 'Tous les modules',
    moduleSidebarTitle: 'Modules',
    studentArea: 'Espace étudiant',
    signInGeneric: 'Connexion impossible. Réessayez.',
    durationLabel: 'Durée',
    dashboardModalClose: 'Fermer',
    dashboardOpenFullPlayer: 'Ouvrir le lecteur complet',
    dashboardTopVideos: 'À voir en premier',
    dashboardPaginationPrev: 'Précédent',
    dashboardPaginationNext: 'Suivant',
    dashboardPaginationPage: 'Page {{current}} sur {{total}}',
    dashboardPaginationAria: 'Pagination des modules'
  }
};

export function academyLangKey(lang: Lang): 'fr' | 'en' {
  return lang === 'fr' ? 'fr' : 'en';
}

export function getAcademyCopy(lang: Lang): AcademyCopy {
  return academyLangKey(lang) === 'fr' ? FR : EN;
}

/** @deprecated Use getAcademyCopy(lang) for localized copy */
export const ACADEMY_COPY = EN;
