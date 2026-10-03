export const initialStudentData = {
  id: "BB-2026-9042",
  name: "Alex Rivera",
  email: "alex.rivera@edu.beyondbarriers.org",
  program: "Bachelor of Science in Computer Science",
  institution: "State Institute of Technology",
  semester: "4th Semester",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  // Core demo properties
  marks: 52, // 52%
  attendance: 68, // 68%
  financialNeed: "high", // 'high' | 'medium' | 'low'
  accessibility: "hearing", // 'hearing' | 'visual' | 'none'
  learningPace: "Moderate (Visual & Self-Paced)",
  careerInterest: "Software Engineer",
  learningProgress: 64, // 64%
  advisor: "Dr. Evelyn Reed (Dept. of Academic Success)",
  enrolledCourses: [
    { code: "CS201", name: "Data Structures & Algorithms", score: 48, attendance: 65, credits: 4 },
    { code: "CS204", name: "Computer Systems Architecture", score: 54, attendance: 70, credits: 3 },
    { code: "MATH210", name: "Discrete Mathematics", score: 50, attendance: 62, credits: 3 },
    { code: "ENG105", name: "Technical Communication", score: 68, attendance: 76, credits: 2 },
  ],
};

export const defaultOpportunities = [
  {
    id: "opp-1",
    type: "scholarship",
    title: "STEM Access & Equity Tech Grant",
    provider: "National Future in Tech Foundation",
    amount: "$2,500 One-time + Free Laptop",
    eligibility: "GPA < 3.0 or Marks < 65% with High Financial Need, enrolled in accredited STEM degree",
    deadline: "October 15, 2026",
    barrierTarget: "financial",
    matchReason: "Matches your High Financial Need profile and STEM enrollment",
    description: "Full device funding and tuition assistance for promising engineering students experiencing financial strain.",
    tags: ["Financial Relief", "Device Included", "Tuition Grant"]
  },
  {
    id: "opp-2",
    type: "scholarship",
    title: "Equal Horizons Higher Ed Tuition Waiver",
    provider: "State Education Opportunity Fund",
    amount: "50% Semester Tuition Waiver",
    eligibility: "Household income tier 1 / High Financial Need status verified by student passport",
    deadline: "November 01, 2026",
    barrierTarget: "financial",
    matchReason: "Matches your verified High Financial Need status",
    description: "Need-based tuition reduction designed to keep students enrolled during family income disruptions.",
    tags: ["Tuition Waiver", "Institutional", "Priority Deadline"]
  },
  {
    id: "opp-3",
    type: "course",
    title: "Foundations of Data Structures & Algorithmic Thinking",
    provider: "Interactive Coding Institute (CS Department Sponsored)",
    amount: "Free for At-Risk Students",
    eligibility: "Open to students with CS marks under 60% seeking academic recovery",
    deadline: "Rolling Enrollment - Starts Weekly",
    barrierTarget: "academic",
    matchReason: "Matches your Academic Score (52%) and Software career goals",
    description: "Self-paced visual coding exercises with bite-sized daily modules and animated memory diagrams.",
    tags: ["Visual Learning", "Self-Paced", "Certified Recovery"]
  },
  {
    id: "opp-4",
    type: "course",
    title: "Accessible Python Mastery with Closed Captions & Transcripts",
    provider: "Open Accessibility Edu Lab",
    amount: "100% Subsidized",
    eligibility: "Students with hearing accommodations or visual learning preferences",
    deadline: "Open Always",
    barrierTarget: "accessibility",
    matchReason: "Matches your Hearing Accessibility requirement with full synchronized captions",
    description: "Fully accessible curriculum featuring high-accuracy live captions, synchronized transcripts, and interactive code sandboxes.",
    tags: ["Hearing Support", "Live Captions", "Sign Video Available"]
  },
  {
    id: "opp-5",
    type: "mentor",
    title: "Senior Full-Stack Engineer Peer Mentorship",
    provider: "TechBridge Alumni Network",
    amount: "Free 1-on-1 Weekly Sessions",
    eligibility: "Undergraduates targeting Software Engineering careers facing academic or attendance hurdles",
    deadline: "Ongoing matching",
    barrierTarget: "career",
    matchReason: "Matches your Software Engineering career focus and academic reboot plan",
    description: "Get paired with a practicing engineer at a tier-1 tech firm for portfolio code reviews, study schedules, and interview prep.",
    tags: ["1-on-1 Guidance", "Career Coaching", "Weekly Check-ins"]
  },
  {
    id: "opp-6",
    type: "mentor",
    title: "Academic Accountability & Attendance Coach",
    provider: "Campus Student Retention Cell",
    amount: "Free Campus Service",
    eligibility: "Students with attendance below 75% requiring flexible scheduling support",
    deadline: "Immediate Availability",
    barrierTarget: "attendance",
    matchReason: "Matches your Attendance (68% < 75%) to help rebuild lecture rhythm",
    description: "Bi-weekly strategy sessions to optimize commute, part-time work schedules, and lecture attendance tracking.",
    tags: ["Attendance Support", "Time Management", "Campus Mentor"]
  },
];

