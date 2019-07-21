/*
 * simple demonstration API server
 */
const http = require('http');
const url  = require('url');
const util = require('util');
const process = require('process');
const apiPrefix = '/api/v1/';

const port = process.env.PORT || 8888;
const host = process.env.HOST || 'localhost';
const listenOptions = {
  port: port,
  host: host
};
http.createServer(onRequest).listen(listenOptions, () => {
  console.log("Server has started on", host, "at port", port);
});

/*
 * handles all inbound requests
 */
function onRequest(request, response) {
  const now = new Date();
  const item = url.parse(request.url, true);
  const pathname = item.pathname;
  let data = {}
  data.received = now;
  data.path = pathname;
  let params = null;

  // process any query parameters
  if (item.query && Object.keys(item.query).length > 0) {
    params = item.query; 
  } 

  data = handlePath(pathname, params, data);
  data.completed = new Date();
  // assemble the response
  const processingTime = data.completed - data.received;
  const responseCode = data.responseCode || 200;
  const responseData = JSON.stringify(data);
  response.writeHead(responseCode, {"Content-Type": "application/json"});
  response.end(responseData, (content) => {
    // pad with leading zeros up to 4 digits otherwise just show it as is
    let padTime = '' + processingTime;
    if (processingTime < 10000) {
      padTime = ('0000' + processingTime).slice(-4) 
    }

    const message = 
    'LOG: ' + new Date().toISOString() + ' ' + responseCode + ' ' + padTime + ' ' +
      responseData;
    if (responseCode >= 400) {
      console.error(message);
    } else {
      console.log(message);
    }
  });
}

function handlePath(pathname, params, data) {
// bail out if bad state
  if (!pathname || pathname.length===0 )
    return data;
  
  let serviceAddress = '';
  if (pathname.startsWith(apiPrefix)) {
    serviceAddress = pathname.slice(apiPrefix.length)
  }

  const ourdata = data || {};  

  switch(serviceAddress) {
    case 'clients':
        ourdata.clients = [
          {
            name: 'Client One',
            entityId: '123456789'
          },
          {
            name: 'Client Two',
            entityId: '456789123'
          },
          {
            name: 'Client Three',
            entityId: '789123456'
          },
        ];
        break;
    case 'accounts':
        ourdata.accounts = [
          {
            entityId: '789123456',
            accountId: 'D73812738',
            ccy: 'USD',
            balance: '340000000.0',
            type: 'DEPOSIT',
            openedDate: '2019-01-25',
          },          
          {
            entityId: '789123456',
            accountId: 'A12389392',
            ccy: 'USD',
            balance: '1923.87',
            type: 'DDA',
            openedDate: '2019-01-25',
          },  
          {
            entityId: '123456789',
            accountId: 'A88989234',
            ccy: 'USD',
            balance: '19456000.0',
            type: 'DDA',
            openedDate: '2019-04-11',
          }, 
          {
            entityId: '456789123',
            accountId: 'A83921384',
            ccy: 'USD',
            balance: '100000.0',
            type: 'DDA',
            openedDate: '2019-03-01',
          }, 
        ];
        break;
    case 'txns':
        ourdata.txns = [
          {
            txnId: 'X492349234',
            txnDate: '2019-07-21',
            txnCcy: 'USD',
            txnAmt: '100250000.00',
            targetAccountId: 'A83921384',
            source: 'EXTERNAL',
            ownerEntityId: '456789123',
          },
        ];
        break; 
    case 'health':
      ourdata.status = {
        clients: 'OK',
        accounts: 'OK',
        txns: 'OK'
      }
      break;
    default:
      ourdata.message = 'Invalid path';
      ourdata.responseCode = 404;
  }
  return ourdata;
}
