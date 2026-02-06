"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isNewUser?: boolean;
}

interface Prediction {
  id: string;
  date: string;
  predictedMarks: number;
  status: "Excellent" | "Average" | "Needs Improvement";
  formData: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  predictions: Prediction[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  addPrediction: (prediction: Omit<Prediction, "id">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("edupredict_user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Fetch predictions for the restored user
      fetchPredictions(parsedUser.id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchPredictions = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/get-predictions/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPredictions(data);
      } else {
        console.error("Failed to fetch predictions");
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ❌ login failed
      if (!res.ok) {
        console.error("Login failed:", data.detail || data);
        return false;
      }

      // ✅ backend se user aaya
      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isNewUser: data.user.is_new_user, // 👈 backend flag
      };

      setUser(user);
      localStorage.setItem("edupredict_user", JSON.stringify(user));

      // Fetch predictions for this user
      await fetchPredictions(user.id);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return false;
      }

      // signup successful → user set karo
      const newUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isNewUser: data.user.is_new_user,
      };

      setUser(newUser);
      localStorage.setItem("edupredict_user", JSON.stringify(newUser));

      // New user won't have predictions, so just set empty
      setPredictions([]);

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setPredictions([]);
    localStorage.removeItem("edupredict_user");
  };

  const addPrediction = async (prediction: Omit<Prediction, "id">) => {
    if (!user) return; // Should likely handle this better, but for now just guard

    // Optimistic update
    const tempId = crypto.randomUUID();
    const newPrediction = { ...prediction, id: tempId };
    setPredictions(prev => [newPrediction, ...prev]);

    try {
      const res = await fetch(`http://127.0.0.1:8000/save-prediction/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: prediction.formData,
          predictedMarks: prediction.predictedMarks,
          status: prediction.status
        }),
      });

      if (!res.ok) {
        console.error("Failed to save prediction to backend");
        // Revert optimistic update? For now getting simple.
      } else {
        const data = await res.json();
        // Update the ID with the real one from backend
        setPredictions(prev => prev.map(p => p.id === tempId ? { ...p, id: data.id } : p));
      }

    } catch (error) {
      console.error("Error saving prediction:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        predictions,
        isLoading,
        signIn,
        signUp,
        signOut,
        addPrediction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
