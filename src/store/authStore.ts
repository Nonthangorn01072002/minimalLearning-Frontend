import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId?: string;
  username?: string;
  exp?: number;
}

interface AuthState {
  token: string | null;
  username: string | null;
  userId: string | null;
  setAuth: (token: string, username: string) => void;
  clearAuth: () => void;
  loadAuthFromStorage: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  username: null,
  userId: null,
  setAuth: (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch {
      decoded = null;
    }

    if (decoded?.userId) {
      localStorage.setItem("userId", decoded.userId);
    } else {
      localStorage.removeItem("userId");
    }
    set({ token, username, userId: decoded?.userId || null });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    set({ token: null, username: null, userId: null });
  },
  loadAuthFromStorage: () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    if (token && username && userId) {
      set({ token, username, userId });
    } else {
      set({ token: null, username: null, userId: null });
    }
  },
}));

export default useAuthStore;
