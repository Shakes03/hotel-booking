const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

describe('Google', () => {
    beforeAll(async () => {
      await page.setViewport({ width: 1024, height: 800 });
      await page.goto('http://hotel-test.equalexperts.io/');
    });
  
    it('site loads', async () => {
        const heading = await page.$('[class="jumbotron"]');
        const headingImage = await heading.screenshot();
 
        expect(headingImage).toMatchImageSnapshot();
    });
});