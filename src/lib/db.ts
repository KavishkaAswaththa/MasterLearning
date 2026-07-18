import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc
} from "firebase/firestore";
import { Quiz, sampleQuizzes } from "@/data/quizzes";

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface QuizSubmission {
  name: string;
  email: string;
  quizId: string;
  subject: string;
  score: string;
  date: string;
  status: string;
}

// Default Seeded Users (protected)
export const SEEDED_USERS: Record<string, UserProfile> = {
  "admin@masterlearning.com": { email: "admin@masterlearning.com", name: "Administrator", role: "admin", password: "password123" },
  "teacher@masterlearning.com": { email: "teacher@masterlearning.com", name: "Professor Davis", role: "teacher", password: "password123" },
  "student@masterlearning.com": { email: "student@masterlearning.com", name: "Kavishka Aswaththa", role: "student", password: "password123" },
};

// 1. REGISTER USER
export async function registerUser(profile: UserProfile): Promise<boolean> {
  // First, try Firestore
  try {
    const userDocRef = doc(db, "users", profile.email.toLowerCase());
    await setDoc(userDocRef, {
      name: profile.name,
      email: profile.email.toLowerCase(),
      role: profile.role,
      password: profile.password
    });
    console.log("User successfully saved to Firestore");
  } catch (err) {
    console.warn("Firestore registration failed, falling back to localStorage:", err);
  }

  // Always write to localStorage too (as double-backup / fallback)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    const list: UserProfile[] = stored ? JSON.parse(stored) : [];
    // Prevent duplicate emails in localStorage fallback list
    const filtered = list.filter(u => u.email.toLowerCase() !== profile.email.toLowerCase());
    filtered.push(profile);
    localStorage.setItem("registered_users", JSON.stringify(filtered));
  }
  return true;
}

// 2. AUTHENTICATE USER
export async function authenticateUser(email: string, password: string): Promise<UserProfile | null> {
  const normEmail = email.toLowerCase().trim();

  // A. Check Seed Users
  if (SEEDED_USERS[normEmail] && SEEDED_USERS[normEmail].password === password) {
    const rest = { ...SEEDED_USERS[normEmail] };
    delete rest.password;
    return rest;
  }

  // B. Try Firestore
  try {
    const userDocRef = doc(db, "users", normEmail);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.password === password) {
        return {
          name: data.name,
          email: data.email,
          role: data.role
        };
      }
    }
  } catch (err) {
    console.warn("Firestore authentication failed, falling back to localStorage:", err);
  }

  // C. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    if (stored) {
      const list: UserProfile[] = JSON.parse(stored);
      const matched = list.find(u => u.email.toLowerCase() === normEmail && u.password === password);
      if (matched) {
        const rest = { ...matched };
        delete rest.password;
        return rest;
      }
    }
  }

  return null;
}

// 3. GET REGISTERED USERS DIRECTORY
export async function getUsersRegistry(): Promise<UserProfile[]> {
  const dynamicUsers: UserProfile[] = [];

  // A. Try Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      dynamicUsers.push({
        name: data.name,
        email: data.email,
        role: data.role
      });
    });
    if (dynamicUsers.length > 0) {
      return dynamicUsers;
    }
  } catch (err) {
    console.warn("Firestore get users directory failed, falling back to localStorage:", err);
  }

  // B. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    if (stored) {
      const list: UserProfile[] = JSON.parse(stored);
      return list.map((u) => {
        const rest = { ...u };
        delete rest.password;
        return rest;
      });
    }
  }

  return [];
}

// 4. DELETE USER FROM REGISTRY
export async function deleteUserFromRegistry(email: string): Promise<boolean> {
  const normEmail = email.toLowerCase().trim();

  // A. Try Firestore
  try {
    const userDocRef = doc(db, "users", normEmail);
    await deleteDoc(userDocRef);
    console.log("User successfully deleted from Firestore");
  } catch (err) {
    console.warn("Firestore delete failed, falling back to localStorage:", err);
  }

  // B. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    if (stored) {
      const list: UserProfile[] = JSON.parse(stored);
      const updated = list.filter(u => u.email.toLowerCase() !== normEmail);
      localStorage.setItem("registered_users", JSON.stringify(updated));
    }
  }
  return true;
}

// 4.5. UPDATE USER IN REGISTRY
export async function updateUserInRegistry(email: string, name: string, role: string): Promise<boolean> {
  const normEmail = email.toLowerCase().trim();

  // A. Try Firestore
  try {
    const userDocRef = doc(db, "users", normEmail);
    await setDoc(userDocRef, { name, role }, { merge: true });
    console.log("User successfully updated in Firestore");
  } catch (err) {
    console.warn("Firestore update failed, falling back to localStorage:", err);
  }

  // B. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    if (stored) {
      const list: UserProfile[] = JSON.parse(stored);
      const updated = list.map(u => {
        if (u.email.toLowerCase() === normEmail) {
          return { ...u, name, role };
        }
        return u;
      });
      localStorage.setItem("registered_users", JSON.stringify(updated));
    }
  }
  return true;
}

