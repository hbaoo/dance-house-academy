// VietQR utility for generating QR codes
// Based on VietQR API: https://vietqr.io

interface VietQROptions {
    amount: number;
    description: string;
    accountNo?: string;
    accountName?: string;
    bankId?: string;
}

export const generateVietQR = (options: VietQROptions): string => {
    const {
        amount,
        description,
        accountNo = '1234567890', // Default - replace with actual account
        accountName = 'DANCE HOUSE ACADEMY',
        bankId = 'VCB', // Vietcombank
    } = options;

    // VietQR API endpoint
    const params = new URLSearchParams({
        accountNo,
        accountName,
        acqId: bankId,
        amount: amount.toString(),
        addInfo: description,
        format: 'text',
        template: 'compact',
    });

    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${encodeURIComponent('compact')}.png?${params.toString()}`;
};
