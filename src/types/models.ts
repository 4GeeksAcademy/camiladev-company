interface Candidate {
   id: string;
   name: string;
   email: string;
   phone: string;
   yearsOfExperience: number;
   skills: string[];
   englishLevel: EnglishLevel;
   seniority: SeniorityLevel;
   expectedSalary: number; 
   availability: AvailabilityStatus; 
   location: string; 
   remoteOnly: boolean; 
   status: CandidateStatus; 

}
type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
type SeniorityLevel = "Junior" | "Semi-Senior" | "Senior" | "Lead" | "Executive";
type AvailabilityStatus = "Immediate" | "2 weeks" | "1 month" | "Not available";
type CandidateStatus = "Active" | "In process" | "Hired" | "Inactive";