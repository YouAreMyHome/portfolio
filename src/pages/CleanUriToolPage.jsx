// src/pages/CleanUriToolPage.jsx
import React from 'react';
import CleanUriTool from '../components/CleanUriTool';

const CleanUriToolPage = () => {
  return (
    <section 
      id="clean-uri-tool-page" 
      className="min-h-screen flex flex-col items-center justify-center 
                 pt-20 sm:pt-24 pb-8 sm:pb-12
                 bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 
                 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800
                 transition-colors duration-300"
    >
      <CleanUriTool />
    </section>
  );
};

export default CleanUriToolPage;