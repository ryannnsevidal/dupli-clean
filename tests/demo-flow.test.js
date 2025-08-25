const { test, expect } = require('@playwright/test');

test.describe('DupliClean End-to-End Demo Flow', () => {
  test('Complete user journey - Upload, Detect, Manage Duplicates', async ({ page }) => {
    // 1. Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('DupliClean');
    
    // 2. Sign in with email
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.click('button[type="submit"]');
    
    // 3. Verify magic link sent
    await expect(page.locator('text=Check your email')).toBeVisible();
    
    // 4. Dashboard should be accessible after auth
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // 5. Upload files
    await page.goto('/import');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      'tests/fixtures/sample-image-1.jpg',
      'tests/fixtures/sample-image-2.jpg',
      'tests/fixtures/sample-image-1-copy.jpg' // Duplicate
    ]);
    
    // 6. Wait for processing
    await expect(page.locator('text=Processing')).toBeVisible();
    await page.waitForSelector('text=Upload Complete', { timeout: 30000 });
    
    // 7. Check duplicates page
    await page.goto('/duplicates');
    await expect(page.locator('text=Duplicate Groups')).toBeVisible();
    
    // 8. Verify duplicate detection
    const duplicateGroups = page.locator('[data-testid="duplicate-group"]');
    await expect(duplicateGroups).toHaveCount(1);
    
    // 9. Test duplicate management
    await page.click('[data-testid="select-duplicate"]');
    await page.click('text=Delete Selected');
    await expect(page.locator('text=Files deleted successfully')).toBeVisible();
  });
  
  test('Dashboard statistics and analytics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verify key metrics
    await expect(page.locator('text=Total Files')).toBeVisible();
    await expect(page.locator('text=Duplicate Groups')).toBeVisible();
    await expect(page.locator('text=Storage Used')).toBeVisible();
    
    // Verify processing jobs
    await page.click('text=Processing Jobs');
    await expect(page.locator('text=Background jobs')).toBeVisible();
  });
  
  test('Cloud service integration', async ({ page }) => {
    await page.goto('/import');
    
    // Verify cloud services tab
    await page.click('text=Cloud Services');
    await expect(page.locator('text=Connect Cloud Storage')).toBeVisible();
    
    // Test cloud service configuration
    await page.click('text=Add Google Drive');
    await expect(page.locator('text=Google Drive Configuration')).toBeVisible();
  });
});
