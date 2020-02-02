const rp = require('request-promise-native');

const request = rp.defaults({ baseUrl: 'http://hotel-test.equalexperts.io', resolveWithFullResponse: true, json: true });

describe('hotel booking api tests', () => {
  test('can get all bookings', async () => {
    const uri = '/booking';

    const response = await request.get(uri);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
  });

  test('can add and get booking and remove a booking', async () => {
    const uri = '/booking';
    const addBooking = await request.post({uri,body: {"firstname":"a","lastname":"b","totalprice":"2","depositpaid":"true","bookingdates":{"checkin":"2020-02-03","checkout":"2020-02-03"}}});
    expect(addBooking.statusCode).toBe(200);
   
    const getBooking = await request.get({uri: `${uri}/${addBooking.body.bookingid}`});
    expect(getBooking.statusCode).toBe(200);
    expect(getBooking.body.firstname).toEqual('a');

    const deleteBooking = await request.delete({uri: `${uri}/${addBooking.body.bookingid}`, headers: {authorization: 'Basic YWRtaW46cGFzc3dvcmQxMjM='}});
    expect(deleteBooking.statusCode).toBe(201);
    expect(deleteBooking.body).toEqual('Created');
  });
});
