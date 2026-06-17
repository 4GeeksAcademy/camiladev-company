import { Candidate } from "../types/models";

export function findCandidateById(candidates: Candidate[], id: string): Candidate | null {
    for (const candidate of candidates) {

        if (candidate.id === id){

            return candidate;
        }
    }

    return null;
}


export function findCandidateByEmail(candidates: Candidate[], email: string): Candidate | null {

    const lowerTargetEmail = email.toLowerCase();

    for (const candidate of candidates) {
       
        if (candidate.email.toLowerCase() === lowerTargetEmail) {
            return candidate; 
        }
    }
    
    return null; 
}
export function binarySearchCandidateBySalary(sortedCandidates: Candidate[], targetSalary: number): number{
    let low = 0;
    let high = sortedCandidates.length -1;

    while (low <= high){
        const mid = Math.floor(low + (high - low) / 2);
        // calcular el indice medio para evitar desbordamiento
        if (sortedCandidates[mid].expectedSalary === targetSalary) {

            return mid;

        } else if (sortedCandidates[mid].expectedSalary < targetSalary) {

            low = mid + 1;

        } else {
            
            high = mid - 1;
        }
    }
    return -1; // Si no se encuentra el candidato, retorna -1
}