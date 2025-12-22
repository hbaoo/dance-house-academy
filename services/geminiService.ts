
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
// Only initialize if properly configured
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- Local Intelligence (Offline Fallback) ---
// This dataset acts as a static "knowledge base" for the fallback AI
const getLocalResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('giá') || q.includes('học phí') || q.includes('bao nhiêu')) {
    return "Học phí tại Dance House rất linh hoạt, dao động từ 1.500.000đ - 3.000.000đ/khóa tùy cấp độ. Bạn hãy để lại thông tin để bộ phận tư vấn gửi bảng giá chi tiết nhé! 💰";
  }

  if (q.includes('trẻ em') || q.includes('bé') || q.includes('con')) {
    return "Chúng mình có lớp 'Baby Ballet' cực yêu cho bé từ 4-6 tuổi và 'Pre-Ballet' cho bé 7-12 tuổi. Các lớp giúp bé rèn luyện vóc dáng và cảm thụ âm nhạc rất tốt ạ! 👼";
  }

  if (q.includes('lịch') || q.includes('giờ') || q.includes('khi nào')) {
    return "Studio mở cửa từ 8:00 - 21:00 hàng ngày. Lớp Ballet cơ bản thường có lịch vào tối 2-4-6 hoặc sáng cuối tuần. Bạn muốn học khung giờ nào nhỉ? ⏰";
  }

  if (q.includes('người lớn') || q.includes('cơ bản') || q.includes('bắt đầu')) {
    return "Chào bạn mới! Lớp 'Adult Ballet Basic' là lựa chọn hoàn hảo. Giáo trình được thiết kế riêng cho người mới bắt đầu, nhẹ nhàng nhưng hiệu quả. Mời bạn ghé studio học thử nha! 🩰";
  }

  if (q.includes('địa chỉ') || q.includes('ở đâu')) {
    return "Dance House tọa lạc tại trung tâm thành phố, không gian studio cực chill và chuyên nghiệp. Bạn xem bản đồ ở mục Liên hệ nhé! 📍";
  }

  // Default generic response
  return "Cảm ơn bạn đã quan tâm! Câu hỏi này hơi chuyên sâu, bạn vui lòng để lại sđt hoặc nhắn tin vào Fanpage để các giáo viên chuyên môn tư vấn kỹ hơn nhé! 💖";
};

export const getDanceAdvisorResponse = async (query: string) => {
  // 1. If no AI client, use Local immediately
  if (!ai) {
    console.warn("Gemini API Key missing. Using Local AI.");
    return getLocalResponse(query);
  }

  // 2. Try Online Models
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.0-pro',
    'gemini-pro'
  ];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Bạn là trợ lý AI duyên dáng của studio 'Dance House'. Khách hỏi: "${query}". 
        Hãy tư vấn lớp học phù hợp (Ballet cơ bản, Nâng cao, múa đương đại) một cách nhẹ nhàng, lịch sự. 
        Câu trả lời ngắn gọn dưới 100 từ tiếng Việt.`,
        config: { temperature: 0.8 }
      });
      return response.text || "AI đang suy nghĩ...";
    } catch (error: any) {
      // If error is 404 (Not Found) or 429 (Quota), try next model
      // We log but continue
      if (error?.status === 404 || error?.status === 429 || error?.toString().includes('404') || error?.toString().includes('429')) {
        continue;
      }
      // For other serious errors, break loop to fall back to local
      console.warn(`Gemini Error (${model}):`, error);
    }
  }

  // 3. Fallback to Local if all else fails
  console.warn("All online models failed. Switching to Local Fallback.");
  return getLocalResponse(query);
};