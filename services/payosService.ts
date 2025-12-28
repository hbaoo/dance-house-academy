import CryptoJS from 'crypto-js';

const PAYOS_CLIENT_ID = import.meta.env.VITE_PAYOS_CLIENT_ID;
const PAYOS_API_KEY = import.meta.env.VITE_PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = import.meta.env.VITE_PAYOS_CHECKSUM_KEY;

export interface PayOSPaymentData {
    orderCode: number;
    amount: number;
    description: string;
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    returnUrl: string;
    cancelUrl: string;
}

export interface PayOSPaymentResponse {
    code: string;
    desc: string;
    data: {
        bin: string;
        accountNumber: string;
        accountName: string;
        amount: number;
        description: string;
        orderCode: number;
        currency: string;
        paymentLinkId: string;
        status: string;
        checkoutUrl: string;
        qrCode: string;
    };
}

// Sort object keys alphabetically (from PayOS official code)
function sortObjDataByKey(object: any): any {
    const orderedObject = Object.keys(object)
        .sort()
        .reduce((obj: any, key) => {
            obj[key] = object[key];
            return obj;
        }, {});
    return orderedObject;
}

// Convert object to query string (from PayOS official code)
function convertObjToQueryStr(object: any): string {
    return Object.keys(object)
        .filter((key) => object[key] !== undefined)
        .map((key) => {
            let value = object[key];
            // Sort nested array of objects
            if (value && Array.isArray(value)) {
                value = JSON.stringify(value.map((val: any) => sortObjDataByKey(val)));
            }
            // Set empty string if null
            if ([null, undefined, 'undefined', 'null'].includes(value)) {
                value = '';
            }
            return `${key}=${value}`;
        })
        .join('&');
}

// Generate signature using PayOS official algorithm
function generateSignature(data: any, checksumKey: string): string {
    const sortedDataByKey = sortObjDataByKey(data);
    const dataQueryStr = convertObjToQueryStr(sortedDataByKey);

    console.log('Signature data string (PayOS official):', dataQueryStr);

    // Use CryptoJS for browser (equivalent to createHmac in Node.js)
    return CryptoJS.HmacSHA256(dataQueryStr, checksumKey).toString();
}

// Create payment link
export const createPayOSPayment = async (paymentData: PayOSPaymentData): Promise<PayOSPaymentResponse> => {
    try {
        // PayOS requires expiredAt timestamp
        const expiredAt = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes from now

        const requestData: any = {
            orderCode: paymentData.orderCode,
            amount: paymentData.amount,
            description: paymentData.description,
            items: paymentData.items,
            returnUrl: paymentData.returnUrl,
            cancelUrl: paymentData.cancelUrl,
            expiredAt: expiredAt,
        };

        // Add buyer info only if email is provided
        if (paymentData.buyerEmail) {
            requestData.buyerName = paymentData.buyerName;
            requestData.buyerEmail = paymentData.buyerEmail;
            requestData.buyerPhone = paymentData.buyerPhone;
        }

        // Generate signature using official PayOS algorithm
        const signature = generateSignature(requestData, PAYOS_CHECKSUM_KEY);
        requestData.signature = signature;

        console.log('PayOS Request (with official signature):', requestData);

        const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': PAYOS_CLIENT_ID,
                'x-api-key': PAYOS_API_KEY,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        console.log('PayOS Full Response:', result);

        if (!response.ok || result.code !== '00') {
            throw new Error(result.desc || 'Failed to create payment');
        }

        return result;
    } catch (error) {
        console.error('PayOS payment creation failed:', error);
        throw error;
    }
};

// Check payment status
export const getPaymentStatus = async (orderCode: number): Promise<any> => {
    try {
        const response = await fetch(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, {
            method: 'GET',
            headers: {
                'x-client-id': PAYOS_CLIENT_ID,
                'x-api-key': PAYOS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get payment status');
        }

        return await response.json();
    } catch (error) {
        console.error('PayOS status check failed:', error);
        throw error;
    }
};

// Generate order code (must be unique number)
export const generateOrderCode = (): number => {
    return Math.floor(Date.now() / 1000);
};
