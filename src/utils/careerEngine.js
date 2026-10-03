// Dynamic Career Path Knowledge Engine based on student skills

export const CAREER_MAPPING_RULES = [
  {
    id: "career-swe",
    role: "Software Engineer Path",
    matchedTrigger: ["DSA", "Java", "Algorithms", "Data Structures"],
    icon: "💻",
    badge: "High Demand",
    color: "from-blue-600 to-indigo-700",
    lightColor: "bg-blue-50 border-blue-200 text-blue-800",
    description: "Architect scalable software systems, design efficient data structures, and build enterprise-grade applications.",
    requiredSkills: ["DSA", "Java", "Data Structures", "Algorithms", "System Design", "Git"],
    learningPath: "Learn Java & DSA Fundamentals → Solve LeetCode Problems → Build Full-Stack Systems → System Design & Mock Interviews",
    resources: [
      { name: "TakeUForward Striver A2Z DSA Playlist", platform: "YouTube", link: "https://www.youtube.com/c/takeUforward" },
      { name: "Kunal Kushwaha Java + DSA Masterclass", platform: "YouTube", link: "https://www.youtube.com/c/KunalKushwaha" },
      { name: "Abdul Bari Algorithms & Data Structures", platform: "YouTube", link: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O" },
      { name: "LeetCode Top Interview 150", platform: "LeetCode", link: "https://leetcode.com/studyplan/top-interview-150/" }
    ]
  },
  {
    id: "career-ds",
    role: "Data Scientist Path",
    matchedTrigger: ["Python", "ML", "Machine Learning", "Data Science", "Deep Learning", "AI"],
    icon: "🤖",
    badge: "Frontier AI",
    color: "from-emerald-600 to-teal-800",
    lightColor: "bg-emerald-50 border-emerald-200 text-emerald-900",
    description: "Build predictive models, master machine learning algorithms, and develop data pipelines using modern Python frameworks.",
    requiredSkills: ["Python", "ML", "Machine Learning", "Pandas", "Scikit-Learn", "Deep Learning"],
    learningPath: "Python Programming & Math → Data Analysis with Pandas/NumPy → Supervised & Unsupervised ML → Deep Learning & Model Deployment",
    resources: [
      { name: "StatQuest with Josh Starmer - Machine Learning", platform: "YouTube", link: "https://www.youtube.com/c/joshstarmer" },
      { name: "Krish Naik Complete Machine Learning Playlist", platform: "YouTube", link: "https://www.youtube.com/user/krishnaik06" },
      { name: "freeCodeCamp Python for Data Science & ML", platform: "YouTube", link: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
      { name: "Andrew Ng Machine Learning Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/machine-learning-introduction" }
    ]
  },
  {
    id: "career-frontend",
    role: "Frontend Developer Path",
    matchedTrigger: ["HTML", "CSS", "React", "JavaScript", "Web Development"],
    icon: "🎨",
    badge: "UI / UX Engineering",
    color: "from-sky-600 to-blue-700",
    lightColor: "bg-sky-50 border-sky-200 text-sky-900",
    description: "Design reactive, accessible web applications with modern component architectures and micro-animations.",
    requiredSkills: ["HTML", "CSS", "React", "JavaScript", "Tailwind CSS", "Redux / State Management"],
    learningPath: "HTML5 & Modern CSS3 → Modern ES6+ JavaScript → React.js Architecture & Hooks → State Management & Real-world Projects",
    resources: [
      { name: "Akshay Saini - Namaste JavaScript", platform: "YouTube", link: "https://www.youtube.com/c/AkshayMarch7" },
      { name: "Traversy Media React Crash Course", platform: "YouTube", link: "https://www.youtube.com/c/TraversyMedia" },
      { name: "freeCodeCamp Responsive Web Design Full Course", platform: "YouTube", link: "https://www.youtube.com/watch?v=mU6anWqZJcc" },
      { name: "React Official Interactive Docs", platform: "React.dev", link: "https://react.dev" }
    ]
  },
  {
    id: "career-backend",
    role: "Backend Developer Path",
    matchedTrigger: ["Node.js", "Express", "Spring Boot", "SQL", "MongoDB"],
    icon: "⚙️",
    badge: "Core Architecture",
    color: "from-purple-600 to-indigo-800",
    lightColor: "bg-purple-50 border-purple-200 text-purple-900",
    description: "Build high-throughput RESTful microservices, optimize database queries, and secure distributed backend systems.",
    requiredSkills: ["Node.js / Java", "Express / Spring Boot", "REST APIs", "SQL / NoSQL", "Docker", "Authentication"],
    learningPath: "Language Fundamentals → REST API Development → Database Modeling → Authentication & Docker → Cloud Deployment",
    resources: [
      { name: "Telusko Java & Spring Boot Course", platform: "YouTube", link: "https://www.youtube.com/c/Telusko" },
      { name: "Traversy Media Node.js & Express API Guide", platform: "YouTube", link: "https://www.youtube.com/c/TraversyMedia" },
      { name: "Hussein Nasser Backend Engineering Masterclass", platform: "YouTube", link: "https://www.youtube.com/c/HusseinNasser-software-engineering" }
    ]
  },
  {
    id: "career-placement-track",
    role: "Campus Recruitment & Aptitude Track",
    matchedTrigger: ["Aptitude", "Reasoning", "Logical Reasoning", "Quantitative Aptitude"],
    icon: "🎯",
    badge: "Campus Recruitment",
    color: "from-rose-600 to-pink-700",
    lightColor: "bg-rose-50 border-rose-200 text-rose-900",
    description: "Master quantitative shortcuts, logical patterns, and company-specific assessment rounds for top-tier campus drives.",
    requiredSkills: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation", "Speed Math"],
    learningPath: "Arithmetic & Number Systems → Logical Puzzles & Series → Verbal Reasoning → Timed Company Mock Tests",
    resources: [
      { name: "Feel Free to Learn Aptitude Tricks", platform: "YouTube", link: "https://www.youtube.com/c/FeelFreetoLearn" },
      { name: "Dear Sir Aptitude & Speed Math Masterclass", platform: "YouTube", link: "https://www.youtube.com/c/DearSir1" },
      { name: "IndiaBix Placement Prep", platform: "IndiaBix", link: "https://www.indiabix.com/" }
    ]
  }
];

// Dynamically generate matched career paths based on student skills array
export function getDynamicCareerPaths(studentSkills = []) {
  if (!Array.isArray(studentSkills) || studentSkills.length === 0) {
    // If no skills yet, provide foundational starter paths
    return [
      CAREER_MAPPING_RULES[0], // Software Engineer Path
      CAREER_MAPPING_RULES[2]  // Frontend Developer Path
    ];
  }

  const normalizedSkills = studentSkills.map(s => String(s).trim().toLowerCase());

  const matchedCareers = CAREER_MAPPING_RULES.filter(rule => {
    return rule.matchedTrigger.some(trigger => {
      const lowerTrigger = trigger.toLowerCase();
      return normalizedSkills.some(skill => 
        skill === lowerTrigger || 
        skill.includes(lowerTrigger) || 
        lowerTrigger.includes(skill)
      );
    });
  });

  // If specific matches found, return them. Otherwise return core foundation
  if (matchedCareers.length > 0) {
    return matchedCareers;
  }

  return [
    CAREER_MAPPING_RULES[0], // Software Engineer Path
    CAREER_MAPPING_RULES[2]  // Frontend Developer Path
  ];
}
