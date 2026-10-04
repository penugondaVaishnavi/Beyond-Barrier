const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : 'https://beyond-barrier.onrender.com/api';

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('token') || localStorage.getItem('bb_jwt_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async signup({ role, id, name, password }) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, id, name, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    if (data.token) {
      localStorage.setItem('bb_jwt_token', data.token);
    }
    return data;
  },

  async login({ role, id, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, id, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('bb_jwt_token', data.token);
    }
    return data;
  },

  // Profile Management
  async getProfileMe() {
    const res = await fetch(`${API_BASE}/profile/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch current user profile');
    }
    return data;
  },

  async getProfile(id) {
    const res = await fetch(`${API_BASE}/profile/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  async updateProfileEndpoint(profileData) {
    const res = await fetch(`${API_BASE}/profile/update`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  // Teacher Action: Intervention
  async postIntervention(studentId, action, message) {
    const res = await fetch(`${API_BASE}/intervention`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        studentId, 
        action: action || 'Provide Support',
        type: action || 'Academic Support',
        message: message || ''
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Intervention failed');
    }
    return data;
  },

  // Student Roster
  async getStudents() {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch students');
    }
    return data;
  },

  // Teacher Selection & Assignment
  async getTeachers() {
    const res = await fetch(`${API_BASE}/teachers`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch teachers');
    }
    return data;
  },

  async assignTeacher(teacherId, studentId) {
    const res = await fetch(`${API_BASE}/assign-teacher`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ teacherId, studentId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to assign teacher');
    }
    return data;
  },

  async getTeacherStudents(teacherId) {
    const url = teacherId 
      ? `${API_BASE}/teacher/students?teacherId=${encodeURIComponent(teacherId)}`
      : `${API_BASE}/teacher/students`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch teacher assigned students');
    }
    return data;
  },

  // Student Intervention History
  async getStudentInterventions(studentId) {
    const res = await fetch(`${API_BASE}/intervention/student/${encodeURIComponent(studentId)}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch intervention history');
    }
    return data;
  },

  // Notifications API
  async getNotifications(userId) {
    const url = userId
      ? `${API_BASE}/notifications?userId=${encodeURIComponent(userId)}`
      : `${API_BASE}/notifications`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch notifications');
    }
    return data;
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return await res.json();
  },

  async markAllNotificationsRead(userId) {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    return await res.json();
  },

  // ML-Powered Study Plan API
  async getStudyPlan(studentId, weeklyHours = 16) {
    const url = `${API_BASE}/study-plan/${encodeURIComponent(studentId)}?weeklyHours=${weeklyHours}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch ML study plan');
    }
    return data;
  },

  async generateMLStudyPlan(studentId, weeklyAvailableHours = 16, studentData = null) {
    const url = `${API_BASE}/study-plan/predict`;
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ studentId, weeklyAvailableHours, studentData })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to generate ML study plan');
    }
    return data;
  },

  async getStudyPlanHealth() {
    const res = await fetch(`${API_BASE}/study-plan/health`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await res.json();
  }
};

