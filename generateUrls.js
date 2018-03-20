const fs = require('fs');

const generateUrls = function generateUrls(n) {
  const urls = [];
  for (let i = 0; i < n; i += 1) {
    const id = Math.floor(Math.random() * 10000000);
    urls.push(`/restaurants/${id}/`);
    urls.push(`/restaurants/${id}/bundle.js`);
    urls.push(`/api/restaurants/${id}/overview`);
  }
  return urls.join('\0');
};

fs.writeFile('wlog.log', generateUrls(100), (err) => {
  if (err) {
    console.log(`error: ${err}`);
  }
});

