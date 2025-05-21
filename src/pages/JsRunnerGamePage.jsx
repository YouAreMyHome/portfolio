// src/pages/JsRunnerGamePage.jsx
import React, { useState } from 'react';
import JsRunnerGame from '../components/JsRunnerGame';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Giả sử bạn vẫn muốn nút Show/Hide

const JsRunnerGamePage = () => {
  // State để quản lý hiển thị game có thể đặt ở đây nếu muốn

  return (
    <section id="fun-game-page" className="py-12 md:py-16 bg-slate-100 dark:bg-gray-800 min-h-[calc(100vh-4rem)] flex flex-col items-center pt-24"> {/* Thêm pt-24 để không bị nav che */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white inline-block">
            Mini Game Zone: Cat Run
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 sm:p-8 lg:p-10">
            <div className="flex justify-center items-start pt-4 pb-8">
              <JsRunnerGame />
            </div>
        </div>
      </div>
    </section>
  );
};

export default JsRunnerGamePage;