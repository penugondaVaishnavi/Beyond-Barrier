/**
 * Rule-Based Barrier Detection Engine
 * 
 * Rules:
 * 1. Attendance < 75% -> Attendance Issue (High risk of course de-registration / missing lectures)
 * 2. Marks < 60%      -> Academic Issue (Needs targeted remedial instruction / tutoring)
 * 3. Financial Need = 'high' -> Financial Barrier (Needs tuition waivers, emergency grants, device stipends)
 * 4. Accessibility = 'hearing' -> Accessibility Support (Requires assistive captions, transcripts, interpreter support)
 */

export function detectBarriers(student) {
  const barriers = [];

  // Rule 1: Attendance Barrier
  if (student.attendance < 75) {
    barriers.push({
      id: "barrier-attendance",
      type: "attendance",
      title: "Attendance Issue",
      severity: "High",
      badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
      accentColor: "rose",
      icon: "ClockAlert",
      currentValue: `${student.attendance}%`,
      threshold: "< 75%",
      condition: "Attendance is currently below the mandatory institutional threshold of 75%.",
      impact: "At risk of attendance disbarment and missing critical seminar discussions.",
      recommendedIntervention: "Flexible attendance contract + recorded lectures pass."
    });
  }

  // Rule 2: Academic Barrier
  if (student.marks < 60) {
    barriers.push({
      id: "barrier-academic",
      type: "academic",
      title: "Academic Issue",
      severity: "High",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      accentColor: "amber",
      icon: "GraduationCap",
      currentValue: `${student.marks}%`,
      threshold: "< 60%",
      condition: "Academic cumulative score is under the 60% baseline benchmark.",
      impact: "Struggling with core algorithmic problem-solving and assignment submissions.",
      recommendedIntervention: "1-on-1 peer tutoring + bite-sized visual practice labs."
    });
  }

  // Rule 3: Financial Barrier
  if (String(student.financialNeed).toLowerCase() === "high") {
    barriers.push({
      id: "barrier-financial",
      type: "financial",
      title: "Financial Barrier",
      severity: "Medium-High",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      accentColor: "purple",
      icon: "Coins",
      currentValue: "High Need",
      threshold: "Tier 1 Household",
      condition: "Student is classified under high financial stress impacting study materials and device access.",
      impact: "High stress regarding semester fees, textbook purchases, and laptop specifications.",
      recommendedIntervention: "Institutional fee waiver + STEM equipment emergency voucher."
    });
  }

  // Rule 4: Accessibility Support Barrier
  if (String(student.accessibility).toLowerCase() === "hearing") {
    barriers.push({
      id: "barrier-accessibility",
      type: "accessibility",
      title: "Accessibility Support",
      severity: "Specialized",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      accentColor: "sky",
      icon: "Ear",
      currentValue: "Hearing Accommodation",
      threshold: "Requires Assistive Media",
      condition: "Requires specialized auditory accommodation for lecture comprehension.",
      impact: "Difficulty following standard audio-only lecture formats without synchronized transcripts.",
      recommendedIntervention: "Real-time AI captions + synchronized transcripts + front-row reservation."
    });
  } else if (String(student.accessibility).toLowerCase() === "visual") {
    barriers.push({
      id: "barrier-accessibility-visual",
      type: "accessibility",
      title: "Accessibility Support (Visual)",
      severity: "Specialized",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      accentColor: "teal",
      icon: "Eye",
      currentValue: "Visual Accommodation",
      threshold: "Screen Reader & High Contrast",
      condition: "Requires high-contrast materials and screen-reader compatible learning modules.",
      impact: "Standard textbook PDFs lack accessible tag hierarchy.",
      recommendedIntervention: "Screen reader licenses + tactile audio diagrams."
    });
  }

  return barriers;
}

/**
 * Generate Personalized Recommendations
 * Dynamically tailored to the active barriers and student profile.
 * Every recommendation includes an explicit "Why this recommendation?" explanation!
 */
