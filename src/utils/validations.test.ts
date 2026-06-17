import {
  isValidEmail,
  validateCandidate,
  validateVacancy
} from "./validations";
import { Candidate, Vacancy } from "../types/models";

type TestCase = {
  name: string;
  run: () => void;
};

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function createValidCandidate(): Candidate {
  return {
    id: "C-001",
    name: "Ana Perez",
    email: "ana@example.com",
    phone: "+57 3001234567",
    yearsOfExperience: 5,
    skills: ["TypeScript", "Node.js"],
    englishLevel: "B2",
    seniority: "Senior",
    expectedSalary: 5000,
    availability: "Immediate",
    location: "Bogota",
    remoteOnly: true,
    status: "Active"
  };
}

function createValidVacancy(): Vacancy {
  return {
    id: "V-001",
    title: "Backend Developer",
    companyName: "Acme Inc",
    requiredSkills: ["Node.js"],
    preferredSkills: ["TypeScript"],
    minYearsExperience: 3,
    maxYearsExperience: 6,
    requiredEnglishLevel: "B1",
    requiredSeniority: "Semi-Senior",
    salaryRangeMin: 3000,
    salaryRangeMax: 6000,
    isRemote: true,
    location: "",
    status: "Open"
  };
}

const tests: TestCase[] = [];

tests.push({
  name: "isValidEmail valida formato basico con posiciones correctas",
  run: () => {
    assert(isValidEmail("dev@example.com") === true, "Email valido debe retornar true");
    assert(isValidEmail("dev.example.com") === false, "Email sin @ debe retornar false");
    assert(isValidEmail("@example.com") === false, "Email sin prefijo debe retornar false");
    assert(isValidEmail("dev@com") === false, "Email sin punto en dominio debe retornar false");
    assert(isValidEmail("dev@.com") === false, "Email con punto mal posicionado debe retornar false");
  }
});

tests.push({
  name: "isValidEmail cubre casos limite de posicion y estructura",
  run: () => {
    assert(isValidEmail(" dev@example.com ") === true, "Email con espacios externos debe validarse tras trim");
    assert(isValidEmail("dev@@example.com") === true, "Regla basica permite multiples @ si la posicion minima se cumple");
    assert(isValidEmail("dev@example.") === false, "Email con punto final debe ser invalido");
    assert(isValidEmail("dev@e.c") === true, "Dominio minimo con punto intermedio debe ser valido en regla basica");
    assert(isValidEmail("") === false, "Email vacio debe ser invalido");
  }
});

tests.push({
  name: "validateCandidate retorna valid=true para candidato correcto",
  run: () => {
  const result = validateCandidate(createValidCandidate());

  assert(result.valid === true, "Candidato valido debe retornar valid=true");
  assert(result.errors.length === 0, "Candidato valido no debe retornar errores");
  }
});

tests.push({
  name: "validateCandidate retorna errores cuando faltan campos",
  run: () => {
  const invalid = createValidCandidate();
  invalid.email = "bad-email";
  invalid.skills = [];
  invalid.expectedSalary = 0;

  const result = validateCandidate(invalid);

  assert(result.valid === false, "Candidato invalido debe retornar valid=false");
  assert(result.errors.length >= 3, "Candidato invalido debe reportar varios errores");
  }
});

tests.push({
  name: "validateCandidate valida limites de experiencia y salario",
  run: () => {
    const edge = createValidCandidate();
    edge.yearsOfExperience = 0;
    edge.expectedSalary = 1;

    const validEdge = validateCandidate(edge);
    assert(validEdge.valid === true, "Candidato en limites validos debe pasar");

    edge.yearsOfExperience = 51;
    const invalidYears = validateCandidate(edge);
    assert(invalidYears.valid === false, "yearsOfExperience > 50 debe fallar");

    edge.yearsOfExperience = -1;
    const invalidNegativeYears = validateCandidate(edge);
    assert(invalidNegativeYears.valid === false, "yearsOfExperience negativo debe fallar");
  }
});

tests.push({
  name: "validateVacancy retorna valid=true para vacante correcta",
  run: () => {
  const result = validateVacancy(createValidVacancy());

  assert(result.valid === true, "Vacante valida debe retornar valid=true");
  assert(result.errors.length === 0, "Vacante valida no debe retornar errores");
  }
});

tests.push({
  name: "validateVacancy retorna errores para rango y skills invalidos",
  run: () => {
  const invalid = createValidVacancy();
  invalid.requiredSkills = [];
  invalid.minYearsExperience = 5;
  invalid.maxYearsExperience = 2;
  invalid.salaryRangeMin = 7000;
  invalid.salaryRangeMax = 6000;

  const result = validateVacancy(invalid);

  assert(result.valid === false, "Vacante invalida debe retornar valid=false");
  assert(result.errors.length >= 3, "Vacante invalida debe reportar varios errores");
  }
});

tests.push({
  name: "validateVacancy cubre casos limite de rango y ubicacion",
  run: () => {
    const edge = createValidVacancy();
    edge.minYearsExperience = 0;
    edge.maxYearsExperience = 0;
    edge.salaryRangeMin = 2500;
    edge.salaryRangeMax = 2500;

    const validEdge = validateVacancy(edge);
    assert(validEdge.valid === true, "Vacante con limites iguales validos debe pasar");

    edge.isRemote = false;
    edge.location = "";
    const missingLocation = validateVacancy(edge);
    assert(missingLocation.valid === false, "Vacante no remota sin ubicacion debe fallar");

    edge.location = "Medellin";
    edge.salaryRangeMin = 0;
    edge.salaryRangeMax = 1000;
    const invalidSalary = validateVacancy(edge);
    assert(invalidSalary.valid === false, "Rango salarial con minimo 0 debe fallar");
  }
});

let passed = 0;
let failed = 0;

for (const testCase of tests) {
  try {
    testCase.run();
    passed += 1;
    console.log(`PASS: ${testCase.name}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error(`FAIL: ${testCase.name} -> ${message}`);
  }
}

console.log(`Resultado: ${passed}/${tests.length} pruebas exitosas.`);

if (failed > 0) {
  throw new Error(`Fallaron ${failed} prueba(s).`);
}
