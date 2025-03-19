import { test as base, expect, chromium } from '@playwright/test';
class BaseTest {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async setup(url) {
        console.log('Setup: Mở trình duyệt và vào trang', url);
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext({
            viewport: null,
        });
        this.page = await this.context.newPage();
        await this.page.goto(url);
    }

    async teardown() {
        console.log('Teardown: Đóng trình duyệt');
        await this.browser?.close();
    }
}

const test = base.extend({
    baseTest: async ({}, use) => {
        const baseTest = new BaseTest();
        await baseTest.setup('https://www.demoblaze.com/');
        await use(baseTest);
        await baseTest.teardown();
    }
});

export { test, expect };