export function generateRecommendations(student, activeBarriers) {
  const hasAttendanceBarrier = activeBarriers.some(b => b.type === "attendance");
  const hasAcademicBarrier = activeBarriers.some(b => b.type === "academic");
  const hasFinancialBarrier = activeBarriers.some(b => b.type === "financial");
  const hasHearingBarrier = activeBarriers.some(b => b.type === "accessibility" && String(student.accessibility).toLowerCase() === "hearing");

  const recommendations = [];

  // ==========================================
  // 1. LEARNING RESOURCES
  // ==========================================
  if (hasAcademicBarrier) {
    recommendations.push({
      id: "rec-learn-1",
      category: "Learning Resources",
      icon: "BookOpen",
      title: "CS201 Visual Algorithms Crash Lab & Guided Practice",
      provider: "University Academic Success Center",
      type: "Remedial Module",
      urgency: "High Priority",
      urgencyColor: "rose",
      actionText: "Enroll in Free Lab",
      duration: "4 Weeks • Self-Paced",
      whyExplanation: `Recommended because your current Academic Score is ${student.marks}%, which is below the 60% proficiency threshold. This targeted lab provides animated data structure visualizers and step-by-step code traces.`,
      tags: ["Data Structures", "Score Recovery", "Interactive Code"]
    });
  } else {
    // If academic is good
    recommendations.push({
      id: "rec-learn-honor",
      category: "Learning Resources",
      icon: "Sparkles",
      title: "Advanced System Design & Distributed Architecture",
      provider: "Engineering Honors Academy",
      type: "Advanced Module",
      urgency: "Enrichment",
      urgencyColor: "blue",
      actionText: "Access Courseware",
      duration: "6 Weeks • Self-Paced",
      whyExplanation: `Recommended because your Academic Score is strong at ${student.marks}%. You meet the prerequisites to accelerate directly into high-scale software architectures.`,
      tags: ["System Design", "Microservices", "Honors"]
    });
  }

  if (hasHearingBarrier) {
    recommendations.push({
      id: "rec-learn-access",
      category: "Learning Resources",
      icon: "Ear",
      title: "Synchronized Transcript & Closed-Caption Lecture Repository",
      provider: "Campus Accessibility Services",
      type: "Accessibility Tool",
      urgency: "Immediate Access",
      urgencyColor: "sky",
      actionText: "Open Transcript Portal",
      duration: "Semester-Long Pass",
      whyExplanation: `Recommended because your profile specifies Hearing Accessibility Support. This portal delivers real-time timecoded transcripts and signed lecture summaries for all your enrolled STEM classes.`,
      tags: ["Closed Captions", "Live Transcripts", "Universal Design"]
    });
  }

  if (hasAttendanceBarrier) {
    recommendations.push({
      id: "rec-learn-att",
      category: "Learning Resources",
      icon: "Video",
      title: "Asynchronous Lecture Vault & Concept Checkpoints",
      provider: "Department of Computer Science",
      type: "Attendance Recovery",
      urgency: "Essential",
      urgencyColor: "rose",
      actionText: "Request Vault Pass",
      duration: "Catch-up Mode",
      whyExplanation: `Recommended because your Attendance is currently ${student.attendance}% (trigger threshold < 75%). This asynchronous repository allows you to make up for missed seminar hours by completing verified quiz checkpoints.`,
      tags: ["Self-Paced Catch-up", "Attendance Credits", "Asynchronous"]
    });
  }

  // ==========================================
  // 2. SCHOLARSHIPS & FINANCIAL ASSISTANCE
  // ==========================================
  if (hasFinancialBarrier) {
    recommendations.push({
      id: "rec-fin-1",
      category: "Scholarships",
      icon: "Award",
      title: "STEM Equal Opportunity Tuition & Tech Assistance Grant",
      provider: "National Tech Access Coalition",
      type: "Emergency Grant",
      urgency: "Priority Deadline",
      urgencyColor: "purple",
      actionText: "Apply via Passport",
      duration: "$2,500 + Development Laptop",
      whyExplanation: `Recommended because your profile is flagged with High Financial Need while pursuing a rigorous ${student.careerInterest} degree. This covers textbook costs and provides a modern laptop for programming coursework.`,
      tags: ["Need-Based", "Tuition Waiver", "Hardware Included"]
    });

    recommendations.push({
      id: "rec-fin-2",
      category: "Scholarships",
      icon: "Wallet",
      title: "Campus Work-Study: Software Lab Peer Assistant",
      provider: "IT Infrastructure Support Dept",
      type: "Flexible Employment",
      urgency: "Flexible Hours",
      urgencyColor: "indigo",
      actionText: "Submit Interest",
      duration: "$20/hr • 10 hrs/week",
      whyExplanation: `Recommended because of your High Financial Need and Software career interest. Offers a paid campus role scheduled around your classes so attendance is not disrupted.`,
      tags: ["On-Campus", "No Commute", "Skill Building"]
    });
  } else {
    recommendations.push({
      id: "rec-fin-merit",
      category: "Scholarships",
      icon: "Award",
      title: "Dean's Innovation & Open Source Leadership Fellowship",
      provider: "University Foundation",
      type: "Merit Fellowship",
      urgency: "Open Call",
      urgencyColor: "blue",
      actionText: "Review Guidelines",
      duration: "$1,500 Project Stipend",
      whyExplanation: `Recommended to support independent open-source contributions aligned with your ${student.careerInterest} career path.`,
      tags: ["Merit-Based", "Portfolio Building"]
    });
  }

  // ==========================================
  // 3. MENTORSHIP
  // ==========================================
  if (hasAttendanceBarrier || hasAcademicBarrier) {
    recommendations.push({
      id: "rec-mentor-1",
      category: "Mentorship",
      icon: "Users",
      title: "1-on-1 Academic Accountability & Coding Coach",
      provider: "Peer Success & Tutoring Network",
      type: "Paired Mentorship",
      urgency: "Weekly Match",
      urgencyColor: "amber",
      actionText: "Schedule Intake Session",
      duration: "2 Sessions/Week • Online",
      whyExplanation: `Recommended because your Academic Score is ${student.marks}% and Attendance is ${student.attendance}%. A dedicated senior peer tutor will guide you through tricky problem sets and keep your schedule on track.`,
      tags: ["Peer Tutoring", "Accountability", "Coding Support"]
    });
  }

  recommendations.push({
    id: "rec-mentor-2",
    category: "Mentorship",
    icon: "Briefcase",
    title: "Senior Software Engineer Industry Mentor (Alumni Network)",
    provider: "Beyond Barriers Career Alliance",
    type: "Career Mentorship",
    urgency: "Bi-Weekly",
    urgencyColor: "blue",
    actionText: "Connect with Mentor",
    duration: "6-Month Cohort",
    whyExplanation: `Recommended because your target career is "${student.careerInterest}". Connecting with an industry practitioner gives you real-world code reviews, resume feedback, and interview preparation.`,
    tags: ["Tech Industry", "Portfolio Review", "Mock Interviews"]
  });

  // ==========================================
  // 4. CAREER GUIDANCE
  // ==========================================
  recommendations.push({
    id: "rec-career-1",
    category: "Career Guidance",
    icon: "Compass",
    title: "Junior Developer Portfolio & GitHub Masterclass",
    provider: "Open Source Tech Collective",
    type: "Interactive Workshop",
    urgency: "Next Session: Saturday",
    urgencyColor: "blue",
    actionText: "Reserve Seat",
    duration: "2 Hours • Live & Recorded",
    whyExplanation: `Recommended because your career aspiration is "${student.careerInterest}". Demonstrating project repositories on GitHub helps offset lower GPA and showcases your practical building abilities.`,
    tags: ["GitHub", "Project Showcase", "Recruiter Tips"]
  });

  if (hasAcademicBarrier) {
    recommendations.push({
      id: "rec-career-2",
      category: "Career Guidance",
      icon: "TrendingUp",
      title: "Academic Grade Recovery to Internship Roadmap",
      provider: "Dean of Career Advising",
      type: "Advisory Strategy",
      urgency: "Recommended",
      urgencyColor: "amber",
      actionText: "Book 15-min Advisor Call",
      duration: "1-on-1 Counseling",
      whyExplanation: `Recommended because raising your marks from ${student.marks}% to above 60% unlocks tier-1 summer tech internship applications.`,
      tags: ["Internship Eligibility", "Grade Strategy"]
    });
  }

  return recommendations;
}
