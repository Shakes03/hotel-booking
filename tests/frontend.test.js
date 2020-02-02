const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const mockServer = require('pptr-mock-server').default;

const baseAppUrl = 'http://hotel-test.equalexperts.io';

/*
Given more time I would have abstracted all the fixture data into its own files
As well as the moved to elements and actions to a page object model
*/

describe('fake the data calls to do only front end testing', () => {    
    beforeAll(async () => {
        await page.setViewport({ width: 1024, height: 800 });  
        this.mockRequest = await mockServer.init(page, {
            baseAppUrl,
            baseApiUrl: baseAppUrl + '/booking',
            onRequest: req => req.continue(), 
        });
    });
  
    it('site loads with existing booking', async () => {
        this.mockRequest.on('get','', 200, {body: [{ "bookingid": 1 }]});        
        this.mockRequest.on('get','/1', 200,{body: 
        {"firstname":"automatedFN","lastname":"automatedLN","totalprice":200,"depositpaid":true,"bookingdates":{"checkin":"2020-02-02","checkout":"2019-02-02"}}});
        
        await page.goto(baseAppUrl,{waitUntil: ['networkidle0']} );

        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    },10000);

    it('site loads with multiple bookings', async () => {
        this.mockRequest.on('get','', 200, {body: [{ "bookingid": 10 }, { "bookingid": 20 }]});        
        this.mockRequest.on('get','/10', 200,{body: 
            {"firstname":"automatedFN","lastname":"automatedLN","totalprice":100,"depositpaid":true,"bookingdates":{"checkin":"2020-02-02","checkout":"2019-02-02"}}});
        this.mockRequest.on('get','/20', 200,{body: 
            {"firstname":"automatedFN2","lastname":"automatedLN2","totalprice":200,"depositpaid":false,"bookingdates":{"checkin":"2020-02-02","checkout":"2020-02-02"}}});    
        
        await page.goto(baseAppUrl,{waitUntil: ['networkidle0']} );

        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    });

    it('site loads with no booking rows are returned', async () => {
        this.mockRequest.on('get','', 200, {body: [{ "bookingid": 11 }]});        
        this.mockRequest.on('get','/11', 500,{body: 'Error'});       
        
        await page.goto(baseAppUrl,{waitUntil: ['networkidle0']} );

        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    });

    it('can delete existing booking', async () => {
        this.mockRequest.on('get','', 200, {body: [{ "bookingid": 12 }]});        
        this.mockRequest.on('get','/12', 200,{body: 
            {"firstname":"automatedFN","lastname":"automatedLN","totalprice":100,"depositpaid":true,"bookingdates":{"checkin":"2020-02-02","checkout":"2019-02-02"}}});
      
        await page.goto(baseAppUrl,{waitUntil: ['networkidle0']} );

        this.mockRequest.on('delete','/12', 201, {body: 'deleted'}); 
        await page.click('[value="Delete"]');
        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    });

    it('can add a booking', async () => {
        this.mockRequest.on('get','', 200, {body: [{ "bookingid": 13 }]});        
        this.mockRequest.on('get','/13', 200,{body: 
            {"firstname":"automatedFN","lastname":"automatedLN","totalprice":100,"depositpaid":true,"bookingdates":{"checkin":"2020-02-02","checkout":"2019-02-02"}}});
      
        await page.goto(baseAppUrl,{waitUntil: ['networkidle0']} );

        await page.type('[id="firstname"]','newFN')
        await page.type('[id="lastname"]','newLN')
        await page.type('[id="totalprice"]','999')
        await page.click('[id="checkin"]');
        await page.type('[id="checkin"]','2020-01-01')
        await page.click('[id="checkout"]');
        await page.type('[id="checkout"]','2020-10-02')

        this.mockRequest.on('post','', 200, {body: 
            {"bookingid":999,"booking":{"firstname":"newFN","lastname":"newLN","totalprice":999,"depositpaid":true,"bookingdates":{"checkin":"2020-01-01","checkout":"2020-10-02"}}}});  
      
        await page.click('[value=" Save "]');
        await page.waitFor(5000); // seems be built in delay to load data after save
        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    },12000);
});
