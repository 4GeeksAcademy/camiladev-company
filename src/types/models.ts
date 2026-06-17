export interface Candidate {
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
export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
export type SeniorityLevel = "Junior" | "Semi-Senior" | "Senior" | "Lead" | "Executive";
export type AvailabilityStatus = "Immediate" | "2 weeks" | "1 month" | "Not available";
export type CandidateStatus = "Active" | "In process" | "Hired" | "Inactive";



export interface Vacancy {
  id: string; // Identificador único (ej: "V-2024-0892")
  title: string; // Título del puesto (ej: "Senior Full-Stack Developer")
  companyName: string; // Nombre de la empresa cliente
  requiredSkills: string[]; // Habilidades técnicas requeridas
  preferredSkills: string[]; // Habilidades deseables
  minYearsExperience: number; // Experiencia mínima requerida
  maxYearsExperience: number; // Experiencia máxima relevante
  requiredEnglishLevel: EnglishLevel; // Nivel mínimo de inglés
  requiredSeniority: SeniorityLevel; // Nivel de seniority requerido
  salaryRangeMin: number; // Salario mínimo ofrecido (USD)
  salaryRangeMax: number; // Salario máximo ofrecido (USD)
  isRemote: boolean; // Posición remota
  location: string; // Ubicación de oficina si no es remota
  status: VacancyStatus; // Estado actual de la vacante
}

export type VacancyStatus = "Open" | "In progress" | "Closed" | "On hold";



export interface SelectionProcess {
  id: string; // Identificador único (ej: "SP-2024-1523")
  candidateId: string; // Referencia al candidato
  vacancyId: string; // Referencia a la vacante
  stage: ProcessStage; // Etapa actual
  score: number; // Puntaje de match (0-100)
  notes: string; // Notas del consultor
  createdAt: Date; // Fecha de inicio del proceso
  updatedAt: Date; // Fecha de última actualización
}

export type ProcessStage =
  | "Screening"
  | "Interview"
  | "Technical test"
  | "Final interview"
  | "Offer"
  | "Rejected"
  | "Hired";