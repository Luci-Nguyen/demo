import { test, expect } from '../lib/BaseTest.js';

test('Verify Demoblaze homepage title', async ({ baseTest }) => {
    const page = baseTest.page;
    
    // Lấy title của trang
    const title = await page.title();
    console.log(`🔹 Page Title: ${title}`);

    // Kiểm tra title có chứa 'STORE'
    expect(title).toContain('STORE');
});
