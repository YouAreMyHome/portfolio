// src/components/CleanUriTool.jsx
import React, { useState, useRef } from 'react';
import { Link2, ArrowRight, Copy, Check, AlertTriangle, Loader2, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const CleanUriTool = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');
    setShortenedUrl('');
    setCopied(false);    if (!originalUrl.trim()) {
      setError(t('cleanUriTool.errors.emptyUrl'));
      setIsLoading(false);
      inputRef.current?.focus();
      return;
    }

    try {
      new URL(originalUrl); // Validate URL format
    } catch (_) {
      setError(t('cleanUriTool.errors.invalidUrl'));
      setIsLoading(false);
      inputRef.current?.focus();
      return;
    }

    try {
      // URL mới sử dụng tiền tố proxy
      const response = await fetch(`/api-cleanuri/api/v1/shorten`, { // << THAY ĐỔI Ở ĐÂY
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: originalUrl }),
      });
      const data = await response.json();      if (!response.ok) {
        throw new Error(data.error || `${t('cleanUriTool.errors.serverError')} ${response.status}`);
      }
      setShortenedUrl(data.result_url);
    } catch (err) {
      setError(err.message || t('cleanUriTool.errors.unexpectedError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortenedUrl && navigator.clipboard) {
      navigator.clipboard.writeText(shortenedUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(err => console.error(t('cleanUriTool.errors.copyError'), err));
    }
  };

  const clearInput = () => {
    setOriginalUrl('');
    setShortenedUrl('');
    setError('');
    setCopied(false);
    inputRef.current?.focus();
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                       text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                       dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-3 sm:mb-4">
          {t('cleanUriTool.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          {t('cleanUriTool.description')}
        </p>
      </div>

      {/* Main Tool Container */}
      <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl 
                      p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-300 antialiased
                      border border-gray-200/50 dark:border-gray-700/50">
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* URL Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none transition-colors duration-300
                            text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">
              <Link2 size={18} className="sm:w-5 sm:h-5" />
            </div>
            <input
              ref={inputRef}
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}              placeholder={t('cleanUriTool.inputPlaceholder')}
              required
              className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 rounded-xl 
                         bg-slate-100 dark:bg-slate-700 
                         text-gray-800 dark:text-gray-200 
                         border-2 border-transparent 
                         focus:border-blue-500 dark:focus:border-blue-400 
                         focus:ring-0 focus:outline-none 
                         transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 
                         text-sm sm:text-base shadow-sm focus:shadow-md"
              aria-label={t('cleanUriTool.inputPlaceholder')}
            />
            {originalUrl && (
              <button
                type="button"
                onClick={clearInput}                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
                aria-label={t('cleanUriTool.clearLabel')}
              >
                <XCircle size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
         
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 sm:h-14 flex items-center justify-center px-4 sm:px-6 py-3 rounded-xl 
                        font-semibold text-white text-sm sm:text-base lg:text-lg
                        transition-all duration-300 ease-in-out transform active:scale-[0.98]
                        focus:outline-none focus:ring-4 focus:ring-opacity-50
                        ${isLoading 
                          ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:ring-purple-400 dark:focus:ring-purple-600'
                        }
                        disabled:opacity-70`}
          >            {isLoading ? (
              <>
                <Loader2 size={20} className="sm:w-6 sm:h-6 animate-spin mr-2 sm:mr-3" />
                <span className="hidden sm:inline">{t('cleanUriTool.processing')}</span>
                <span className="sm:hidden">{t('cleanUriTool.processing')}</span>
              </>
            ) : (
              <>
                <span>{t('cleanUriTool.cleanButton')}</span>
                <ArrowRight size={18} className="sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div role="alert" className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg shadow-md transition-all duration-300">
            <div className="flex items-start sm:items-center">
              <AlertTriangle size={18} className="sm:w-5 sm:h-5 text-red-600 dark:text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-red-700 dark:text-red-300 text-sm sm:text-base leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Success Result */}
        {shortenedUrl && !error && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700 transition-all duration-300">            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-center sm:text-left">
              {t('cleanUriTool.successMessage')}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-100 dark:bg-slate-700/60 p-2 sm:p-3 rounded-xl shadow-sm space-y-2 sm:space-y-0 sm:space-x-3">
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow px-3 py-2 sm:py-3 font-mono text-blue-600 dark:text-blue-400 hover:underline break-all 
                           text-sm sm:text-base rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 text-center sm:text-left
                           transition-colors duration-200"
              >
                {shortenedUrl}
              </a>
              <button
                onClick={handleCopy}
                disabled={copied}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out 
                           flex items-center justify-center whitespace-nowrap min-w-[100px] sm:min-w-[120px]
                            ${copied 
                              ? 'bg-green-500 text-white cursor-default' 
                              : 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 text-white focus:ring-2 focus:ring-gray-400 focus:outline-none'
                            }`}
                aria-label={copied ? t('cleanUriTool.copied') : t('cleanUriTool.copyButton')}
              >                {copied ? (
                  <> 
                    <Check size={16} className="sm:w-[18px] sm:h-[18px] mr-1 sm:mr-2" /> 
                    <span className="hidden sm:inline">{t('cleanUriTool.copied')}</span>
                    <span className="sm:hidden">{t('cleanUriTool.copied')}</span>
                  </>
                ) : (
                  <> 
                    <Copy size={16} className="sm:w-[18px] sm:h-[18px] mr-1 sm:mr-2" /> 
                    <span className="hidden sm:inline">{t('cleanUriTool.copyButton')}</span>
                    <span className="sm:hidden">{t('cleanUriTool.copyButton')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanUriTool;