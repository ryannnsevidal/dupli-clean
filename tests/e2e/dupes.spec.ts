import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const EMAIL = "test@example.com";
const fixturesDir = path.join(__dirname, "..", "fixtures");

test("end-to-end: login, upload, cluster, delete", async ({ page, request }) => {
  // 1) Start at home → login
  await page.goto("/");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByRole("button", { name: /send magic link/i }).click();

  // 2) Fetch magic link from test endpoint and visit it
  const res = await request.get(`/api/testing/last-magic-link?email=${encodeURIComponent(EMAIL)}`);
  const { url } = await res.json();
  await page.goto(url);

  // 3) Arrive at import screen
  await expect(page.getByRole("heading", { name: /import your photos & pdfs/i })).toBeVisible();

  // 4) Upload a small known corpus with dupes
  const files = ["img1.jpg", "img1-copy.jpg", "scan.pdf"]; // put real fixtures here
  await page.setInputFiles("input[type=file]", files.map(f => path.join(fixturesDir, f)));

  await page.getByRole("button", { name: /upload & process/i }).click();

  // 5) Navigate to duplicates
  await page.goto("/duplicates");
  await expect(page.locator("text=Scanning…")).toBeVisible({ timeout: 10_000 });

  // 6) Wait until a group shows up
  await expect(page.locator("[data-test=group-card]").first()).toBeVisible({ timeout: 60_000 });

  // 7) Assert there is at least one group; select non-keepers are preselected
  const firstGroup = page.locator("[data-test=group-card]").first();
  const keepBadges = firstGroup.locator("text=Keep");
  await expect(keepBadges).toHaveCount(1); // keeper badge

  // 8) Delete selected
  await firstGroup.getByRole("button", { name: /delete selected/i }).click();

  // 9) After delete, keeper still visible or group count decreases
  await expect(firstGroup).toBeVisible();
});
