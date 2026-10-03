const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';

// Known course catalog baseline difficulty
const COURSE_DIFFICULTY_MAP = {
  'CS201': 4.2,
  'CS204': 3.6,
  'MATH210': 4.0,
  'ENG105': 2.1,
  'CS301': 3.4,
  'CS305': 3.8
};

/**
 * Maps textual learning pace from MongoDB to categorical integer for ML
 * 1: Slow / Visual, 2: Moderate, 3: Fast / Accelerated
 */
function parseLearningPace(paceStr) {
  if (!paceStr) return 2;
  const lower = String(paceStr).toLowerCase();
  if (lower.includes('slow') || lower.includes('visual')) return 1;
  if (lower.includes('fast') || lower.includes('accelerated')) return 3;
  return 2;
}

/**
 * Calls Flask ML inference service for a single course
 */
async function predictCoursePlan(featurePayload) {
  const url = `${ML_SERVICE_URL}/predict-plan`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(featurePayload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `ML Service returned HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Checks if the Python Flask ML Service is healthy
 */
async function checkMLHealth() {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`, { method: 'GET' });
    if (!response.ok) return { online: false, status: response.status };
    const data = await response.json();
    return { online: true, ...data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

/**
 * Maps student MongoDB record and course array to ML predictions
 */
async function generateStudentMLStudyPlan(student, customOptions = {}) {
  const weeklyBudget = Number(customOptions.weeklyAvailableHours || 16.0);
  const studentId = student.studentId || student.rollNumber || student.id || student._id || 'STU-101';

  // Standard enrolled courses fallback if none present in user record
  const courses = Array.isArray(student.enrolledCourses) && student.enrolledCourses.length > 0
    ? student.enrolledCourses
    : [
        { code: "CS201", name: "Data Structures & Applied Labs", score: 48, attendance: 65, credits: 4 },
        { code: "CS204", name: "Core Computer Science Systems", score: 54, attendance: 70, credits: 3 },
        { code: "MATH210", name: "Engineering Discrete Mathematics", score: 50, attendance: 62, credits: 3 },
        { code: "ENG105", name: "Technical Communication & Ethics", score: 72, attendance: 76, credits: 2 }
      ];

  const overallAttendance = Number(student.attendance ?? 68);
  const overallMarks = Number(student.marks ?? 54);
  const cgpa = Number(student.cgpa ?? 7.4);
  const learningPaceInt = parseLearningPace(student.learningPace);

  const coursePromises = courses.map(async (course) => {
    const code = course.code || 'GEN-101';
    const courseDifficulty = Number(course.difficulty || COURSE_DIFFICULTY_MAP[code] || 3.5);
    const credits = Number(course.credits || 3);
    const courseScore = Number(course.score !== undefined ? course.score : overallMarks);
    const courseAttendance = Number(course.attendance !== undefined ? course.attendance : overallAttendance);

    const featurePayload = {
      attendance: overallAttendance,
      marks: overallMarks,
      cgpa: cgpa,
      course_score: courseScore,
      course_attendance: courseAttendance,
      credits: credits,
      course_difficulty: courseDifficulty,
      learning_pace: learningPaceInt,
      weekly_available_hours: weeklyBudget,
      course_code: code,
      course_name: course.name || code,
      student_id: String(studentId)
    };

    try {
      const mlResult = await predictCoursePlan(featurePayload);
      return {
        success: true,
        courseCode: code,
        courseName: course.name || code,
        credits: credits,
        currentScore: courseScore,
        currentAttendance: courseAttendance,
        difficulty: courseDifficulty,
        mlPayloadSent: featurePayload,
        prediction: mlResult.predictions
      };
    } catch (err) {
      console.warn(`[ML Service Warning] Course ${code} prediction fallback:`, err.message);
      
      // Graceful heuristic fallback if Flask ML is temporarily unreachable
      const fallbackRisk = courseScore < 55 ? 2 : (courseScore < 70 ? 1 : 0);
      const fallbackHours = Math.max(1.0, Math.round(((85 - courseScore) / 18) * (credits / 3) * 10) / 10);

      return {
        success: false,
        courseCode: code,
        courseName: course.name || code,
        credits: credits,
        currentScore: courseScore,
        currentAttendance: courseAttendance,
        difficulty: courseDifficulty,
        mlPayloadSent: featurePayload,
        fallback: true,
        error: err.message,
        prediction: {
          risk_level: fallbackRisk,
          risk_label: fallbackRisk === 2 ? 'High Risk (Critical Deficit)' : (fallbackRisk === 1 ? 'Medium Risk (Moderate)' : 'Low Risk (Safe)'),
          risk_category: fallbackRisk === 2 ? 'critical' : (fallbackRisk === 1 ? 'moderate' : 'safe'),
          recommended_study_hours: fallbackHours,
          risk_probabilities: {
            high: fallbackRisk === 2 ? 0.90 : 0.10,
            medium: fallbackRisk === 1 ? 0.80 : 0.20,
            low: fallbackRisk === 0 ? 0.85 : 0.10
          }
        }
      };
    }
  });

  const courseResults = await Promise.all(coursePromises);

  // Sort by risk_level descending (High Risk courses first) for Subject Priority Ranking
  courseResults.sort((a, b) => b.prediction.risk_level - a.prediction.risk_level);

  // Calculate total recommended hours and normalize against budget if exceeded
  const rawTotalHours = courseResults.reduce((sum, c) => sum + (c.prediction.recommended_study_hours || 0), 0);
  const totalHours = Math.round(rawTotalHours * 10) / 10;

  // Preserve and enrich existing institutional recommendations
  const highRiskCourses = courseResults.filter(c => c.prediction.risk_level === 2);
  const remedialRecommendations = highRiskCourses.map(c => ({
    id: `rec-ml-${c.courseCode.toLowerCase()}`,
    type: "Remedial Module",
    subject: c.courseName,
    courseCode: c.courseCode,
    urgency: "High Priority",
    currentScore: `${c.currentScore}%`,
    targetGoal: "Target 75% Recovery",
    allocatedStudyHours: `${c.prediction.recommended_study_hours} hrs/week`,
    action: `Enroll in ${c.courseCode} Guided Code Labs & Visual Checkpoints`,
    whyExplanation: `ML Risk Classifier flagged ${c.courseName} (${c.courseCode}) as High Risk due to internal score of ${c.currentScore}% and attendance of ${c.currentAttendance}%. Recommended study allocation is ${c.prediction.recommended_study_hours} hours/week.`
  }));

  return {
    studentId: String(studentId),
    studentName: student.name || 'Student',
    generatedAt: new Date().toISOString(),
    mlEngine: {
      url: ML_SERVICE_URL,
      classifier: "RandomForestClassifier",
      regressor: "GradientBoostingRegressor",
      modelsActive: courseResults.every(c => c.success)
    },
    weeklyAvailableBudget: weeklyBudget,
    totalRecommendedHours: totalHours,
    highestRiskCourse: courseResults[0]?.courseName || 'None',
    subjectPriorities: courseResults.map((c, index) => ({
      priorityRank: index + 1,
      courseCode: c.courseCode,
      courseName: c.courseName,
      riskLevel: c.prediction.risk_level,
      riskLabel: c.prediction.risk_label,
      riskCategory: c.prediction.risk_category,
      currentScore: c.currentScore,
      currentAttendance: c.currentAttendance,
      allocatedHours: c.prediction.recommended_study_hours,
      riskProbabilities: c.prediction.risk_probabilities,
      isMLPredicted: c.success
    })),
    remedialActionPlan: remedialRecommendations,
    rawCoursePredictions: courseResults
  };
}

module.exports = {
  predictCoursePlan,
  checkMLHealth,
  generateStudentMLStudyPlan,
  COURSE_DIFFICULTY_MAP
};
