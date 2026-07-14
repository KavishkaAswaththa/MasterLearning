const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// Load configuration from node environment variables (provided by --env-file=.env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("Initializing Firebase with Project ID:", firebaseConfig.projectId);

if (!firebaseConfig.apiKey) {
  console.error("ERROR: No Firebase Configuration found. Please check your .env.local file.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const USERS_TO_SEED = [
  {
    email: "admin@masterlearning.com",
    name: "Administrator",
    role: "admin",
    password: "password123"
  },
  {
    email: "teacher@masterlearning.com",
    name: "Professor Davis",
    role: "teacher",
    password: "password123"
  },
  {
    email: "student@masterlearning.com",
    name: "Kavishka Aswaththa",
    role: "student",
    password: "password123"
  },
  {
    email: "nishadi@gmail.com",
    name: "Nishadi Perera",
    role: "student",
    password: "password123"
  },
  {
    email: "tharushi@gmail.com",
    name: "Tharushi Buddhika",
    role: "teacher",
    password: "password123"
  }
];

const SUBMISSIONS_TO_SEED = [
  {
    id: "sub_1",
    name: "Kavishka Aswaththa",
    email: "student@masterlearning.com",
    quizId: "science-101",
    subject: "Grade 10 Science - General Chemistry Quiz",
    score: "90%",
    date: "2026-07-14 16:12",
    status: "Approved"
  },
  {
    id: "sub_2",
    name: "Nishadi Perera",
    email: "nishadi@gmail.com",
    quizId: "math-202",
    subject: "Grade 11 Mathematics - Trigonometry Assessment",
    score: "80%",
    date: "2026-07-14 13:45",
    status: "Approved"
  },
  {
    id: "sub_3",
    name: "Dilshan Mindika",
    email: "dilshan@gmail.com",
    quizId: "science-101",
    subject: "Grade 10 Science - General Chemistry Quiz",
    score: "70%",
    date: "2026-07-13 11:15",
    status: "Approved"
  }
];

async function seed() {
  try {
    console.log("Seeding users...");
    for (const user of USERS_TO_SEED) {
      const userRef = doc(db, "users", user.email);
      await setDoc(userRef, user);
      console.log(`- Seeded user: ${user.email} (${user.role})`);
    }

    console.log("Seeding submissions...");
    for (const sub of SUBMISSIONS_TO_SEED) {
      const subRef = doc(db, "submissions", sub.id);
      await setDoc(subRef, sub);
      console.log(`- Seeded submission: ${sub.name} - ${sub.subject} (${sub.score})`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seed();