// 5. SUBMIT QUIZ RESULT
export async function submitQuizResult(submission: QuizSubmission): Promise<boolean> {
  // A. Try Firestore
  try {
    const id = `${Date.now()}_${submission.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const docRef = doc(db, "submissions", id);
    await setDoc(docRef, submission);
    console.log("Quiz submission saved to Firestore");
  } catch (err) {
    console.warn("Firestore submission write failed, falling back to localStorage:", err);
  }

  // B. LocalStorage fallback
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("submissions");
    const list: QuizSubmission[] = stored ? JSON.parse(stored) : [];
    list.unshift(submission);
    localStorage.setItem("submissions", JSON.stringify(list));
  }
  return true;
}

// 6. GET RECENT SUBMISSIONS
export async function getRecentSubmissions(): Promise<QuizSubmission[]> {
  const list: QuizSubmission[] = [];

  // A. Try Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "submissions"));
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as QuizSubmission);
    });
    if (list.length > 0) {
      return list.sort((a, b) => b.date.localeCompare(a.date));
    }
  } catch (err) {
    console.warn("Firestore fetch submissions failed, falling back to localStorage:", err);
  }

  // B. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("submissions");
    if (stored) {
      return JSON.parse(stored);
    }
  }

  // C. Mock records if none exists
  return [
    { name: "Kavishka Aswaththa", email: "student@masterlearning.com", quizId: "science-101", subject: "Grade 10 Science Quiz", score: "90%", date: "2026-07-14 16:12", status: "Approved" },
    { name: "Nishadi Perera", email: "nishadi@gmail.com", quizId: "math-202", subject: "Grade 11 Pure Mathematics", score: "80%", date: "2026-07-14 13:45", status: "Approved" }
  ];
}

// 7. SAVE QUIZ TEMPLATE
export async function saveQuizTemplate(quiz: Quiz): Promise<boolean> {
  // A. Try Firestore
  try {
    const docRef = doc(db, "quizzes", quiz.id);
    await setDoc(docRef, quiz);
    console.log("Quiz template saved to Firestore");
  } catch (err) {
    console.warn("Firestore saveQuizTemplate failed, falling back to localStorage:", err);
  }

  // B. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("quizzes");
    const list: Quiz[] = stored ? JSON.parse(stored) : [];
    const updated = list.filter(q => q.id !== quiz.id);
    updated.unshift(quiz);
    localStorage.setItem("quizzes", JSON.stringify(updated));
  }
  return true;
}

// 8. GET ALL QUIZ TEMPLATES
export async function getQuizTemplates(): Promise<Quiz[]> {
  const list: Quiz[] = [];

  // A. Try Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "quizzes"));
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Quiz);
    });
    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetch quizzes failed, falling back to localStorage:", err);
  }

  // B. Fallback to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("quizzes");
    if (stored) {
      const parsed = JSON.parse(stored) as Quiz[];
      if (parsed.length > 0) {
        return parsed;
      }
    }
    
    // Seed localStorage on first load so user has data
    localStorage.setItem("quizzes", JSON.stringify(sampleQuizzes));
  }

  return sampleQuizzes;
}

// 9. SEED DATABASE
export async function seedDatabase(): Promise<boolean> {
  try {
    // A. Seed default users
    for (const [email, profile] of Object.entries(SEEDED_USERS)) {
      const userDocRef = doc(db, "users", email);
      await setDoc(userDocRef, {
        name: profile.name,
        email: profile.email.toLowerCase(),
        role: profile.role,
        password: profile.password
      }, { merge: true });
    }
    console.log("Seeded default users to Firestore successfully.");

    // B. Seed default quizzes
    for (const quiz of sampleQuizzes) {
      const quizDocRef = doc(db, "quizzes", quiz.id);
      await setDoc(quizDocRef, quiz, { merge: true });
    }
    console.log("Seeded default quizzes to Firestore successfully.");

    // C. Seed default submissions
    const defaultSubmissions: QuizSubmission[] = [
      { name: "Kavishka Aswaththa", email: "student@masterlearning.com", quizId: "science-101", subject: "Science - Grade 10 - Introduction to General Science", score: "90%", date: "2026-07-14 16:12", status: "Approved" },
      { name: "Nishadi Perera", email: "nishadi@gmail.com", quizId: "math-202", subject: "Mathematics - Grade 11 - Quadratic Equations & Trigonometry", score: "80%", date: "2026-07-14 13:45", status: "Approved" }
    ];

    for (const sub of defaultSubmissions) {
      const id = `seeded_${sub.email.replace(/[^a-zA-Z0-9]/g, "_")}_${sub.quizId}`;
      const docRef = doc(db, "submissions", id);
      await setDoc(docRef, sub, { merge: true });
    }
    console.log("Seeded default submissions to Firestore successfully.");
    return true;
  } catch (err) {
    console.error("Error seeding Firestore database:", err);
    return false;
  }
}
