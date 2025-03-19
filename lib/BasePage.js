import fs from 'fs';

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async click(selector) {
        await this.scrollToElement(selector);
        await this.waitForElementClickable(selector);
        await this.page.click(selector);
    }

    async setText(selector, text) {
        await this.scrollToElement(selector);
        await this.waitForElementClickable(selector);
        await this.page.fill(selector, text);
    }
    
    async navigateTo(url) {
        await this.page.goto(url);
    }

    async doubleClick(selector) {
        await this.scrollToElement(selector);
        await this.waitForElementClickable(selector);
        await this.page.dblclick(selector);
    }

    async tripleClick(selector) {
        await this.scrollToElement(selector);
        await this.scrollToElement(selector);
        await this.waitForElementClickable(selector);
        await this.page.click(selector, { clickCount: 3 });
    }

    async getText(selector) {
        await this.scrollToElement(selector);
        await this.page.waitForSelector(selector);
        return await this.page.textContent(selector);
    }

    async takeScreenshot(fileName = 'screenshot.png') {
        const screenshotPath = `screenshots/${fileName}`;
        if (!fs.existsSync('screenshots')) {
            fs.mkdirSync('screenshots');
        }

        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved: ${screenshotPath}`);
    }

    async waitForPageLoad(state = 'networkidle') {
        await this.page.waitForLoadState(state);
        console.log(`Page loaded with state: ${state}`);
    }

    async waitForElementClickable(selector, timeout = 5000) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
        while (!(await this.page.isEnabled(selector))) {
            console.log(`Waiting for element ${selector} to be clickable...`);
            await this.page.waitForTimeout(500);
        }
        console.log(`Element ${selector} is clickable.`);
    }

    async scrollToElement(selector) {
        const element = this.page.locator(selector);
        await element.scrollIntoViewIfNeeded();
        for (let i = 0; i < 3; i++) { 
            const isVisible = await element.isVisible();
            if (isVisible) break;
            await this.page.mouse.wheel(0, 200);
            await this.page.waitForTimeout(500);
            console.log(`Scrolling to reveal ${selector}...`);
        }

        console.log(`Scrolled to element: ${selector}`);
    }

    async dragAndDrop(sourceSelector, targetSelector) {
        const source = this.page.locator(sourceSelector);
        const target = this.page.locator(targetSelector);

        await source.waitFor();
        await target.waitFor();

        console.log(`Dragging ${sourceSelector} to ${targetSelector}...`);
        await source.dragTo(target);

        console.log(`Drag and drop completed.`);
    }

    async uploadFileWithDialog(buttonSelector, filePath) {
        console.log(`Simulating file selection for ${filePath}`);

        // Lắng nghe sự kiện mở hộp thoại file
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.page.click(buttonSelector),
        ]);

        await fileChooser.setFiles(filePath);
        console.log(`File uploaded: ${filePath}`);
    }

}

export default BasePage;
