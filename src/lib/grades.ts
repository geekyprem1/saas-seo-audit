export type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

export function scoreToGrade(score: number): Grade {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  if (s >= 97) return "A+";
  if (s >= 93) return "A";
  if (s >= 87) return "B";
  if (s >= 80) return "C";
  if (s >= 70) return "D";
  return "F";
}

export function gradeColor(grade: Grade): {
  text: string;
  bg: string;
  ring: string;
} {
  switch (grade) {
    case "A+":
    case "A":
      return {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        ring: "stroke-emerald-500",
      };
    case "B":
      return {
        text: "text-lime-600 dark:text-lime-400",
        bg: "bg-lime-500/10",
        ring: "stroke-lime-500",
      };
    case "C":
      return {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        ring: "stroke-amber-500",
      };
    case "D":
      return {
        text: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-500/10",
        ring: "stroke-orange-500",
      };
    case "F":
      return {
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-500/10",
        ring: "stroke-red-500",
      };
  }
}

export function gradeLabel(grade: Grade): string {
  return {
    "A+": "Excellent",
    A: "Great",
    B: "Good",
    C: "Needs work",
    D: "Poor",
    F: "Critical",
  }[grade];
}