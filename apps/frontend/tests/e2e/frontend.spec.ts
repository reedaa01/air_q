import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const cities = [
  { slug: "casablanca", city_name: "Casablanca", latitude: 33.57, longitude: -7.59 },
  { slug: "rabat", city_name: "Rabat", latitude: 34.02, longitude: -6.84 },
  { slug: "fes", city_name: "Fes", latitude: 34.03, longitude: -5 },
  { slug: "marrakech", city_name: "Marrakech", latitude: 31.63, longitude: -8 },
].map((city, index) => ({
  ...city,
  timezone: "Africa/Casablanca",
  latest: {
    ...city,
    id: index + 1,
    timezone: "Africa/Casablanca",
    measured_at: "2026-09-27T12:00:00",
    european_aqi: [30, 140, 0, null][index],
    pm2_5: 12.5,
    pm10: 20,
    nitrogen_dioxide: 6,
    ozone: 40,
    sulphur_dioxide: null,
    carbon_monoxide: 100,
    is_forecast: false,
  },
}));

async function mockData(page: Page) {
  await page.route("**/api/v1/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/air-quality/latest"))
      return route.fulfill({ json: { data: cities } });
    const city = cities.find((item) => url.pathname.includes(`/${item.slug}/`)) ?? cities[0];
    const forecast = url.pathname.endsWith("/forecast");
    const data = [0, 1, 2, 3].map((hour) => ({
      ...city.latest,
      measured_at: `2026-09-27T${String(10 + hour).padStart(2, "0")}:00:00`,
      is_forecast: forecast,
    }));
    await route.fulfill({
      json: {
        city,
        data,
        start: "2026-09-27T10:00:00",
        end: "2026-09-27T14:00:00",
        limit: 5000,
        offset: 0,
        has_more: false,
      },
    });
  });
  // Tests are deterministic and never depend on external map tile requests.
  await page.route("https://*.basemaps.cartocdn.com/**", (route) =>
    route.fulfill({
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j8XcAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );
}

async function navigate(page: Page, label: string) {
  const toggle = page.getByRole("button", { name: "Ouvrir le menu" });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole("navigation").getByRole("link", { name: label, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await mockData(page);
});

test("city selection, map lifecycle, reload and navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("article", { name: "Dernier indice européen de Casablanca" }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Villes disponibles" })
    .getByRole("button", { name: "Rabat", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("article", { name: "Dernier indice européen de Rabat" }),
  ).toBeVisible();
  await page.locator("#carte").scrollIntoViewIfNeeded();
  for (let i = 0; i < 3; i++) {
    await page.getByTitle("Sélectionner Casablanca, AQI 30", { exact: true }).click();
    await page.getByTitle("Sélectionner Rabat, AQI 140", { exact: true }).click();
  }
  await page.getByRole("button", { name: "Zoomer sur la carte", exact: true }).click();
  await page.getByRole("button", { name: "Recentrer la carte sur les villes" }).click();
  for (let i = 0; i < 2; i++) {
    await navigate(page, "À propos de nous");
    await expect(page.getByRole("link", { name: /GitHub d’Iliass/ })).toHaveAttribute(
      "href",
      "https://github.com/IliassGzouli",
    );
    await navigate(page, "Vue d’ensemble");
    await expect(page.locator(".leaflet-container")).toBeVisible();
  }
  await page.getByRole("link", { name: "Ouvrir la fiche de Fès" }).click();
  await expect(page).toHaveTitle("Qualité de l’air à Fès · Aeris");
  await expect(page.locator(".aqi-number")).toHaveText("0");
  await page.goBack();
  await expect(page.getByRole("article", { name: "Dernier indice européen de Fès" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("keyboard search, chart alternatives and sharing fallback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    });
  });
  await page.goto("/");
  const search = page.getByRole("combobox", { name: "Rechercher une ville" });
  await search.fill("fes");
  await search.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Fès" })).toHaveAttribute("aria-selected", "true");
  await search.press("Enter");
  await expect(page.getByRole("article", { name: "Dernier indice européen de Fès" })).toBeVisible();
  await page.getByRole("button", { name: "Copier le lien de Fès" }).click();
  await expect(page.getByRole("textbox", { name: "Lien de partage de Fès" })).toHaveValue(
    "http://127.0.0.1:3100/cities/fes",
  );
  await page.getByText("Consulter les valeurs du graphique", { exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByRole("button", { name: "7 jours", exact: true }).click();
  await expect(page.getByRole("button", { name: "7 jours", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".chart-mode").getByRole("button", { name: "Prévisions" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await search.fill("inconnue");
  await expect(page.getByText("Aucune ville ne correspond à votre recherche.")).toBeVisible();
  await search.press("Escape");
  await expect(search).toHaveAttribute("aria-expanded", "false");
});

test("stale preferences and blocked storage do not break the dashboard", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aeris.preferred-city", "ancienne-ville"));
  await page.goto("/");
  await expect(
    page.getByRole("article", { name: "Dernier indice européen de Casablanca" }),
  ).toBeVisible();
  await page.evaluate(() =>
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw new Error("quota exceeded");
      },
    }),
  );
  await page
    .getByRole("group", { name: "Villes disponibles" })
    .getByRole("button", { name: "Fès", exact: true })
    .click();
  await expect(page.getByRole("article", { name: "Dernier indice européen de Fès" })).toBeVisible();
  await page.evaluate(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("unavailable");
      },
    }),
  );
  await page
    .getByRole("group", { name: "Villes disponibles" })
    .getByRole("button", { name: "Rabat", exact: true })
    .click();
  await expect(
    page.getByRole("article", { name: "Dernier indice européen de Rabat" }),
  ).toBeVisible();
});

test("responsive layout and WCAG checks", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await page
    .getByRole("group", { name: "Villes disponibles" })
    .getByRole("button", { name: "Rabat", exact: true })
    .click();
  for (const width of testInfo.project.name === "desktop" ? [1440, 1024, 768] : [390, 360, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `No overflow at ${width}px`,
    ).toBeTruthy();
  }
  await page.screenshot({ path: testInfo.outputPath("dashboard.png"), fullPage: true });
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    audit.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
  await navigate(page, "À propos de nous");
  await expect(page).toHaveURL(/\/a-propos$/);
  await expect(page.getByRole("heading", { name: "Iliass Gzouli" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  const aboutAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(aboutAudit.violations).toEqual([]);
});

test("data service failure offers recovery", async ({ page }) => {
  await page.route("**/api/v1/air-quality/latest", (route) =>
    route.fulfill({ status: 503, json: { detail: "unavailable" } }),
  );
  await page.goto("/");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Données indisponibles");
  await page.unroute("**/api/v1/air-quality/latest");
  await page.getByRole("button", { name: "Réessayer" }).click();
  await expect(
    page.getByRole("article", { name: "Dernier indice européen de Casablanca" }),
  ).toBeVisible();
});

test("metadata, sharing image and invalid city state", async ({ page, request }) => {
  await page.goto("/cities/rabat");
  await expect(page).toHaveTitle("Qualité de l’air à Rabat · Aeris");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Qualité de l’air à Rabat · Aeris",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(image).toBeTruthy();
  const response = await request.get(image!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  await page.goto("/cities/inconnue");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Ville introuvable");
});

test("sharing success, keyboard focus and guide accessibility", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async () => undefined },
      configurable: true,
    });
  });
  await page.goto("/");
  // Safari on macOS/iOS skips links with Tab unless full keyboard access is enabled.
  if (testInfo.project.name === "safari-mobile") {
    await page.getByRole("link", { name: "Aller au contenu" }).focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const menu = page.locator(".nav-toggle");
  if (await menu.isVisible()) {
    await menu.click();
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link")
      .first()
      .focus();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  }
  await page.getByRole("button", { name: "Copier le lien de Casablanca" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Lien copié." })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
  await page.getByRole("link", { name: "Comprendre les indices", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    audit.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
});
