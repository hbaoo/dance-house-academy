
import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageSquareCode, Loader2 } from 'lucide-react';
// Corrected import member name from ClassItem to DanceClass
import { DanceClass } from '../types';
// Corrected import member name from getDanceRecommendation to getDanceAdvisorResponse
import { getDanceAdvisorResponse } from '../services/geminiService';
import { fetchClasses } from '../services/apiService';

const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState('Mon, Oct 24');
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  // Corrected type to DanceClass
  const [classList, setClassList] = useState<DanceClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const days = ['Mon, Oct 24', 'Tue, Oct 25', 'Wed, Oct 26', 'Thu, Oct 27', 'Fri, Oct 28'];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchClasses();
      if (data) {
        setClassList(data);
      } else {
        // Fallback data if API is not running, using correct property names and types
        setClassList([
          {
            id: 1,
            time: '4:00 PM',
            duration: '45 MIN',
            title: 'Pre-Ballet (Ages 3-5)',
            studio: 'Studio A',
            age_range: 'Introduction to Movement',
            instructor: { id: 1, name: 'Ms. Sarah', role: 'DIRECTOR', avatar: 'https://picsum.photos/seed/sarah/100/100' }
          }
        ]);
      }
      setIsLoading(false);
    };
    loadData();
  }, [activeDay]);

  const handleAiAsk = async () => {
    const goal = prompt("Tell us about your (or your child's) dance goals, age, and experience:");
    if (!goal) return;
    setIsAskingAi(true);
    // Using corrected function name
    const rec = await getDanceAdvisorResponse(goal);
    setAiMessage(rec || null);
    setIsAskingAi(false);
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl text-gray-900 mb-4">Class Schedule</h2>
          </div>
          <a href="#" className="text-sm font-bold uppercase tracking-widest text-[#FF4D8D] flex items-center gap-1 hover:gap-2 transition-all">
            Full Calendar <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="flex overflow-x-auto gap-4 mb-12 pb-4 no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-8 py-4 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeDay === day ? 'bg-[#FF4D8D] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-pink-200'
              }`}
            >
              {day}
            </button>
          ))}
          <button 
            onClick={handleAiAsk}
            disabled={isAskingAi}
            className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <MessageSquareCode className="w-4 h-4" />
            {isAskingAi ? 'Asking AI...' : 'Find My Perfect Class'}
          </button>
        </div>

        {aiMessage && (
          <div className="mb-12 p-8 bg-indigo-50 border border-indigo-100 rounded-[32px] flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm"><MessageSquareCode className="text-indigo-600 w-6 h-6" /></div>
            <div>
              <p className="font-bold text-indigo-900 text-sm uppercase tracking-widest mb-2">Personalized Recommendation</p>
              <p className="text-indigo-800 leading-relaxed">{aiMessage}</p>
              <button onClick={() => setAiMessage(null)} className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700">Dismiss</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="uppercase tracking-widest text-xs font-bold">Curating Schedule...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {classList.map((item) => (
              <div key={item.id} className="bg-[#FCF8F9] p-8 md:p-10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white hover:shadow-xl hover:shadow-pink-500/5 transition-all">
                <div className="flex items-center gap-12 w-full md:w-auto">
                  <div className="text-center md:text-left min-w-[120px]">
                    <p className="text-2xl font-bold text-[#FF4D8D] mb-1">{item.time}</p>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{item.duration}</p>
                  </div>
                  <div className="h-12 w-[1px] bg-gray-200 hidden md:block"></div>
                  <div>
                    <h3 className="text-2xl text-gray-800 mb-1">{item.title}</h3>
                    {/* Updated property access from ageRange to age_range */}
                    <p className="text-sm text-gray-400 font-light">{item.studio} • {item.age_range}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-start">
                  <div className="flex items-center gap-4">
                    <img src={item.instructor.avatar} alt={item.instructor.name} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.instructor.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.instructor.role}</p>
                    </div>
                  </div>
                  <button className="px-10 py-4 border-2 border-pink-100 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#FF4D8D] hover:bg-[#FF4D8D] hover:text-white transition-all">
                    Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Schedule;