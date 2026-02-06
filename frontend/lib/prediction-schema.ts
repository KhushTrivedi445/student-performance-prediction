// Exact schema matching the FastAPI backend
export interface PredictionFormData {
  // Step 1 - Personal Info
  sex: string;
  age: number;
  address: string;
  famsize: string;
  pstatus: string;

  // Step 2 - Family Background
  medu: number;
  fedu: number;
  mjob: string;
  fjob: string;
  guardian: string;
  famrel: number;
  famsup: string;

  // Step 3 - School & Study
  reason: string;
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: string;
  paid: string;

  // Step 4 - Lifestyle & Habits
  activities: string;
  nursery: string;
  higher: string;
  internet: string;
  romantic: string;
  freetime: number;
  goout: number;
  dalc: number;
  walc: number;
  health: number;

  // Step 5 - Academic History
  absences: number;
  G1: number;
  G2: number;
}

export const initialFormData: PredictionFormData = {
  sex: "",
  age: NaN, // Empty initially - user must enter
  address: "",
  famsize: "",
  pstatus: "",
  medu: -1, // -1 indicates not selected
  fedu: -1, // -1 indicates not selected
  mjob: "",
  fjob: "",
  guardian: "",
  famrel: 0, // User must select
  famsup: "",
  reason: "",
  traveltime: 0, // User must select
  studytime: 0, // User must select
  failures: -1, // User must select
  schoolsup: "",
  paid: "",
  activities: "",
  nursery: "",
  higher: "",
  internet: "",
  romantic: "",
  freetime: -1, // -1 indicates not selected (0 is a valid option)
  goout: 0, // User must select (1-5 scale, 0 means not selected)
  dalc: -1, // -1 indicates not selected (0 is a valid option)
  walc: -1, // -1 indicates not selected (0 is a valid option)
  health: -1, // -1 indicates not selected (0 is a valid option)
  absences: NaN, // Empty initially - user must enter
  G1: NaN, // Empty initially - user must enter
  G2: NaN, // Empty initially - user must enter
};

// Options for dropdowns - MUST match backend expected values exactly
export const formOptions = {
  sex: [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
  ],
  address: [
    { value: "U", label: "Urban" },
    { value: "R", label: "Rural" },
  ],
  famsize: [
    { value: "LE3", label: "Less or equal to 3" },
    { value: "GT3", label: "Greater than 3" },
  ],
  pstatus: [
    { value: "T", label: "Living together" },
    { value: "A", label: "Apart" },
  ],
  education: [
    { value: 0, label: "None" },
    { value: 1, label: "Primary education (4th grade)" },
    { value: 2, label: "5th to 9th grade" },
    { value: 3, label: "Secondary education" },
    { value: 4, label: "Higher education" },
  ],
  job: [
    { value: "teacher", label: "Teacher" },
    { value: "health", label: "Health care" },
    { value: "services", label: "Civil services" },
    { value: "at_home", label: "At home" },
    { value: "other", label: "Other" },
  ],
  guardian: [
    { value: "mother", label: "Mother" },
    { value: "father", label: "Father" },
    { value: "other", label: "Other" },
  ],
  reason: [
    { value: "home", label: "Close to home" },
    { value: "reputation", label: "School reputation" },
    { value: "course", label: "Course preference" },
    { value: "other", label: "Other" },
  ],
  yesNo: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
  traveltime: [
    { value: 1, label: "< 15 min" },
    { value: 2, label: "15 to 30 min" },
    { value: 3, label: "30 min to 1 hour" },
    { value: 4, label: "> 1 hour" },
  ],
  studytime: [
    { value: 1, label: "< 2 hours" },
    { value: 2, label: "2 to 5 hours" },
    { value: 3, label: "5 to 10 hours" },
    { value: 4, label: "> 10 hours" },
  ],
  scale1to5: [
    { value: 1, label: "1 - Very Low" },
    { value: 2, label: "2 - Low" },
    { value: 3, label: "3 - Medium" },
    { value: 4, label: "4 - High" },
    { value: 5, label: "5 - Very High" },
  ],
  scale0to5: [
    { value: 0, label: "0 - None / Never" },
    { value: 1, label: "1 - Very Low" },
    { value: 2, label: "2 - Low" },
    { value: 3, label: "3 - Medium" },
    { value: 4, label: "4 - High" },
    { value: 5, label: "5 - Very High" },
  ],
};

export const stepTitles = [
  "Personal Info",
  "Family Background",
  "School & Study",
  "Lifestyle & Habits",
  "Academic History",
];

export const stepDescriptions = [
  "Tell us about yourself",
  "Share your family background",
  "Describe your school experience",
  "Tell us about your lifestyle",
  "Enter your academic history",
];
