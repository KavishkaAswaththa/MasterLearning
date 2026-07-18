import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  photoURL?: string;
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

    // D. Seed default courses
    const defaultCourses = [
      { id: "math-11", title: "Grade 11 Pure Mathematics", description: "Explore trigonometry, quadratic equations, and complex numbers with worksheets and online tests.", grade: "Grade 11", lessonsCount: 30, quizzesCount: 8, duration: "15", progress: 80, iconType: "math" },
      { id: "physics-11", title: "Grade 11 Newtonian Mechanics", description: "Master laws of motion, gravitation, energy, and momentum through video lectures and simulations.", grade: "Grade 11", lessonsCount: 24, quizzesCount: 6, duration: "12", progress: 65, iconType: "physics" },
      { id: "chemistry-11", title: "Grade 11 Organic Chemistry", description: "Understand carbon compounds, chemical bonding, and molecular interactions with interactive notes.", grade: "Grade 11", lessonsCount: 20, quizzesCount: 5, duration: "10", progress: 30, iconType: "chemistry" },
      { id: "it-11", title: "Grade 11 Programming Concepts", description: "An introduction to algorithms, variables, logic gates, and software engineering principles.", grade: "Grade 11", lessonsCount: 16, quizzesCount: 4, duration: "8", progress: 0, iconType: "it" },
      { id: "english-11", title: "Grade 11 English Literature", description: "Critical analysis of poetry, drama, and prose, with written assignments and vocab quizzes.", grade: "Grade 11", lessonsCount: 12, quizzesCount: 3, duration: "6", progress: 15, iconType: "english" }
    ];
    for (const course of defaultCourses) {
      const docRef = doc(db, "courses", course.id);
      await setDoc(docRef, course, { merge: true });
    }

    // E. Seed default live classes
    const defaultLiveClasses = [
      { id: "1", title: "Newtonian Physics Live Lesson", teacher: "Professor Davis", time: "Tomorrow, 9:00 AM", duration: "60 mins" },
      { id: "2", title: "Trigonometry Masterclass", teacher: "Madame Nishadi", time: "July 16, 2:00 PM", duration: "45 mins" }
    ];
    for (const item of defaultLiveClasses) {
      const docRef = doc(db, "live_classes", item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // F. Seed default recorded lessons
    const defaultRecorded = [
      { id: "rec_1", title: "Chapter 1: Intro to Gravitation", category: "Physics", views: "142 views", time: "3 days ago" },
      { id: "rec_2", title: "Chapter 3: Alkanes & Chemical Bonds", category: "Chemistry", views: "98 views", time: "1 week ago" },
      { id: "rec_3", title: "Chapter 2: Quadratic Equations Basics", category: "Mathematics", views: "210 views", time: "2 weeks ago" }
    ];
    for (const item of defaultRecorded) {
      const docRef = doc(db, "recorded_lessons", item.id);
      await setDoc(docRef, item, { merge: true });
    }

    return true;
  } catch (err) {
    console.error("Error seeding Firestore database:", err);
    return false;
  }
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  grade: string;
  lessonsCount: number;
  quizzesCount: number;
  duration: string;
  progress: number;
  iconType: "math" | "science" | "it" | "english" | "physics" | "chemistry";
}

export interface LiveClass {
  id: string;
  title: string;
  teacher: string;
  time: string;
  duration: string;
}

export interface RecordedLesson {
  id: string;
  title: string;
  category: string;
  views: string;
  time: string;
}

// 10. GET COURSES LIST
export async function getCoursesList(): Promise<CourseData[]> {
  const list: CourseData[] = [];
  try {
    const snap = await getDocs(collection(db, "courses"));
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as CourseData);
    });
    if (list.length > 0) return list;
  } catch (err) {
    console.warn("Firestore getCoursesList failed, falling back to localStorage:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("courses");
    if (stored) return JSON.parse(stored) as CourseData[];
    
    const defaultCourses: CourseData[] = [
      { id: "math-11", title: "Grade 11 Pure Mathematics", description: "Explore trigonometry, quadratic equations, and complex numbers with worksheets and online tests.", grade: "Grade 11", lessonsCount: 30, quizzesCount: 8, duration: "15", progress: 80, iconType: "math" },
      { id: "physics-11", title: "Grade 11 Newtonian Mechanics", description: "Master laws of motion, gravitation, energy, and momentum through video lectures and simulations.", grade: "Grade 11", lessonsCount: 24, quizzesCount: 6, duration: "12", progress: 65, iconType: "physics" },
      { id: "chemistry-11", title: "Grade 11 Organic Chemistry", description: "Understand carbon compounds, chemical bonding, and molecular interactions with interactive notes.", grade: "Grade 11", lessonsCount: 20, quizzesCount: 5, duration: "10", progress: 30, iconType: "chemistry" },
      { id: "it-11", title: "Grade 11 Programming Concepts", description: "An introduction to algorithms, variables, logic gates, and software engineering principles.", grade: "Grade 11", lessonsCount: 16, quizzesCount: 4, duration: "8", progress: 0, iconType: "it" },
      { id: "english-11", title: "Grade 11 English Literature", description: "Critical analysis of poetry, drama, and prose, with written assignments and vocab quizzes.", grade: "Grade 11", lessonsCount: 12, quizzesCount: 3, duration: "6", progress: 15, iconType: "english" }
    ];
    localStorage.setItem("courses", JSON.stringify(defaultCourses));
    return defaultCourses;
  }
  return [];
}

