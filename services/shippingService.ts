const AHAMOVE_API_TOKEN = import.meta.env.VITE_AHAMOVE_API_TOKEN || '';
const BE_CLIENT_ID = import.meta.env.VITE_BE_CLIENT_ID || '';
const BE_CLIENT_SECRET = import.meta.env.VITE_BE_CLIENT_SECRET || '';
const STORE_ADDRESS = '123 Đường Bà Huyện Thanh Quan, Quận 3, TP.HCM'; // Địa chỉ mẫu của Dance House

export interface ShippingEstimate {
    fee: number;
    distance: number;
    duration: number;
    serviceName: string;
}

/**
 * Hàm ước tính phí ship qua beDelivery
 * Quy trình: Lấy Token -> Gọi API báo giá
 */
export const estimateBeShipping = async (customerAddress: string, serviceType: string): Promise<number> => {
    if (!BE_CLIENT_ID || !BE_CLIENT_SECRET) {
        console.warn('beDelivery credentials missing. Skipping real API.');
        return 0;
    }

    try {
        // Bước 1: Lấy Access Token (Giả lập theo luồng B2B thực tế)
        // const tokenRes = await fetch('https://api.be.com.vn/auth/v2/token', { ... });

        // Bước 2: Gọi API lấy báo giá
        // const quoteRes = await fetch('https://api.be.com.vn/delivery/v1/quotes', { ... });

        // Hiện tại trả về 0 để hệ thống dùng fallback cho đến khi có API thật
        return 0;
    } catch (error) {
        console.error('Lỗi khi tính phí ship beDelivery:', error);
        return 0;
    }
};

/**
 * Hàm ước tính phí ship qua AhaMove
 * Lưu ý: Đây là ví dụ về cấu trúc API thực tế. 
 * Trong thực tế bạn cần xử lý thêm phần Geocoding (chuyển địa chỉ sang tọa độ Lat/Long)
 */
export const estimateAhaMoveShipping = async (
    customerAddress: string,
    serviceId: string = 'SGN-BIKE' // Mặc định là xe máy tại Sài Gòn
): Promise<number> => {
    if (!AHAMOVE_API_TOKEN) {
        console.warn('AhaMove API Token is missing. Using fallback logic.');
        return 0;
    }

    try {
        // Bước 1: Gọi API để lấy khoảng cách và giá (Estimate)
        // Chi tiết tài liệu: https://docs.ahamove.com/
        const response = await fetch('https://api.ahamove.com/v1/order/estimated_fee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: AHAMOVE_API_TOKEN,
                order_time: 0,
                path: [
                    { address: STORE_ADDRESS },
                    { address: customerAddress }
                ],
                service_id: serviceId,
                requests: []
            })
        });

        if (!response.ok) {
            throw new Error('Không thể kết nối API AhaMove');
        }

        const data = await response.json();

        // Trả về phí ship cuối cùng sau khi cộng các loại phí
        return data.total_price || 0;

    } catch (error) {
        console.error('Lỗi khi tính phí ship AhaMove:', error);
        throw error;
    }
};

/**
 * Bản đồ chuyển đổi từ dịch vụ App sang Service ID của AhaMove
 */
export const mapServiceToAhaMove = (platform: string, serviceType: string): string => {
    // Đây là map mẫu, thực tế mỗi nền tảng sẽ có ID khác nhau
    // AhaMove hỗ trợ Bike, Truck, Van...
    if (platform === 'be' || platform === 'Grab' || platform === 'xanhSM') {
        switch (serviceType) {
            case 'express': return 'SGN-BIKE'; // Giao ngay
            case '2h': return 'SGN-2H';      // Giao 2h
            case '4h': return 'SGN-4H';      // Giao 4h
            default: return 'SGN-BIKE';
        }
    }
    return 'SGN-BIKE';
};
