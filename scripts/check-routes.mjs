const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8080";

const routes = [
  "/",
  "/validation.js",
  "/pages/contact_form.html",
  "/pages/vacant.html"
];

async function checkRoute(route) {
  const url = `${baseUrl}${route}`;

  try {
    const response = await fetch(url);
    const body = await response.text();
    const expectsJs = route.endsWith(".js");
    const hasHtml = /<!doctype html>/i.test(body);
    const hasJs = /function|const|let|=>/.test(body);

    if (!response.ok || (!expectsJs && !hasHtml) || (expectsJs && !hasJs)) {
      console.log(`FAIL ${response.status} ${url}`);
      return false;
    }

    console.log(`OK   ${response.status} ${url}`);
    return true;
  } catch (error) {
    console.log(`FAIL 000 ${url}`);
    console.log(`     ${error.message}`);
    return false;
  }
}

const results = await Promise.all(routes.map(checkRoute));

if (results.every(Boolean)) {
  console.log("Route check completed successfully.");
  process.exit(0);
}

console.log("Route check found errors.");
process.exit(1);