// 11. GET LIVE CLASSES
export async function getLiveClasses(): Promise<LiveClass[]> {
  const list: LiveClass[] = [];
  try {
    const snap = await getDocs(collection(db, "live_classes"));
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as LiveClass);
    });
    if (list.length > 0) return list;
  } catch (err) {
    console.warn("Firestore getLiveClasses failed, falling back to localStorage:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("live_classes");
    if (stored) return JSON.parse(stored) as LiveClass[];

    const defaultLiveClasses: LiveClass[] = [
      { id: "1", title: "Newtonian Physics Live Lesson", teacher: "Professor Davis", time: "Tomorrow, 9:00 AM", duration: "60 mins" },
      { id: "2", title: "Trigonometry Masterclass", teacher: "Madame Nishadi", time: "July 16, 2:00 PM", duration: "45 mins" }
    ];
    localStorage.setItem("live_classes", JSON.stringify(defaultLiveClasses));
    return defaultLiveClasses;
  }
  return [];
}

// 12. SAVE LIVE CLASS
export async function saveLiveClass(item: LiveClass): Promise<boolean> {
  try {
    const docRef = doc(db, "live_classes", item.id);
    await setDoc(docRef, item);
  } catch (err) {
    console.warn("Firestore saveLiveClass failed:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("live_classes");
    const list = stored ? JSON.parse(stored) as LiveClass[] : [];
    list.unshift(item);
    localStorage.setItem("live_classes", JSON.stringify(list));
  }
  return true;
}

// 13. GET RECORDED LESSONS
export async function getRecordedLessons(): Promise<RecordedLesson[]> {
  const list: RecordedLesson[] = [];
  try {
    const snap = await getDocs(collection(db, "recorded_lessons"));
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as RecordedLesson);
    });
    if (list.length > 0) return list;
  } catch (err) {
    console.warn("Firestore getRecordedLessons failed, falling back to localStorage:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("recorded_lessons");
    if (stored) return JSON.parse(stored) as RecordedLesson[];

    const defaultRecorded: RecordedLesson[] = [
      { id: "rec_1", title: "Chapter 1: Intro to Gravitation", category: "Physics", views: "142 views", time: "3 days ago" },
      { id: "rec_2", title: "Chapter 3: Alkanes & Chemical Bonds", category: "Chemistry", views: "98 views", time: "1 week ago" },
      { id: "rec_3", title: "Chapter 2: Quadratic Equations Basics", category: "Mathematics", views: "210 views", time: "2 weeks ago" }
    ];
    localStorage.setItem("recorded_lessons", JSON.stringify(defaultRecorded));
    return defaultRecorded;
  }
  return [];
}

// 14. SAVE RECORDED LESSON
export async function saveRecordedLesson(item: RecordedLesson): Promise<boolean> {
  try {
    const docRef = doc(db, "recorded_lessons", item.id);
    await setDoc(docRef, item);
  } catch (err) {
    console.warn("Firestore saveRecordedLesson failed:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("recorded_lessons");
    const list = stored ? JSON.parse(stored) as RecordedLesson[] : [];
    list.unshift(item);
    localStorage.setItem("recorded_lessons", JSON.stringify(list));
  }
  return true;
}

// 15. UPDATE USER PASSWORD
export async function updateUserPassword(email: string, password: string): Promise<boolean> {
  const normEmail = email.toLowerCase().trim();
  try {
    const userDocRef = doc(db, "users", normEmail);
    await setDoc(userDocRef, { password }, { merge: true });
    console.log("Password updated successfully in Firestore");
  } catch (err) {
    console.warn("Firestore updatePassword failed:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    if (stored) {
      const list = JSON.parse(stored) as UserProfile[];
      const updated = list.map((u: UserProfile) => {
        if (u.email.toLowerCase() === normEmail) {
          return { ...u, password };
        }
        return u;
      });
      localStorage.setItem("registered_users", JSON.stringify(updated));
    }
  }
  return true;
}

// 16. UPDATE USER PROFILE
export async function updateUserProfile(email: string, name: string, photoURL?: string): Promise<boolean> {
  const normEmail = email.toLowerCase().trim();
  try {
    const userDocRef = doc(db, "users", normEmail);
    const updateData: Record<string, string> = { name };
    if (photoURL) {
      updateData.photoURL = photoURL;
    }
    await setDoc(userDocRef, updateData, { merge: true });
    console.log("Profile updated successfully in Firestore");
  } catch (err) {
    console.warn("Firestore updateUserProfile failed:", err);
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("registered_users");
    if (stored) {
      const list = JSON.parse(stored) as UserProfile[];
      const updated = list.map((u: UserProfile) => {
        if (u.email.toLowerCase() === normEmail) {
          return { ...u, name, ...(photoURL ? { photoURL } : {}) };
        }
        return u;
      });
      localStorage.setItem("registered_users", JSON.stringify(updated));
    }
  }
  return true;
}

// 17. UPLOAD FILE TO STORAGE
export async function uploadFileToStorage(path: string, file: File): Promise<string> {
  try {
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (err) {
    console.error("Error uploading file to storage:", err);
    throw err;
  }
}
