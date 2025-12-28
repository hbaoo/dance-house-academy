// TEST SIGNATURE GENERATION - Run this to verify your signature
// Copy this code to browser console or create a test.html file

const CryptoJS = require('crypto-js'); // Or use from CDN

const CHECKSUM_KEY = '2924a662928c9447f032b6a38f4364268c39888aac75de1ddb6fb5e786c4c6f5';

// Your actual request data
const testData = {
    amount: 2000000,
    buyerEmail: "zzbaozz98@gmail.com",
    buyerName: "Lư Hùng Bảo",
    buyerPhone: "0967788013",
    cancelUrl: "http://localhost:3000/payment/failed?orderCode=1766907716",
    description: "Thanh toán Gói Tháng - Dance House Academy",
    expiredAt: 1766908617,
    items: [{ name: "Gói Tháng", quantity: 1, price: 2000000 }],
    orderCode: 1766907716,
    returnUrl: "http://localhost:3000/payment/success?orderCode=1766907716"
};

// PayOS Official Algorithm
function sortObjDataByKey(object) {
    const orderedObject = Object.keys(object)
        .sort()
        .reduce((obj, key) => {
            obj[key] = object[key];
            return obj;
        }, {});
    return orderedObject;
}

function convertObjToQueryStr(object) {
    return Object.keys(object)
        .filter((key) => object[key] !== undefined)
        .map((key) => {
            let value = object[key];
            // Sort nested array
            if (value && Array.isArray(value)) {
                value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
            }
            // Set empty string if null
            if ([null, undefined, 'undefined', 'null'].includes(value)) {
                value = '';
            }
            return `${key}=${value}`;
        })
        .join('&');
}

// Generate signature
const sortedData = sortObjDataByKey(testData);
const dataQueryStr = convertObjToQueryStr(sortedData);
const signature = CryptoJS.HmacSHA256(dataQueryStr, CHECKSUM_KEY).toString();

console.log('=== SIGNATURE VERIFICATION ===');
console.log('1. Sorted data:', sortedData);
console.log('2. Data query string:', dataQueryStr);
console.log('3. Generated signature:', signature);
console.log('4. Your signature:', '393d0760e365bfe993664c5724f4be68e42c66c9557b983b837e9e4f8eb77af5');
console.log('5. Match?', signature === '393d0760e365bfe993664c5724f4be68e42c66c9557b983b837e9e4f8eb77af5');

// To verify, also log each step
console.log('\n=== STEP BY STEP ===');
Object.keys(sortedData).forEach(key => {
    let value = sortedData[key];
    if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
    }
    console.log(`${key}=${value}`);
});
