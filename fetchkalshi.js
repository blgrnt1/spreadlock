const crypto = require('crypto');
const fetch = require('node-fetch'); // ensure you installed it: npm install node-fetch

// Your credentials - replace these with your actual Key ID and Private Key
const keyId = '8046b0ef-4cf2-4940-927e-a57b887bb688'
const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA1K8OQx9nUJeBDeZ3U6U4YgIzX8ZrIQE1bUy1Hvme6FkpF2cc
wq36bm0GNzygs4xnJa8N0XCYYyloV7HL0LDLYtS7puIb3Cw3RH/0t8USffeCw+4Y
IGqlagc80lEMhaRRnjLhaj5/iOc7g5RZnn9v9kWvcXL5M9ZUKZbiV6wfNfDCHEwQ
m7C1Zlt4IbsvT9b5+m8oM5Dt05PW3WoF2l5yLfx4Uan0HSBvp6ux9ZadrxGLkJJ1
N17nzZZ2k86Lv/3oIojQExwj1hefp52UEfM7Osqjx92LixS0y/q6w2d2ntYwLY3y
a18YO/mtZdatoQVjJSsD0otuRgHFNWQCGmLY8QIDAQABAoIBAB1AREhkCcwSQjwc
rd2xtAr6vYEXI4XDCkuRiLmNYFcZaCbhVhnKXs6QLRIswvdewJL0vARJpZPBzql8
+QinQBnEI1jk8Sr7Y9CGfqxFrPDpOTFkTiorMLvf6fQNFJlOy7Dj04/Or7CvCMbk
gNzlLwticyo5w19nQ2UC7Pdc42ACECgG7mQf0AGU7mnFr97Zrl3sk43lBIGI2q64
szsmiQxzKUvon9xkKqlBj22VYEzsVk6x5ZU3oKC7E9VCWJDF/tMy8g+g58GJevvI
YW2EjeTSCXAbSUZAbPwQsHKT/4TaPnqLwwv5k0RDf7jNGY/li0Dzi2RNTWigfkLr
EUUrSCcCgYEA5qpIWO1Lf2pG7wo9WS2cy/6Nm8iMzQARb5JVNaukSaTwNKQXkG2q
2vbAxwphTWgRuwKudHb7VQS7I6zLih7epn4VftcUbytWT5xI932zsL45LktTf4Cq
MFQAtlbNscy7DKP98/CFR0WlqEjla82AGkn22ZvZxsT0HeUjcxTvap8CgYEA7Asu
5AAv1xGYrNuspyCp6ANS7eTbpOv0ATNiH9b43Svl6jXRVZygyvDYChXxw1pk0btm
FvVhfYBekSKtzkonZ6q72SY/MSdnctuBc8EcA0TcJf/2YAJ42oprLx5pdFzQKan2
Tx7Ew314h+xk/58lBseOMGGW5M++UPItCpAFom8CgYBvNZgN79JfivDKHOi5Dymy
nHbPreBckfTWEvosFyXtL61z481Mn+MpEKCfFh0VgeBShpdvpVHFirNjHtM/M2Tr
Zoyci7vZYU6KsXHoiN1SkFPnQv/t0C29gTKatr0TRP7FuGce7k6Dr0uQGB0sXXau
tgxinCZiE+ESbMArouNPRwKBgCIuFGIrrMHF6IfPX5br4e6Y3J9aLnwZNsIdwK2/
oVXVj3t0w5VUEuyQJ5h+SP3yzvqX2lakvbNArXDyxpxCnKYkUQNGyIvDmvVE19/9
LKNEi2RtRi3s7bcnqBGwo7CX6ATAecxHNlLgjl2QW6ewUdpDd1GGMCV9958dEmyf
IlG9AoGBALGoE6E0QaVGcU9ntsKsT4xApwJChl7QaU7TYckzPs0EBB7jH0oOaSkd
pDM4Gd64XhDtRxYebBEFn3L1DZTKaaU7Pe7/TNhLYRO+BWGwMyh7bi4VEtD78Scq
eAOGWcv8yy0IrXIZnmDHJsGzhSngJrnXlHAhkLllVIfu0kHtL9x6
-----END RSA PRIVATE KEY-----
`;

// Function to generate the required headers for Kalshi API request
function generateAuthHeaders(method, path) {
  const timestamp = Date.now().toString();

  const stringToSign = timestamp + method.toUpperCase() + path;

  const signature = crypto.sign(
    'sha256',
    Buffer.from(stringToSign),
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    }
  ).toString('base64');

  return {
    'KALSHI-ACCESS-KEY': keyId,
    'KALSHI-ACCESS-TIMESTAMP': timestamp,
    'KALSHI-ACCESS-SIGNATURE': signature,
  };
}

// Example: Fetch market data for 'FED-MAR'
async function getMarketData(marketId) {
  const method = 'GET';
  const path = `/trade-api/v2/markets/${marketId}`;
  const headers = generateAuthHeaders(method, path);

  const url = `https://trade-api.kalshi.com${path}`;

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Market Data:', data);
  } catch (error) {
    console.error('Error fetching market data:', error);
  }
}

// Call with your market id, e.g., 'FED-MAR'
getMarketData('FED-MAR');