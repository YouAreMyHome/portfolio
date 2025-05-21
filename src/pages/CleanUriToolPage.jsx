// src/pages/CleanUriToolPage.jsx
import React from 'react';
import CleanUriTool from '../components/CleanUriTool';

const CleanUriToolPage = () => {
  return (
    <section 
      id="clean-uri-tool-page" 
      className="min-h-[calc(100vh-4rem)]  // Đảm bảo chiều cao tối thiểu
                 flex flex-col items-center justify-center 
                 px-4 py-12 md:py-16 
                 pt-24 md:pt-28 // Tăng padding top để không bị nav che
                 bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 
                 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800
                 transition-colors duration-300"
    >
      <div className="w-full max-w-2xl"> {/* Giữ max-width cho content */}
        <CleanUriTool />
      </div>
    </section>
  );
};

export default CleanUriToolPage;