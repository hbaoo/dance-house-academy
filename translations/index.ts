
export const translations = {
    vi: {
        // Navbar
        home: "Trang chủ",
        classes: "Lớp học",
        boutique: "Cửa hàng",
        contact: "Liên hệ",
        register_now: "Đăng ký ngay",
        admin_portal: "Admin",

        // Hero
        subtitle: "Học viện Ballet hàng đầu",
        hero_title_prefix: "Nơi",
        hero_title_accent: "Nghệ thuật",
        hero_title_suffix: "Bắt đầu",
        hero_desc: "Chúng tôi nuôi dưỡng đam mê và rèn luyện kỹ năng múa chuyên nghiệp trong một không gian đầy cảm hứng và tình yêu thương.",
        learn_more: "Tìm hiểu thêm",
        visit_studio: "Tham quan Studio",
        hero_quote: "Nơi tuyệt vời nhất để bắt đầu hành trình nghệ thuật của con gái tôi.",

        // AI Advisor
        ai_title: "Tư vấn lớp học thông minh",
        ai_desc: "Hãy cho chúng tôi biết độ tuổi và mục tiêu của bạn để nhận gợi ý từ AI.",
        ai_placeholder: "Ví dụ: Con tôi 5 tuổi, muốn học múa cơ bản vào cuối tuần...",
        ai_send: "Gửi",

        // Classes
        schedule_label: "Lịch đào tạo",
        class_list_title: "Danh sách Lớp học",
        view_full_schedule: "Xem toàn bộ lịch",
        register_btn: "Đăng ký",

        // Boutique
        boutique_title: "The Boutique",
        boutique_subtitle: "Phụ kiện & Trang phục cao cấp",
        add_to_cart: "Thêm vào giỏ",

        // Footer
        discover: "Khám phá",
        programs: "Chương trình học",
        instructors: "Đội ngũ giảng viên",
        facilities: "Cơ sở vật chất",
        news: "Tin tức & Sự kiện",
        contact_info: "Thông tin liên hệ",
        view_map: "Xem bản đồ & gửi tin nhắn →",

        // Contact Page
        contact_title: "Liên hệ",
        contact_subtitle: "Kết nối với Dance House",
        contact_form_title: "Gửi tin nhắn cho chúng tôi",
        form_name: "Họ tên",
        form_email: "Email",
        form_message: "Nội dung",
        form_submit: "Gửi tin nhắn",
        address_label: "Địa chỉ Studio",
        email_label: "Email",
        hotline_label: "Hotline",
        hours_label: "Giờ làm việc",
        hours_value_1: "Thứ 2 - Thứ 6: 9:00 - 20:00",
        hours_value_2: "Thứ 7 - CN: 8:00 - 18:00",
        form_success: "Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất."
    },
    en: {
        // Navbar
        home: "Home",
        classes: "Classes",
        boutique: "Boutique",
        contact: "Contact",
        register_now: "Register Now",
        admin_portal: "Admin",

        // Hero
        subtitle: "Premium Ballet Academy",
        hero_title_prefix: "Where",
        hero_title_accent: "Art",
        hero_title_suffix: "Begins",
        hero_desc: "Nurturing passion and professional dance skills in an inspiring and loving environment.",
        learn_more: "Learn More",
        visit_studio: "Visit Studio",
        hero_quote: "The best place to start my daughter's artistic journey.",

        // AI Advisor
        ai_title: "Smart Class Advisor",
        ai_desc: "Tell us your age and goals to get recommendations from AI.",
        ai_placeholder: "Ex: My child is 5, wants basic ballet on weekends...",
        ai_send: "Send",

        // Classes
        schedule_label: "Training Schedule",
        class_list_title: "Class List",
        view_full_schedule: "View Full Schedule",
        register_btn: "Register",

        // Boutique
        boutique_title: "The Boutique",
        boutique_subtitle: "Premium Apparel & Accessories",
        add_to_cart: "Add to Cart",

        // Footer
        discover: "Discover",
        programs: "Programs",
        instructors: "Instructors",
        facilities: "Facilities",
        news: "News & Events",
        contact_info: "Contact Info",
        view_map: "View map & send message →",

        // Contact Page
        contact_title: "Contact Us",
        contact_subtitle: "Connect with Dance House",
        contact_form_title: "Send us a message",
        form_name: "Full Name",
        form_email: "Email",
        form_message: "Message",
        form_submit: "Send Message",
        address_label: "Studio Address",
        email_label: "Email",
        hotline_label: "Hotline",
        hours_label: "Working Hours",
        hours_value_1: "Mon - Fri: 9:00 - 20:00",
        hours_value_2: "Sat - Sun: 8:00 - 18:00",
        form_success: "Your message has been sent successfully! We will contact you soon."
    }
};

export type Language = 'vi' | 'en';
export type TranslationKeys = keyof typeof translations.vi;