export const mockTeachersStudentList = [
  {
    id: "STU-101",
    name: "Alex Rivera",
    email: "alex.rivera@edu.bb.org",
    marks: 52,
    attendance: 68,
    financialNeed: "High",
    accessibility: "Hearing",
    careerInterest: "Software Engineer",
    riskLevel: "High",
    detectedBarriers: ["Attendance Issue", "Academic Issue", "Financial Barrier", "Accessibility Support"],
    suggestedIntervention: "Issue Hybrid Attendance Pass, assign Peer Tutor for CS201, and dispatch Emergency Tech Aid Grant.",
    lastActive: "2 hours ago"
  },
  {
    id: "STU-102",
    name: "Marcus Vance",
    email: "m.vance@edu.bb.org",
    marks: 48,
    attendance: 62,
    financialNeed: "High",
    accessibility: "None",
    careerInterest: "Data Analyst",
    riskLevel: "High",
    detectedBarriers: ["Attendance Issue", "Academic Issue", "Financial Barrier"],
    suggestedIntervention: "Schedule urgent academic advisory meeting; provide recorded lecture access pass.",
    lastActive: "1 day ago"
  },
  {
    id: "STU-103",
    name: "Elena Rostova",
    email: "e.rostova@edu.bb.org",
    marks: 58,
    attendance: 82,
    financialNeed: "Medium",
    accessibility: "None",
    careerInterest: "Cybersecurity",
    riskLevel: "Medium",
    detectedBarriers: ["Academic Issue"],
    suggestedIntervention: "Recommend Discrete Mathematics study group and weekly office hours clinic.",
    lastActive: "30 mins ago"
  },
  {
    id: "STU-104",
    name: "Devon Brooks",
    email: "d.brooks@edu.bb.org",
    marks: 74,
    attendance: 71,
    financialNeed: "Low",
    accessibility: "None",
    careerInterest: "Cloud Architect",
    riskLevel: "Medium",
    detectedBarriers: ["Attendance Issue"],
    suggestedIntervention: "Send attendance reminder notification; verify morning commute transit conflicts.",
    lastActive: "4 hours ago"
  },
  {
    id: "STU-105",
    name: "Priya Sharma",
    email: "p.sharma@edu.bb.org",
    marks: 89,
    attendance: 94,
    financialNeed: "Low",
    accessibility: "None",
    careerInterest: "Machine Learning Researcher",
    riskLevel: "Low",
    detectedBarriers: [],
    suggestedIntervention: "No urgent interventions; nominate for Undergraduate Research Fellowship.",
    lastActive: "10 mins ago"
  },
  {
    id: "STU-106",
    name: "Liam O'Connor",
    email: "l.oconnor@edu.bb.org",
    marks: 79,
    attendance: 88,
    financialNeed: "High",
    accessibility: "Visual",
    careerInterest: "Full Stack Developer",
    riskLevel: "Medium",
    detectedBarriers: ["Financial Barrier", "Accessibility Support"],
    suggestedIntervention: "Grant screen-reader software license stipend; connect with alumni scholarship fund.",
    lastActive: "Just now"
  }
];

export const careerSkillRoadmap = {
  career: "Software Engineer",
  description: "Designs, builds, and maintains software applications and scalable systems using modern programming paradigms.",
  medianSalary: "$115,000 / yr",
  growthRate: "+25% (Much faster than average)",
  skills: [
    {
      name: "Python Programming",
      level: 60,
      targetLevel: 85,
      status: "In Progress",
      description: "Core syntax, OOP, libraries, and scripting automation.",
      recommendedAction: "Complete 'Accessible Python Mastery' lab exercises."
    },
    {
      name: "Data Structures & Algorithms",
      level: 35,
      targetLevel: 80,
      status: "Needs Support",
      description: "Arrays, Linked Lists, Trees, Graphs, Big-O analysis and recursion.",
      recommendedAction: "Review CS201 remedial modules and visual animations."
    },
    {
      name: "Machine Learning & Data Tools",
      level: 20,
      targetLevel: 70,
      status: "Beginner",
      description: "NumPy, Pandas, model evaluation and introductory neural nets.",
      recommendedAction: "Scheduled for Semester 5 after mastering Python basics."
    },
    {
      name: "Full-Stack Web Development",
      level: 70,
      targetLevel: 90,
      status: "Strong Pace",
      description: "React, REST APIs, Tailwind CSS, modern browser interfaces.",
      recommendedAction: "Build portfolio projects to demonstrate practical skills."
    }
  ],
  milestones: [
    { id: 1, title: "Resolve Active Course Deficits (Marks > 60%)", completed: false, tag: "Academic Priority" },
    { id: 2, title: "Achieve Attendance Consistency (> 75%)", completed: false, tag: "Retention Goal" },
    { id: 3, title: "Build 3 GitHub Software Projects", completed: true, tag: "Portfolio" },
    { id: 4, title: "Pair with Industry Senior Mentor", completed: false, tag: "Career Network" },
    { id: 5, title: "Apply for Summer Software Engineering Internships", completed: false, tag: "Placement" }
  ]
};
