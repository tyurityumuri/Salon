import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/NAGASE/)
    
    // Check if the hero section is visible
    await expect(page.locator('h1')).toBeVisible()
    
    // Check if navigation links are present
    await expect(page.locator('nav a[href="/stylists"]')).toBeVisible()
    await expect(page.locator('nav a[href="/styles"]')).toBeVisible()
    await expect(page.locator('nav a[href="/menu"]')).toBeVisible()
    await expect(page.locator('nav a[href="/access"]')).toBeVisible()
    
    // Check if the booking button is present
    await expect(page.locator('text=BOOK NOW')).toBeVisible()
  })

  test('should navigate to stylists page', async ({ page }) => {
    await page.goto('/')
    
    // Click on the stylists link
    await page.click('nav a[href="/stylists"]')
    
    // Verify we're on the stylists page
    await expect(page).toHaveURL('/stylists')
    await expect(page.locator('h1')).toContainText('STYLISTS')
  })

  test('should navigate to styles page', async ({ page }) => {
    await page.goto('/')
    
    // Click on the styles link
    await page.click('nav a[href="/styles"]')
    
    // Verify we're on the styles page
    await expect(page).toHaveURL('/styles')
    await expect(page.locator('h1')).toContainText('STYLES')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if mobile menu button is visible
    await expect(page.locator('button[aria-label="メニューを開く"]')).toBeVisible()
    
    // Check if hero content is still visible on mobile
    await expect(page.locator('h1')).toBeVisible()
  })
})