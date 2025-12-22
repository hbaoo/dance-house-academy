
import React from 'react';
import SimplePage from '../../components/SimplePage';

const Facilities: React.FC = () => {
    return (
        <SimplePage title="Cơ sở vật chất" subtitle="Không gian nghệ thuật đẳng cấp">
            <img src="https://images.unsplash.com/photo-1595596489422-7935de98fb69?q=80&w=1200" className="w-full h-64 object-cover rounded-3xl mb-8" alt="Studio" />

            <p>
                Dance House tự hào sở hữu hệ thống phòng tập tiêu chuẩn quốc tế, mang lại môi trường an toàn và chuyên nghiệp nhất cho học viên.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Sàn tập Harlequin:</strong> Sàn nhảy chuyên dụng giảm chấn thương, được các nhà hát hàng đầu thế giới tin dùng.</li>
                <li><strong>Hệ thống âm thanh vòm:</strong> Tạo cảm hứng tối đa trong từng buổi tập.</li>
                <li><strong>Khu vực chờ phụ huynh:</strong> Thoải mái, tiện nghi với màn hình quan sát lớp học trực tiếp.</li>
                <li><strong>Phòng thay đồ & Tắm:</strong> Sạch sẽ, riêng tư và hiện đại.</li>
            </ul>
        </SimplePage>
    );
};

export default Facilities;
