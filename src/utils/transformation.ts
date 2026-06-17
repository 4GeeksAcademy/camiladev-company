import {
    Candidate,
    CandidateStatus,
    EnglishLevel,
    SelectionProcess,
    SeniorityLevel,
    Vacancy
} from "../types/models";

//  Scoring y Matching

export function calculateCandidateScore(candidate: Candidate, vacancy: Vacancy): number {
    let score = 0;

    // ==========================================
    // 1. MATCH DE HABILIDADES (Máx 40 puntos)
    // ==========================================
    const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());
    const requiredSkillsLower = vacancy.requiredSkills.map(s => s.toLowerCase());
    const preferredSkillsLower = vacancy.preferredSkills.map(s => s.toLowerCase());

    if (requiredSkillsLower.length > 0) {
        // Contamos cuántas requeridas tiene el candidato
        const matchedRequiredCount = requiredSkillsLower.filter(skill => 
            candidateSkillsLower.includes(skill)
        ).length;

        if (matchedRequiredCount === requiredSkillsLower.length) {
            score += 40; // TODAS las habilidades requeridas
        } else if (matchedRequiredCount >= requiredSkillsLower.length / 2) {
            score += 20; // Al menos el 50%
        }
    } else {
        // Si la vacante no exige requeridas, se otorgan los 40 puntos base automáticamente
        score += 40; 
    }

    // Habilidades preferidas (+10 por cada una, máx +20)
    const matchedPreferredCount = preferredSkillsLower.filter(skill => 
        candidateSkillsLower.includes(skill)
    ).length;
    score += Math.min(matchedPreferredCount * 10, 20);


    // ==========================================
    // 2. MATCH DE EXPERIENCIA (Máx 20 puntos)
    // ==========================================
    const exp = candidate.yearsOfExperience;
    const minExp = vacancy.minYearsExperience;
    const maxExp = vacancy.maxYearsExperience;

    if (exp >= minExp && exp <= maxExp) {
        score += 20; // Dentro del rango
    } else if (exp >= minExp - 2 && exp <= maxExp + 2) {
        score += 10; // 1-2 años fuera del rango
    }


    // ==========================================
    // 3. MATCH DE SENIORITY (Máx 15 puntos)
    // ==========================================
    const seniorityOrder: SeniorityLevel[] = ["Junior", "Semi-Senior", "Senior", "Lead", "Executive"];
    const candidateSeniorityIndex = seniorityOrder.indexOf(candidate.seniority);
    const vacancySeniorityIndex = seniorityOrder.indexOf(vacancy.requiredSeniority);

    if (candidateSeniorityIndex === vacancySeniorityIndex) {
        score += 15; // Match exacto
    } else if (Math.abs(candidateSeniorityIndex - vacancySeniorityIndex) === 1) {
        score += 7; // Un nivel arriba o abajo
    }


    // ==========================================
    // 4. MATCH DE INGLÉS (Máx 15 puntos)
    // ==========================================
    const englishOrder: EnglishLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];
    const candidateEnglishIndex = englishOrder.indexOf(candidate.englishLevel);
    const vacancyEnglishIndex = englishOrder.indexOf(vacancy.requiredEnglishLevel);

    if (candidateEnglishIndex >= vacancyEnglishIndex) {
        score += 15; // Cumple o excede el nivel requerido
    }


    // ==========================================
    // 5. MATCH DE SALARIO (Máx 10 puntos)
    // ==========================================
    const expected = candidate.expectedSalary;
    const salaryMin = vacancy.salaryRangeMin;
    const salaryMax = vacancy.salaryRangeMax;

    if (expected >= salaryMin && expected <= salaryMax) {
        score += 10; // Dentro del rango
    } else if (expected > salaryMax && expected <= salaryMax * 1.20) {
        score += 5; // Hasta un 20% por encima del máximo
    }

    // Aseguramos que el puntaje final esté estrictamente acotado entre 0 y 100
    return Math.max(0, Math.min(score, 100));
}


export function rankCandidatesForVacancy(
    candidates: Candidate[], 
    vacancy: Vacancy
): Array<{ candidate: Candidate; score: number }> {
    
    // Transformamos el arreglo original para incluir el score calculado
    const candidatesWithScore = candidates.map(candidate => {
        return {
            candidate: candidate,
            score: calculateCandidateScore(candidate, vacancy) // Reutilización de la función calculateCandidateScore
        };
    });

    // Ordenamos de mayor a menor puntuación (orden descendente) y retornamos
    return candidatesWithScore.sort((a, b) => b.score - a.score);
}


export function groupCandidatesBySeniority(candidates: Candidate[]): Record<SeniorityLevel, Candidate[]> {
    // Inicializamos el objeto con todos los niveles de seniority vacíos
    const groups: Record<SeniorityLevel, Candidate[]> = {
        "Junior": [],
        "Semi-Senior": [],
        "Senior": [],
        "Lead": [],
        "Executive": []
    };

    // Recorremos los candidatos y los empujamos a su respectivo grupo
    for (const candidate of candidates) {
        groups[candidate.seniority].push(candidate);
    }

    return groups;
}

// Agregaciones y Reportes

export function countCandidatesByStatus(candidates: Candidate[]): Record<CandidateStatus, number> {
    // 1. Inicializamos el contador con todos los estados en cero
    const counts: Record<CandidateStatus, number> = {
        "Active": 0,
        "In process": 0,
        "Hired": 0,
        "Inactive": 0
    };

    // 2. Recorremos los candidatos e incrementamos el contador correspondiente
    for (const candidate of candidates) {
        counts[candidate.status]++;
    }

    return counts;
}


export function calculateAverageSalary(candidates: Candidate[]): number{
  //  Validación de seguridad para evitar la división por cero
    if (candidates.length === 0) {
        return 0; 
    }

    //  Sumamos todos los salarios esperados
    const totalSalary = candidates.reduce((acumulador, candidate) => {
        return acumulador + candidate.expectedSalary;
    }, 0);

    // Calculamos el promedio, aplicamos decimales y reconvertimos a número
    const average = totalSalary / candidates.length;
    return Number(average.toFixed(2));
 }

export function findTopSkills(candidates: Candidate[], topN: number): Array<{ skill: string; count: number }> {
    // Contar la frecuencia de todas las habilidades usando .reduce()
    const skillCounts = candidates.reduce((accumulator: Record<string, number>, candidate) => {
        for (const skill of candidate.skills) {
            // Normalizamos a minúsculas para un conteo preciso (case-insensitive)
            const normalizedSkill = skill.toLowerCase(); 
            
            // Si ya existe la habilidad sumamos 1, si no existe la inicializamos en 1
            accumulator[normalizedSkill] = (accumulator[normalizedSkill] || 0) + 1;
        }
        return accumulator;
    }, {});

    // Transformar el objeto en un array de estructuras { skill, count }
    const skillArray = Object.entries(skillCounts).map(([skill, count]) => {
        return { skill, count };
    });

    // Ordenar por frecuencia (de mayor a menor) y recortar a los primeros "topN"
    return skillArray
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
}

export function calculateVacancyFillRate(processes: SelectionProcess[]): number {
    //Validación de seguridad para evitar la división por cero
    if (processes.length === 0) {
        return 0;
    }

    //Contamos cuántos procesos terminaron en "Hired" usando .filter()
    const hiredCount = processes.filter(process => process.stage === "Hired").length;

    // Calculamos el porcentaje
    const fillRate = (hiredCount / processes.length) * 100;

    // Redondeamos a 2 decimales y convertimos de nuevo a número
    return Number(fillRate.toFixed(2));
}
