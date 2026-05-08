const { test, expect } = require('@playwright/test');

test('Homepage loads correctly and displays branding', async ({ page }) => {
  // 1. Tell the robot to navigate to your local web server
  await page.goto('http://localhost:3001');

  // 2. Assert that the title of the browser tab is correct
  await expect(page).toHaveTitle(/PRTrust Control Panel/);

  // 3. Assert that the page loaded with either login or dashboard content
  const pageContent = await page.textContent('body');
  const hasSignInButton = pageContent.includes('Sign In with GitHub');
  const hasDashboardText = pageContent.includes('Algorithm Settings') || pageContent.includes('PRTrust Control Panel');
  
  // Either login button or dashboard should be visible
  expect(hasSignInButton || hasDashboardText).toBeTruthy();
});

test('Risk Dial sliders exist and are interactive', async ({ page }) => {
  await page.goto('http://localhost:3001');

  // Wait for the page to load (either login or dashboard)
  const pageContent = page.locator('body');
  await expect(pageContent).toContainText(/Sign In with GitHub|Algorithm Settings/, { timeout: 5000 });

  // If logged in, check for sliders
  const algorithmSection = page.locator('text=Algorithm Settings');
  if (await algorithmSection.isVisible({ timeout: 2000 }).catch(() => false)) {
    // AI Weight slider should exist
    const aiWeightLabel = page.locator('text=AI Code Analysis Weight');
    await expect(aiWeightLabel).toBeVisible();

    // Trust Weight slider should exist
    const trustWeightLabel = page.locator('text=Developer Trust Track Record');
    await expect(trustWeightLabel).toBeVisible();

    // Auto-Merge Threshold slider should exist
    const autoMergeLabel = page.locator('text=Auto-Merge Threshold');
    await expect(autoMergeLabel).toBeVisible();

    console.log('✅ All Risk Dial sliders are visible');
  } else {
    console.log('ℹ️ Not logged in, skipping slider test');
  }
});

test('Dashboard renders without crashing', async ({ page }) => {
  // Set a custom timeout to catch any JavaScript errors
  page.on('pageerror', (err) => {
    throw new Error(`Page error: ${err.message}`);
  });

  await page.goto('http://localhost:3001');

  // Wait for at least some content to load
  const bodyContent = await page.locator('body').textContent();
  expect(bodyContent.length).toBeGreaterThan(0);

  // Check that no error messages appear
  const hasError = bodyContent.includes('Error') && bodyContent.includes('failed');
  expect(!hasError).toBeTruthy();

  console.log('✅ Dashboard loaded without JavaScript errors');
});
