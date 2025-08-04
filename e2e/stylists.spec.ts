import { test, expect } from '@playwright/test'

test.describe('Stylists Page', () => {
  test('should display stylist list', async ({ page }) => {
    await page.goto('/stylists')
    
    // Check page title
    await expect(page.locator('h1')).toContainText('STYLISTS')
    
    // Check if stylist cards are visible
    await expect(page.locator('[data-testid="stylist-card"]').first()).toBeVisible()
    
    // Check if stylist names are displayed
    await expect(page.locator('text=田中 健太')).toBeVisible()
    await expect(page.locator('text=佐藤 美穂')).toBeVisible()
  })

  test('should navigate to stylist detail page', async ({ page }) => {
    await page.goto('/stylists')
    
    // Click on the first stylist card
    const firstStylistCard = page.locator('[data-testid="stylist-card"]').first()
    await firstStylistCard.click()
    
    // Verify we're on a stylist detail page
    await expect(page).toHaveURL(/\/stylists\/\w+/)
    
    // Check if stylist details are displayed
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=スキル')).toBeVisible()
    await expect(page.locator('text=経歴')).toBeVisible()
  })

  test('should show SNS links for stylists', async ({ page }) => {
    await page.goto('/stylists')
    
    // Check if Instagram links are present
    await expect(page.locator('a[aria-label="Instagram"]').first()).toBeVisible()
  })
})