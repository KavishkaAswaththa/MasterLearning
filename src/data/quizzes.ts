export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  durationSeconds: number;
  description: string;
  grade: string;
  questions: Question[];
}

export const sampleQuizzes: Quiz[] = [
  {
    id: "science-101",
    title: "Grade 10 - Introduction to General Science",
    subject: "Science",
    durationSeconds: 300, // 5 minutes
    description: "Test your knowledge on basic chemical reactions, Newtonian mechanics, and cell biology concepts.",
    grade: "Grade 10",
    questions: [
      {
        id: "s1",
        text: "Which of the following describes a chemical change?",
        options: [
          "Melting of ice into water",
          "Rusting of an iron nail",
          "Dissolving sugar in water",
          "Crushing a tin can"
        ],
        correctOptionIndex: 1,
        explanation: "Rusting is a chemical reaction (oxidation) that forms a new substance (iron oxide), whereas the other options are physical changes."
      },
      {
        id: "s2",
        text: "What is the primary function of mitochondria in a eukaryotic cell?",
        options: [
          "Protein synthesis",
          "Waste disposal",
          "Adenosine Triphosphate (ATP) production",
          "Photosynthesis"
        ],
        correctOptionIndex: 2,
        explanation: "Mitochondria are the powerhouses of the cell, converting nutrients into ATP energy through cellular respiration."
      },
      {
        id: "s3",
        text: "According to Newton's Second Law of Motion, what is the relationship between force (F), mass (m), and acceleration (a)?",
        options: [
          "F = m + a",
          "F = m * a",
          "F = m / a",
          "F = a / m"
        ],
        correctOptionIndex: 1,
        explanation: "Newton's Second Law states that force is equal to mass multiplied by acceleration (F = ma)."
      },
      {
        id: "s4",
        text: "What is the pH level of pure water at 25°C?",
        options: [
          "0",
          "7",
          "14",
          "5.6"
        ],
        correctOptionIndex: 1,
        explanation: "Pure water is neutral and has a pH value of 7."
      },
      {
        id: "s5",
        text: "Which gas is most abundant in Earth's atmosphere?",
        options: [
          "Oxygen (O2)",
          "Carbon Dioxide (CO2)",
          "Nitrogen (N2)",
          "Argon (Ar)"
        ],
        correctOptionIndex: 2,
        explanation: "Nitrogen makes up approximately 78% of the Earth's atmosphere, followed by oxygen at about 21%."
      }
    ]
  },
  {
    id: "math-202",
    title: "Grade 11 - Quadratic Equations & Trigonometry",
    subject: "Mathematics",
    durationSeconds: 600, // 10 minutes
    description: "An advanced quiz assessing core capabilities in finding quadratic roots, trigonometric identities, and graph analysis.",
    grade: "Grade 11",
    questions: [
      {
        id: "m1",
        text: "What are the roots of the quadratic equation: x² - 5x + 6 = 0?",
        options: [
          "x = -2, -3",
          "x = 2, 3",
          "x = 1, 5",
          "x = -1, 6"
        ],
        correctOptionIndex: 1,
        explanation: "Factoring x² - 5x + 6 = 0 gives (x - 2)(x - 3) = 0. Therefore, the roots are x = 2 and x = 3."
      },
      {
        id: "m2",
        text: "Which of the following is equivalent to sin²(θ) + cos²(θ)?",
        options: [
          "0",
          "1",
          "tan²(θ)",
          "sec²(θ)"
        ],
        correctOptionIndex: 1,
        explanation: "This is the fundamental Pythagorean trigonometric identity: sin²(θ) + cos²(θ) = 1 for any angle θ."
      },
      {
        id: "m3",
        text: "What is the value of log₁₀(1000)?",
        options: [
          "1",
          "2",
          "3",
          "10"
        ],
        correctOptionIndex: 2,
        explanation: "Since 10³ = 1000, the logarithm base 10 of 1000 is 3."
      },
      {
        id: "m4",
        text: "If the discriminant (b² - 4ac) of a quadratic equation is negative, the roots are:",
        options: [
          "Real and equal",
          "Real and distinct",
          "Complex (imaginary) and conjugate",
          "Rational and equal"
        ],
        correctOptionIndex: 2,
        explanation: "A negative discriminant means the square root in the quadratic formula yields an imaginary number, leading to complex conjugate roots."
      },
      {
        id: "m5",
        text: "In a right-angled triangle, if the opposite side is 3 cm and the adjacent side is 4 cm, what is the value of sin(θ) for the angle opposite to the 3 cm side?",
        options: [
          "3/5",
          "4/5",
          "3/4",
          "5/3"
        ],
        correctOptionIndex: 0,
        explanation: "The hypotenuse is √(3² + 4²) = 5 cm. Since sin(θ) = opposite / hypotenuse, sin(θ) = 3/5."
      }
    ]
  }
];
