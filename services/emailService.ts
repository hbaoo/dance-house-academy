
/**
 * Email Service
 * Recommended provider: Resend (resend.com)
 * This service handles sending confirmation emails to customers.
 */

interface EmailTemplateProps {
    customerName: string;
    orderCode: string;
    itemName: string;
    amount: number;
}

export const sendOrderConfirmationEmail = async ({ customerName, orderCode, itemName, amount }: EmailTemplateProps) => {
    // NOTE: In a production environment, this should ideally be called from a 
    // secure backend or Supabase Edge Function to protect your API Key.

    console.log(`Sending confirmation email to ${customerName} for order ${orderCode}...`);

    // This is a placeholder for actual Resend integration.
    // To enable, you would need a Resend API Key.
    const RESEND_API_KEY = (import.meta as any).env.VITE_RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.warn("VITE_RESEND_API_KEY is missing. Mocking email delivery.");
        return { success: true, message: "Mock email sent" };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Dance House <notifications@dancehouse.com>',
                to: ['customer@example.com'], // In real app, use order.customer_email
                subject: `[Dance House] Xác nhận thanh toán thành công #${orderCode}`,
                html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f43f5e;">Thanh toán thành công!</h2>
            <p>Xin chào ${customerName},</p>
            <p>Cảm ơn bạn đã tin tưởng Dance House. Chúng tôi xác nhận bạn đã thanh toán thành công cho:</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Khóa học/Sản phẩm:</strong> ${itemName}</p>
              <p><strong>Mã đơn hàng:</strong> ${orderCode}</p>
              <p><strong>Số tiền:</strong> ${amount.toLocaleString('vi-VN')} VND</p>
            </div>
            <p>Hẹn gặp lại bạn tại Studio!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">Dance House Premium Ballet Academy</p>
          </div>
        `,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};
