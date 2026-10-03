import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, AlertCircle, Building2, User, BookOpen, Clock, Award, Check } from "lucide-react";
import BASE_URL from "../api";

const COLLEGE_LIST = [
  "Prasad V Potluri Siddhartha Institute of Technology",
  "IIT Delhi",
  "IIT Bombay",
  "NIT Trichy",
  "VIT Vellore",
  "SRM University",
  "JNTU Hyderabad",
  "Andhra University"
];

const BRANCH_LIST = [
  "Computer Science",
  "Information Technology",
  "Electronics and Communication",
  "Mechanical Engineering",
  "Civil Engineering"
];

// Institutional Benchmark Simulation Matrix
const CAMPUS_BENCHMARKS = {
  "Prasad V Potluri Siddhartha Institute of Technology": {
    attendance: 76,
    marks: 68,
    cgpa: 7.8,
    city: "Vijayawada",
    skills: "DSA, Java, Python, Algorithms"
  },
  "IIT Delhi": {
    attendance: 88,
    marks: 82,
    cgpa: 8.9,
    city: "New Delhi",
    skills: "Algorithms, Machine Learning, C++, Distributed Systems"
  },
  "IIT Bombay": {
    attendance: 90,
    marks: 85,
    cgpa: 9.1,
    city: "Mumbai",
    skills: "Python, Deep Learning, React, System Design"
  },
  "NIT Trichy": {
    attendance: 82,
    marks: 74,
    cgpa: 8.2,
    city: "Tiruchirappalli",
    skills: "Java, Spring Boot, Data Structures, SQL"
  },
  "VIT Vellore": {
    attendance: 78,
    marks: 70,
    cgpa: 7.9,
    city: "Vellore",
    skills: "HTML, CSS, React, JavaScript"
  },
  "SRM University": {
    attendance: 75,
    marks: 65,
    cgpa: 7.5,
    city: "Chennai",
    skills: "Python, Aptitude, Reasoning, Web Development"
  },
  "JNTU Hyderabad": {
    attendance: 74,
    marks: 62,
    cgpa: 7.3,
    city: "Hyderabad",
    skills: "Java, Core CS, Aptitude, Communication"
  },
  "Andhra University": {
    attendance: 72,
    marks: 59,
    cgpa: 7.1,
    city: "Visakhapatnam",
    skills: "C Programming, Reasoning, English"
  }
};

const StudentProfileForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    college: "Prasad V Potluri Siddhartha Institute of Technology",
    branch: "Computer Science",
    city: "",
    assignedTeacherId: "FAC-809",
    attendance: "",
    marks: "",
    cgpa: "",
    skills: "",
    accessibilityType: "none"
  });

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(true);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'info' | 'error' }

  // Calculate dynamic Profile Completion Percentage
  const calculateCompletion = () => {
    let score = 0;
    if (formData.name && formData.name.trim().length > 1) score += 15;
    if (formData.college) score += 15;
    if (formData.branch) score += 15;
    if (formData.skills && String(formData.skills).trim().length > 2) score += 15;
    if (formData.city && formData.city.trim().length > 1) score += 10;
    if (formData.attendance !== "" && formData.attendance !== undefined) score += 10;
    if (formData.marks !== "" && formData.marks !== undefined) score += 10;
    if (formData.cgpa !== "" && formData.cgpa !== undefined) score += 10;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();

  // Fetch available faculty teachers and pre-fill existing profile
  useEffect(() => {
    const initializeData = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("bb_jwt_token");

        // 1. Fetch teachers list
        try {
          const teachersRes = await fetch(`${BASE_URL}/teachers`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          if (teachersRes.ok) {
            const teachersData = await teachersRes.json();
            if (Array.isArray(teachersData)) {
              setTeachers(teachersData);
            }
          }
        } catch (tErr) {
          console.warn("Could not fetch teachers list:", tErr);
        }

        if (!token) {
          setFetchingExisting(false);
          return;
        }

        // 2. Fetch existing profile
        const response = await fetch(`${BASE_URL}/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData(prev => ({
              ...prev,
              name: data.name || "",
              college: data.college || "Prasad V Potluri Siddhartha Institute of Technology",
              branch: data.branch || "Computer Science",
              city: data.city || "",
              assignedTeacherId: data.assignedTeacherId || "FAC-809",
              attendance: data.attendance !== undefined ? data.attendance : "",
              marks: data.marks !== undefined ? data.marks : "",
              cgpa: data.cgpa !== undefined ? data.cgpa : "",
              skills: Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || ""),
              accessibilityType: data.accessibilityType || data.accessibility || "none"
            }));
          }
        }
      } catch (err) {
        console.warn("Could not prefill profile:", err);
      } finally {
        setFetchingExisting(false);
      }
    };

    initializeData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🎯 Auto Data Simulation when selecting college
  const handleCollegeChange = (e) => {
    const selectedCol = e.target.value;
    const benchmark = CAMPUS_BENCHMARKS[selectedCol];

    if (benchmark) {
      setFormData(prev => ({
        ...prev,
        college: selectedCol,
        city: prev.city || benchmark.city,
        attendance: prev.attendance === "" ? benchmark.attendance : prev.attendance,
        marks: prev.marks === "" ? benchmark.marks : prev.marks,
        cgpa: prev.cgpa === "" ? benchmark.cgpa : prev.cgpa,
        skills: prev.skills === "" ? benchmark.skills : prev.skills
      }));

      setToast({
        type: "info",
        message: `Institutional benchmarks loaded for ${selectedCol} 🏛️`
      });
      setTimeout(() => setToast(null), 3000);
    } else {
      setFormData(prev => ({ ...prev, college: selectedCol }));
    }
  };

  // Manual Trigger: Auto-fill Campus Benchmarks
  const handleSimulateCampusData = () => {
    const benchmark = CAMPUS_BENCHMARKS[formData.college] || CAMPUS_BENCHMARKS["Prasad V Potluri Siddhartha Institute of Technology"];
    setFormData(prev => ({
      ...prev,
      city: benchmark.city,
      attendance: benchmark.attendance,
      marks: benchmark.marks,
      cgpa: benchmark.cgpa,
      skills: benchmark.skills
    }));

    setToast({
      type: "info",
      message: `Simulated realistic campus dataset for ${formData.college} ⚡`
    });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔥 HANDLE SUBMIT: POST /api/profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check: name, college, branch, skills
    if (!formData.name.trim()) {
      setToast({ type: "error", message: "Please provide your Full Name." });
      return;
    }
    if (!formData.college) {
      setToast({ type: "error", message: "Please select your College." });
      return;
    }
    if (!formData.branch) {
      setToast({ type: "error", message: "Please select your Branch." });
      return;
    }
    if (!formData.skills || String(formData.skills).trim().length === 0) {
      setToast({ type: "error", message: "Please enter at least one skill to generate career pathways." });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("bb_jwt_token");

      if (!token) {
        setToast({ type: "error", message: "Session expired. Please log in again." });
        navigate("/login");
        return;
      }

      // Convert skills comma-separated string to clean array
      const skillsArray = typeof formData.skills === "string"
        ? formData.skills.split(",").map(s => s.trim()).filter(Boolean)
        : (Array.isArray(formData.skills) ? formData.skills : []);

      const payload = {
        name: formData.name.trim(),
        college: formData.college,
        branch: formData.branch,
        city: formData.city.trim(),
        assignedTeacherId: formData.assignedTeacherId || "FAC-809",
        attendance: formData.attendance !== "" ? Number(formData.attendance) : 68,
        marks: formData.marks !== "" ? Number(formData.marks) : 54,
        cgpa: formData.cgpa !== "" ? Number(formData.cgpa) : 7.4,
        skills: skillsArray,
        accessibility: formData.accessibilityType || "none",
        accessibilityType: formData.accessibilityType || "none"
      };

      const response = await fetch(`${BASE_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // Also call assign-teacher endpoint
      try {
        await fetch(`${BASE_URL}/assign-teacher`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ teacherId: formData.assignedTeacherId || "FAC-809" })
        });
      } catch (assignErr) {
        console.warn("Assign teacher notification:", assignErr);
      }

      const result = await response.json();

      if (response.ok) {
        // Store updated profile in localStorage
        if (result.user) {
          localStorage.setItem("bb_student_profile", JSON.stringify(result.user));
          localStorage.setItem("profileCompleted", "true");
        }

        setToast({
          type: "success",
          message: "Profile saved successfully! Redirecting to your Dashboard... 🚀"
        });

        setTimeout(() => {
          navigate("/student");
        }, 1200);
      } else {
        setToast({
          type: "error",
          message: result.message || "Failed to save profile. Please check inputs."
        });
      }
    } catch (error) {
      console.error("Submit profile error:", error);
      setToast({
        type: "error",
        message: "Server error connecting to MongoDB backend. Please check connection."
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-card border border-slate-200">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Loading your student profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6">
      
      {/* Floating Animated Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold ${
            toast.type === "success" 
              ? "bg-emerald-600 text-white border-emerald-700" 
              : toast.type === "error"
                ? "bg-rose-600 text-white border-rose-700"
                : "bg-indigo-600 text-white border-indigo-700"
          }`}>
            {toast.type === "success" && <Check className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <Sparkles className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-card border border-slate-200/90 p-6 sm:p-9">
        
        {/* Header Section */}
        <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Onboarding & Student Profile Setup
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Personalized Student Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete required fields to unlock intelligent barrier detection and dynamic career roadmaps.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulateCampusData}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
            title="Auto-fill institutional benchmark data"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Auto-fill Benchmarks</span>
          </button>
        </div>

        {/* 1. Profile Completion Status Meter */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              Profile Completion Status
            </span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              completionPct < 50
                ? "bg-rose-100 text-rose-800"
                : completionPct < 85
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
            }`}>
              {completionPct}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                completionPct < 50
                  ? "bg-rose-500"
                  : completionPct < 85
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${completionPct}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Required: <span className="font-bold text-slate-800">Full Name, College, Branch, Skills</span>. Remaining fields personalize your mentorship tracking.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>

          {/* College Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                College / Institution <span className="text-rose-600">*</span>
              </label>
              <span className="text-[10px] text-indigo-600 font-bold">
                Auto-simulates campus metrics
              </span>
            </div>
            <select
              name="college"
              value={formData.college}
              onChange={handleCollegeChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white cursor-pointer"
            >
              {COLLEGE_LIST.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Branch / Department <span className="text-rose-600">*</span>
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white cursor-pointer"
            >
              {BRANCH_LIST.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Vijayawada, Hyderabad, Delhi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>

          {/* Select Teacher Dropdown (Dynamic Teacher Assignment) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              👨‍🏫 Select Teacher / Mentor <span className="text-rose-600">*</span>
            </label>
            <select
              name="assignedTeacherId"
              value={formData.assignedTeacherId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white cursor-pointer"
            >
              {teachers.length === 0 ? (
                <option value="FAC-809">Dr. Evelyn Reed — Computer Science (FAC-809)</option>
              ) : (
                teachers.map((t) => (
                  <option key={t.teacherId} value={t.teacherId}>
                    {t.name} — {t.department} ({t.teacherId})
                  </option>
                ))
              )}
            </select>
            <small className="text-[11px] text-slate-500 mt-1 block">
              Your profile and future support interventions will be routed to this mentor.
            </small>
          </div>

          {/* Accessibility Accommodation Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Accessibility Accommodation Need</span>
              <span className="text-[10px] text-slate-400 font-normal">Assistive Technology</span>
            </label>
            <select
              name="accessibilityType"
              value={formData.accessibilityType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white cursor-pointer"
            >
              <option value="none">⚪ None (Standard Instruction)</option>
              <option value="visual">🔵 Visual Impairment (Screen Reader & High Contrast Support)</option>
              <option value="hearing">🔵 Hearing Impairment (Activates Synchronized Captions & Transcripts)</option>
            </select>
            <small className="text-[11px] text-slate-500 mt-1 block">
              Configures accessibility accommodation preferences for personalized learning support.
            </small>
          </div>

          {/* Metrics Grid: Attendance, Marks, CGPA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Attendance (%)
              </label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={handleChange}
                placeholder="e.g. 76"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Academic Score (%)
              </label>
              <input
                type="number"
                name="marks"
                min="0"
                max="100"
                value={formData.marks}
                onChange={handleChange}
                placeholder="e.g. 68"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cumulative CGPA
              </label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 7.8"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>
          </div>

          {/* Skills (Comma Separated) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Skills (comma separated) <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="skills"
              required
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. DSA, Python, Java, React, Machine Learning"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
            <small className="text-[11px] text-slate-500 mt-1 block">
              Used by the dynamic career engine: e.g. DSA triggers Software Engineer, React triggers Frontend.
            </small>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-5 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Persisting Profile to Database...</span>
                </>
              ) : (
                <span>Save Student Profile & Generate Dashboard 🚀</span>
              )}
            </button>
          </div>

          {/* Cancel */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => navigate("/student")}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default StudentProfileForm;
