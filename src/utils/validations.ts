import { Candidate, Vacancy } from "../types/models";

export function validateYearsOfExperience(years: number): boolean {
   return years  >= 0 && years <= 50;
}

function hasAtLeastOneNonEmptySkill(skills: string[]): boolean {
return skills.some((skill) => skill.trim().length > 0);
}

 export function validateSkills(skills: string[]): boolean {
 return Array.isArray(skills) && hasAtLeastOneNonEmptySkill(skills);
}

export function validateEmail(email: string): boolean {
return isValidEmail(email);
}

export function validatePhone(phone: string): boolean {
return phone.trim().length > 0;
}


export function validateRequiredSkills(skills: string[]): boolean {
 return Array.isArray(skills) && hasAtLeastOneNonEmptySkill(skills);
}

export function validateMinYearsExperience(years: number): boolean {
  return Number.isFinite(years) && years >= 0;
}
function validateMaxYearsExperience(min:number, max: number): boolean {
  return Number.isFinite(min) && Number.isFinite(max) && max >= min && min >= 0;
}

export function validateSalaryRange(min: number, max: number): boolean {
  return Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0 && max >= min;
}

export function isValidEmail(email: string): boolean {
  const normalized = email.trim();
  const atIndex = normalized.indexOf("@");
  const lastDotIndex = normalized.lastIndexOf(".");

  return (
    normalized.length > 0 &&
    atIndex > 0 &&
    lastDotIndex > atIndex + 1 &&
    lastDotIndex < normalized.length - 1
  );
}

export function validateCandidate(candidate: Candidate): { valid: boolean, errors: string[] } {
  const errors: string[] = [];

  if (candidate.name.trim().length === 0) {
    errors.push("Candidate name is required.");
  }

  if (!isValidEmail(candidate.email)) {
    errors.push("Candidate email is invalid.");
  }

  if (!validatePhone(candidate.phone)) {
    errors.push("Candidate phone is required.");
  }

  if (!validateYearsOfExperience(candidate.yearsOfExperience)) {
    errors.push("Candidate yearsOfExperience must be between 0 and 50.");
  }

  if (!validateSkills(candidate.skills)) {
    errors.push("Candidate must have at least one skill.");
  }

  if (!Number.isFinite(candidate.expectedSalary) || candidate.expectedSalary <= 0) {
    errors.push("Candidate expectedSalary must be greater than 0.");
  }

  if (candidate.location.trim().length === 0) {
    errors.push("Candidate location is required.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateVacancy(vacancy: Vacancy): { valid: boolean, errors: string[] } {
  const errors: string[] = [];

  if (vacancy.title.trim().length === 0) {
    errors.push("Vacancy title is required.");
  }

  if (vacancy.companyName.trim().length === 0) {
    errors.push("Vacancy companyName is required.");
  }

  if (!validateRequiredSkills(vacancy.requiredSkills)) {
    errors.push("Vacancy must have at least one required skill.");
  }

  if (!validateMinYearsExperience(vacancy.minYearsExperience)) {
    errors.push("Vacancy minYearsExperience must be 0 or greater.");
  }

  if (!validateMaxYearsExperience(vacancy.minYearsExperience, vacancy.maxYearsExperience)) {
    errors.push("Vacancy maxYearsExperience must be greater than or equal to minYearsExperience.");
  }

  if (!validateSalaryRange(vacancy.salaryRangeMin, vacancy.salaryRangeMax)) {
    errors.push("Vacancy salary range is invalid.");
  }

  if (!vacancy.isRemote && vacancy.location.trim().length === 0) {
    errors.push("Vacancy location is required for non-remote positions.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}