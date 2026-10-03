import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_AUTH_USER_KEY = 'bb_auth_user';
const STORAGE_JWT_KEY = 'bb_jwt_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Sync with MongoDB backend profile on startup if logged in
  useEffect(() => {
    async function syncBackendProfile() {
      const token = localStorage.getItem('token') || localStorage.getItem(STORAGE_JWT_KEY);
      if (token) {
        try {
          const freshProfile = await api.getProfileMe();
          if (freshProfile) {
            const authUser = {
              ...freshProfile,
              role: freshProfile.role,
              id: freshProfile.studentId || freshProfile.teacherId || freshProfile.rollNumber || freshProfile._id,
              token
            };
            setUser(authUser);
            localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(authUser));
          }
        } catch (e) {
          // Token expired or server unreachable
        }
      }
    }
    syncBackendProfile();
  }, []);

  // 1. Backend Login with JWT
  const loginUser = async ({ role, id, password }) => {
    try {
      const response = await api.login({ role, id, password });
      const authUser = {
        ...response.user,
        role: response.user.role || role,
        id: response.user.studentId || response.user.teacherId || response.user.rollNumber || id,
        token: response.token
      };

      setUser(authUser);
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(authUser));
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem(STORAGE_JWT_KEY, response.token);
      }

      return {
        success: true,
        user: authUser
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'User not found. Please sign up first'
      };
    }
  };

  // 2. Backend Signup with JWT
  const registerUser = async ({ role, id, name, password }) => {
    try {
      const response = await api.signup({ role, id, name, password });
      const authUser = {
        ...response.user,
        role: response.user.role || role,
        id: response.user.studentId || response.user.teacherId || response.user.rollNumber || id,
        token: response.token
      };

      setUser(authUser);
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(authUser));
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem(STORAGE_JWT_KEY, response.token);
      }

      return {
        success: true,
        user: authUser
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Registration failed'
      };
    }
  };

  // 3. Update Profile in MongoDB Backend
  const markProfileCompleted = async (profileDetails = {}) => {
    try {
      const targetId = profileDetails.studentId || profileDetails.teacherId || profileDetails.id || user?.studentId || user?.teacherId || user?.id;
      const payload = {
        ...user,
        ...profileDetails,
        id: targetId,
        profileCompleted: true
      };

      const res = await api.updateProfile(payload);
      const updatedUser = {
        ...user,
        ...(res.user || {}),
        profileCompleted: true
      };

      setUser(updatedUser);
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem('profileCompleted', 'true');
      return updatedUser;
    } catch (err) {
      console.error('Failed to sync profile to backend:', err);
      // Local fallback
      const updatedUser = { ...user, ...profileDetails, profileCompleted: true };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  // Backwards compatible login helper
  const login = async (role, name, email, extraData = {}) => {
    const id = extraData.id || extraData.rollNumber || extraData.teacherId || (role === 'student' ? 'STU-101' : 'FAC-809');
    const password = extraData.password || (role === 'student' ? 'student123' : 'faculty123');

    try {
      const res = await loginUser({ role, id, password });
      if (res.success) return res.user;
    } catch (e) {}

    const fallbackUser = {
      role,
      id,
      name,
      email,
      ...extraData,
      profileCompleted: extraData.profileCompleted !== undefined ? extraData.profileCompleted : true
    };
    setUser(fallbackUser);
    localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(fallbackUser));
    return fallbackUser;
  };

  const updateUser = async (extraData) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...extraData };
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await api.updateProfile({
        id: user?.studentId || user?.teacherId || user?.id,
        ...extraData
      });
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem(STORAGE_AUTH_USER_KEY);
      localStorage.removeItem(STORAGE_JWT_KEY);
      localStorage.removeItem('bb_student_profile');
      localStorage.removeItem('bb_teacher_profile');
      localStorage.removeItem('profileCompleted');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginUser,
        registerUser,
        markProfileCompleted,
        updateUser,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

