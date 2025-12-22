
import React from 'react';
import SimplePage from '../../components/SimplePage';

const Programs: React.FC = () => {
    return (
        <SimplePage title="Chương trình học" subtitle="Nuôi dưỡng tài năng từ bước chân đầu tiên">
            <p>
                Tại Dance House, chúng tôi xây dựng lộ trình đào tạo bài bản từ cơ bản đến nâng cao, phù hợp với mọi lứa tuổi.
            </p>

            <h3 className="text-2xl serif mt-8 mb-4">1. Lớp Ballet Trẻ em (4-6 tuổi)</h3>
            <p>Làm quen với âm nhạc, cử động và sự mềm mại. Giúp trẻ phát triển tư duy nghệ thuật và sự tự tin.</p>

            <h3 className="text-2xl serif mt-8 mb-4">2. Ballet Căn bản (7-12 tuổi)</h3>
            <p>Rèn luyện kỹ thuật, tư thế và kỷ luật. Học sinh bắt đầu làm quen với các động tác cơ bản tại gióng (barre).</p>

            <h3 className="text-2xl serif mt-8 mb-4">3. Chương trình Chuyên nghiệp (13+ tuổi)</h3>
            <p>Đào tạo chuyên sâu dành cho những học viên có định hướng theo đuổi nghệ thuật múa chuyên nghiệp. Bao gồm kỹ thuật Pointe, Pas de Deux và các biến thể cổ điển.</p>
        </SimplePage>
    );
};

export default Programs;
