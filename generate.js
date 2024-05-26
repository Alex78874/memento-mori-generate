const puppeteer = require('puppeteer');
const path = require('path');

// Capture command-line arguments
const myBirthDay = process.argv[2] || '2003-12-15';
const myLifeExpectancy = parseFloat(process.argv[3]) || 80;
const totalWeeksInLife = myLifeExpectancy * 52.1429;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Define the path to the local HTML file
    const filePath = `file:${path.join(__dirname, 'index.html')}`;

    // Open the local HTML file in the browser
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // Inject variables into the page's context
    await page.evaluate((myBirthDay, myLifeExpectancy, totalWeeksInLife) => {
        window.myBirthDay = myBirthDay;
        window.myLifeExpectancy = myLifeExpectancy;
        window.totalWeeksInLife = totalWeeksInLife;
    }, myBirthDay, myLifeExpectancy, totalWeeksInLife);

    // Optionally, you might need to trigger the script that uses these variables
    // If your page requires a specific script to run after setting these variables,
    // you can trigger it here, for example:
    // await page.evaluate(() => {
    //     initializeMementoMori();
    // });

    // Set the viewport to a fixed size
    await page.setViewport({
        width: 1200,
        height: 800
    });

    // Take a screenshot and save it as a PNG file
    await page.screenshot({ path: 'memento-mori.png', fullPage: true });

    await browser.close();
    console.log('Screenshot saved as memento-mori.png');
})();
