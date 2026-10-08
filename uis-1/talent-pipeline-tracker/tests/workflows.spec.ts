import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { Candidate, Note } from "../types/candidates";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
if (!apiUrl) throw new Error("Configura NEXT_PUBLIC_API_URL para ejecutar las pruebas.");

async function mockApi(page: Page) {
  const candidates: Candidate[] = [
    { id: "demo-1", full_name: "Candidata de prueba", email: "demo@example.test", phone: "+34 600 000 000", position: "Asistente de Dirección", linkedin_url: "https://example.test/profile", cv_url: "https://example.test/cv", experience_years: 4, status: "received", stage: "pending", notes_count: 1, applied_at: "2026-10-01T10:00:00Z", updated_at: "2026-10-01T10:00:00Z" },
    { id: "demo-2", full_name: "Segunda candidatura", email: "second@example.test", phone: "+34 600 000 001", position: "Asistente de Dirección", linkedin_url: null, cv_url: null, experience_years: 2, status: "in_progress", stage: "review", notes_count: 0, applied_at: "2026-10-02T10:00:00Z", updated_at: "2026-10-02T10:00:00Z" },
  ];
  let notes: Note[] = [{ id: "note-1", record_id: "demo-1", content: "Nota de prueba", created_at: "2026-10-02T11:00:00Z" }];
  const state = { failList: false, failDetail: false, failNotes: false, failWrite: false, writeCount: 0, pages: [] as number[] };
  await page.route(`${apiUrl}/**`, async (route) => {
    const request = route.request();
    const path = request.url().slice(apiUrl.length).split("?")[0];
    const method = request.method();
    const write = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
    if (write) state.writeCount += 1;
    const failure = (write && state.failWrite) || (method === "GET" && ((path === "/records" && state.failList) || (path.endsWith("/notes") && state.failNotes) || (path === "/records/demo-1" && state.failDetail)));
    if (failure) {
      await route.fulfill({ status: 500, json: { detail: "Datos sensibles que no deben mostrarse" } });
      return;
    }
    if (path === "/records" && method === "GET") {
      const number = Number(new URL(request.url()).searchParams.get("page") ?? 1);
      state.pages.push(number);
      await route.fulfill({ json: { data: candidates.slice(number - 1, number), total: candidates.length, page: number, limit: 1 } });
    } else if (path === "/records" && method === "POST") {
      const created = { ...candidates[0], ...request.postDataJSON(), id: "demo-3", notes_count: 0 };
      candidates.push(created);
      await route.fulfill({ status: 201, json: created });
    } else if (path.endsWith("/notes") && method === "GET") {
      await route.fulfill({ json: { data: notes, meta: { total: notes.length } } });
    } else if (path.endsWith("/notes") && method === "POST") {
      const note = { id: "note-2", record_id: "demo-1", content: request.postDataJSON().content, created_at: "2026-10-08T10:00:00Z" };
      notes.push(note);
      await route.fulfill({ status: 201, json: note });
    } else if (method === "DELETE") {
      notes = notes.filter((note) => !path.endsWith(`/${note.id}`));
      await route.fulfill({ status: 204 });
    } else {
      const index = candidates.findIndex((candidate) => path === `/records/${candidate.id}`);
      if (index === -1) { await route.fulfill({ status: 404, json: {} }); return; }
      if (write) candidates[index] = { ...candidates[index], ...request.postDataJSON() };
      await route.fulfill({ json: candidates[index] });
    }
  });
  return state;
}

test("listado completo, filtros URL, búsqueda privada y navegación sin recarga", async ({ page }) => {
  const state = await mockApi(page);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Segunda candidatura", exact: true })).toBeVisible();
  expect(state.pages).toContain(2);
  await expect(page.getByText("demo@example.test", { exact: true })).toHaveCount(0);
  await page.getByLabel("Estado", { exact: true }).selectOption("in_progress");
  await expect(page).toHaveURL(/status=in_progress/);
  await expect(page.getByRole("link", { name: "Candidata de prueba", exact: true })).toHaveCount(0);
  await page.getByLabel("Etapa", { exact: true }).selectOption("review");
  await expect(page).toHaveURL(/stage=review/);
  await page.getByRole("button", { name: "Limpiar", exact: true }).click();
  await page.getByLabel("Buscar por nombre o email").fill("DEMO@EXAMPLE.TEST");
  await expect(page.getByRole("link", { name: "Candidata de prueba", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Segunda candidatura", exact: true })).toHaveCount(0);
  expect(page.url()).not.toContain("EXAMPLE");
  await page.evaluate(() => Reflect.set(window, "navigationCheck", "kept"));
  await page.getByRole("link", { name: "Candidata de prueba", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Candidata de prueba" })).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, "navigationCheck"))).toBe("kept");
});

test("privacidad, PATCH de estado y etapa, PUT, creación y eliminación de notas", async ({ page }) => {
  await mockApi(page);
  await page.goto("/candidates/demo-1");
  await expect(page.getByRole("heading", { name: "Candidata de prueba" })).toBeVisible();
  await expect(page.getByText("demo@example.test", { exact: true })).toHaveCount(0);
  await page.getByLabel("Mostrar datos de contacto").check();
  await expect(page.getByText("demo@example.test", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir CV" })).toHaveAttribute("rel", "noopener noreferrer");
  await page.getByLabel("Estado actual", { exact: true }).selectOption("selected");
  await expect(page.getByRole("status").filter({ hasText: "Candidatura actualizada" })).toBeVisible();
  await expect(page.getByLabel("Estado actual", { exact: true })).toHaveValue("selected");
  await page.getByLabel("Etapa actual", { exact: true }).selectOption("offer_presented");
  await expect(page.getByLabel("Etapa actual", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("Etapa actual", { exact: true })).toHaveValue("offer_presented");
  await page.getByRole("button", { name: "Editar candidatura" }).click();
  await page.getByLabel("Nombre completo *", { exact: true }).fill("Nombre corregido");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { name: "Nombre corregido" })).toBeVisible();
  await expect(page.getByText("Datos guardados correctamente.")).toBeVisible();
  await page.getByLabel("Nueva nota", { exact: true }).fill("Nueva nota de prueba");
  await page.getByRole("button", { name: "Añadir nota" }).click();
  await expect(page.getByText("Nueva nota de prueba", { exact: true })).toBeVisible();
  const note = page.locator(".notes-list li").filter({ hasText: "Nueva nota de prueba" });
  await note.getByRole("button", { name: "Eliminar nota" }).click();
  await note.getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(page.getByText("Nueva nota de prueba", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Nota eliminada correctamente.")).toBeVisible();
});

test("registro validado con feedback de error y éxito", async ({ page }) => {
  const state = await mockApi(page);
  await page.goto("/candidates/new");
  await page.getByRole("button", { name: "Registrar candidatura" }).click();
  expect(state.writeCount).toBe(0);
  await page.getByLabel("Nombre completo *", { exact: true }).fill("Nueva candidatura de prueba");
  await page.getByLabel("Email *", { exact: true }).fill("new@example.test");
  await page.getByLabel("Teléfono *", { exact: true }).fill("600000002");
  await page.getByLabel("Años de experiencia *", { exact: true }).fill("3");
  state.failWrite = true;
  await page.getByRole("button", { name: "Registrar candidatura" }).click();
  await expect(page.getByRole("alert")).toContainText("El servicio no pudo completar");
  await expect(page.getByLabel("Email *", { exact: true })).toHaveValue("new@example.test");
  state.failWrite = false;
  await page.getByRole("button", { name: "Registrar candidatura" }).click();
  await expect(page.getByRole("heading", { name: "Nueva candidatura de prueba" })).toBeVisible();
  await expect(page.getByText("Candidatura registrada correctamente.")).toBeVisible();
});

test("errores de obtención y mutación recuperables sin filtrar respuestas sensibles", async ({ page }) => {
  const state = await mockApi(page);
  state.failList = true;
  await page.goto("/");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByText("Datos sensibles que no deben mostrarse")).toHaveCount(0);
  state.failList = false;
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("link", { name: "Candidata de prueba", exact: true })).toBeVisible();
  state.failDetail = true;
  await page.goto("/candidates/demo-1");
  await expect(page.getByRole("alert")).toBeVisible();
  state.failDetail = false;
  state.failNotes = true;
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("heading", { name: "Candidata de prueba" })).toBeVisible();
  await expect(page.locator(".notes-section").getByRole("alert")).toBeVisible();
  state.failNotes = false;
  await page.locator(".notes-section").getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByText("Nota de prueba", { exact: true })).toBeVisible();
  state.failWrite = true;
  await page.getByLabel("Estado actual", { exact: true }).selectOption("selected");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Estado actual", { exact: true })).toHaveValue("received");
  await page.getByLabel("Nueva nota", { exact: true }).fill("Conservar borrador");
  await page.getByRole("button", { name: "Añadir nota" }).click();
  await expect(page.locator(".notes-section").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Nueva nota", { exact: true })).toHaveValue("Conservar borrador");
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`diseño responsive ${viewport.width}px`, async ({ page }, testInfo) => {
    await mockApi(page);
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Candidata de prueba", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("listado.png"), fullPage: true });
    await page.getByRole("link", { name: "Candidata de prueba", exact: true }).click();
    await expect(page.getByText("Nota de prueba", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("detalle.png"), fullPage: true });
    await page.getByRole("button", { name: "Editar candidatura" }).click();
    await expect(page.getByLabel("Nombre completo *", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("formulario.png"), fullPage: true });
  });
}