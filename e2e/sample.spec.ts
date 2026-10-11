import { test, expect } from '@playwright/test';

test.describe('E2E Demo Test Suite', () => {
  test('TC01: Check home page header and title successfully', async ({ page }) => {
    // Mock page with content
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head><title>E2E Automation Dashboard</title></head>
        <body>
          <header>
            <h1 id="title">E2E Automation Dashboard</h1>
          </header>
        </body>
      </html>
    `);

    const title = await page.title();
    expect(title).toBe('E2E Automation Dashboard');
    const headerText = await page.locator('#title').textContent();
    expect(headerText).toBe('E2E Automation Dashboard');
  });

  test('TC02: Interactive counter button click works', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <button id="counter-btn" onclick="let c = document.getElementById('count'); c.innerText = parseInt(c.innerText) + 1;">Increment</button>
          <span id="count">0</span>
        </body>
      </html>
    `);

    const btn = page.locator('#counter-btn');
    const count = page.locator('#count');

    await expect(count).toHaveText('0');
    await btn.click();
    await expect(count).toHaveText('1');
    await btn.click();
    await expect(count).toHaveText('2');
  });

  test('TC03: User profile form validation with valid email', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <form id="profile-form">
            <input id="email" type="email" value="tester@company.com" />
            <button id="save" type="button" onclick="document.getElementById('msg').innerText = 'Profile Updated'">Save</button>
            <div id="msg"></div>
          </form>
        </body>
      </html>
    `);

    await page.fill('#email', 'qa.automation@corp.internal');
    await page.click('#save');
    await expect(page.locator('#msg')).toHaveText('Profile Updated');
  });

  test('TC04: Simulated checkout failure - Payment Gateway Timeout', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="status">Payment Pending</div>
        </body>
      </html>
    `);

    // Intentional failure to simulate failed E2E test
    await expect(page.locator('#status')).toHaveText('Payment Succeeded', { timeout: 1000 });
  });
});
