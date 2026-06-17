import { AvailabilityStatus, Candidate, SeniorityLevel } from "../types/models";

export type AvailabilityOption = "immediate" | "2-weeks" | "1-month" | "not-available";

export const AVAILABILITY_MAP: Record<AvailabilityOption, string> = {
    "immediate": "Inmediata",
    "2-weeks": "2 semanas",
    "1-month": "1 mes",
    "not-available": "No disponible"
};

export function filterCandidatesBySkills(candidates: Candidate[], requiredSkills: string[]): Candidate[] {
  const lowerRequiredSkills: string[] = requiredSkills.map(skill => skill.toLowerCase());

  return candidates.filter((candidate: Candidate) => {
    const candidateSkills: string[] = candidate.skills.map(skill => skill.toLowerCase());
    
    return lowerRequiredSkills.every((reqSkill: string) => candidateSkills.includes(reqSkill));
  });
}

export function filterCandidatesBySeniority(candidates: Candidate[], seniority: SeniorityLevel): Candidate[] {
    return candidates.filter(candidate => candidate.seniority === seniority);
}

export function filterCandidatesByAvailability(candidates: Candidate[], availability: AvailabilityStatus[]): Candidate[] {
    return candidates.filter(candidates => availability.includes(candidates.availability));
}

export function sortCandidatesBySalary(candidates: Candidate[], order: "asc" | "desc"): Candidate[] {
    return [...candidates].sort((a, b) => {
        if (order === "asc") {
            return a.expectedSalary - b.expectedSalary;
        } else {
            return b.expectedSalary - a.expectedSalary;
        }
    });
}

export function sortCandidatesByExperience(candidates: Candidate[], order: "asc" | "desc"): Candidate[]{
    return [...candidates].sort((a, b) => {
        if (order === "desc") {
            return b.yearsOfExperience - a.yearsOfExperience;
        } else {
            return a.yearsOfExperience - b.yearsOfExperience;
        }
    });
}