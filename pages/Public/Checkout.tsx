import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, User, Phone, Mail, MapPin, Loader2, ArrowLeft, QrCode, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../../contexts/ToastContext';
import { useSettings } from '../../contexts/SettingsContext';
import { generateVietQR } from '../../utils/vietqr';

interface Package {
  id: string;
  name: string;
  description: string;
  total_sessions: number;
  price: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const pkg = location.state?.package as Package;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Không tìm thấy gói học phí</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-4 text-rose-500 hover:underline"
          >
            Quay lại chọn gói
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderCode = Math.floor(Date.now() / 1000).toString();

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert([
          {
            order_code: orderCode,
            package_id: pkg.id,
            customer_name: formData.fullName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            amount: pkg.price,
            payment_gateway: 'vietqr',
            status: 'pending',
            metadata: {
              package_name: pkg.name,
              address: formData.address,
            },
          },
        ])
        .select()
        .single();

      if (txError) throw txError;

      // Generate VietQR
      const qrCode = generateVietQR({
        amount: pkg.price,
        description: `DH${orderCode}`,
        accountNo: settings.bank_account_no || '1040854619',
        accountName: settings.bank_account_name || 'LƯ HÙNG BẢO',
        bankId: settings.bank_id || 'VCB',
      });

      setPaymentData({
        orderCode,
        qrCode,
        transactionId: transaction.id,
        bankName: settings.bank_id || 'VCB',
        bankNo: settings.bank_account_no || '1040854619',
        bankAccountName: settings.bank_account_name || 'LƯ HÙNG BẢO',
      });

      showToast('Vui lòng quét mã QR để thanh toán!', 'success');
    } catch (error: any) {
      console.error('Payment creation failed:', error);
      showToast(error.message || 'Không thể tạo thanh toán', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Đã copy!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <button
          onClick={() => navigate('/packages')}
          className="flex items-center gap-2 text-slate-600 hover:text-rose-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại chọn gói khác
        </button>

        {!paymentData ? (
          /* Customer Information Form */
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-serif text-slate-900 mb-6">Thông tin khách hàng</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Họ và tên *
                  </label>
                  <div className="relative mt-2">
                    <User className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Email
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                      type="email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Số điện thoại *
                  </label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                      required
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Địa chỉ
                  </label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <textarea
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang tạo QR...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Tạo mã QR thanh toán
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-serif mb-6">Thông tin gói học</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{pkg.name}</p>
                      <p className="text-sm text-rose-100">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm text-rose-100 mb-1">Số buổi học</p>
                    <p className="text-2xl font-bold">{pkg.total_sessions} buổi</p>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-rose-100">Tổng thanh toán</span>
                      <span className="text-3xl font-bold">{(pkg.price / 1000000).toFixed(1)}M VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment QR Display */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif text-slate-900 mb-2">Quét mã QR để thanh toán</h2>
              <p className="text-slate-500 mb-8">Mở app ngân hàng và quét mã QR bên dưới</p>

              <div className="bg-slate-50 rounded-2xl p-8 mb-6">
                <img
                  src={paymentData.qrCode}
                  alt="VietQR Payment Code"
                  className="max-w-sm mx-auto"
                />
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Ngân hàng:</span>
                    <span className="font-bold text-slate-900">{paymentData.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Số tài khoản:</span>
                    <span className="font-bold text-slate-900">{paymentData.bankNo}</span>
                  </div>
                  <div className="flex justify-between items-center ">
                    <span className="text-slate-600">Tên chủ TK:</span>
                    <span className="font-bold text-slate-900 uppercase">{paymentData.bankAccountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Số tiền:</span>
                    <span className="font-bold text-rose-600">{pkg.price.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Nội dung:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">DH{paymentData.orderCode}</span>
                      <button
                        onClick={() => copyToClipboard(`DH${paymentData.orderCode}`)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-900">
                  <strong>Quan trọng:</strong> Vui lòng ghi đúng nội dung <strong>DH{paymentData.orderCode}</strong> khi chuyển khoản.
                  Sau khi chuyển khoản thành công, hệ thống sẽ tự động xác nhận trong vòng 24h.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Về trang chủ
                </button>
                <button
                  onClick={() => navigate(`/payment/success?orderCode=${paymentData.orderCode}`)}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all"
                >
                  Tôi đã chuyển khoản
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
