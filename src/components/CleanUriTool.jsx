// src/components/CleanUriTool.jsx
import React, { useState, useRef } from 'react';
import { Link2, ArrowRight, Copy, Check, AlertTriangle, Loader2, XCircle } from 'lucide-react';

const CleanUriTool = () => {
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
    setCopied(false);

    if (!originalUrl.trim()) {
      setError('Vui lòng nhập URL bạn muốn rút gọn.');
      setIsLoading(false);
      inputRef.current?.focus();
      return;
    }

    try {
      new URL(originalUrl); // Validate URL format
    } catch (_) {
      setError('URL không hợp lệ. Vui lòng kiểm tra lại.');
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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Lỗi ${response.status}: Không thể rút gọn liên kết này.`);
      }
      setShortenedUrl(data.result_url);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
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
        .catch(err => console.error('Lỗi sao chép:', err));
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
    <div className="w-full bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 antialiased">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold 
                       text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                       dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
          Rút Gọn Liên Kết
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Dán URL dài của bạn và nhận ngay một liên kết ngắn gọn, chuyên nghiệp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300
                          text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">
            <Link2 size={20} />
          </div>
          <input
            ref={inputRef}
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://www.example.com/url-rat-dai-cua-ban..."
            required
            className="w-full h-14 pl-12 pr-10 py-3 rounded-xl 
                       bg-slate-100 dark:bg-slate-700 
                       text-gray-800 dark:text-gray-200 
                       border-2 border-transparent 
                       focus:border-blue-500 dark:focus:border-blue-400 
                       focus:ring-0 focus:outline-none 
                       transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base shadow-sm focus:shadow-md"
            aria-label="URL gốc"
          />
          {originalUrl && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
              aria-label="Xóa nội dung"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
       
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full h-14 flex items-center justify-center px-6 py-3 rounded-xl 
                      font-semibold text-white text-base sm:text-lg
                      transition-all duration-300 ease-in-out transform active:scale-[0.98]
                      focus:outline-none focus:ring-4 focus:ring-opacity-50
                      ${isLoading 
                        ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:ring-purple-400 dark:focus:ring-purple-600'
                      }
                      disabled:opacity-70`}
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin mr-3" />
              Đang xử lý...
            </>
          ) : (
            <>
              Rút gọn ngay <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg shadow-md transition-all duration-300">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      {shortenedUrl && !error && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 transition-all duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center sm:text-left">
            🎉 Liên kết đã được rút gọn thành công!
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-100 dark:bg-slate-700/60 p-2 sm:p-3 rounded-xl shadow-sm">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow px-3 py-3 sm:py-2 font-mono text-blue-600 dark:text-blue-400 hover:underline break-all text-sm sm:text-base rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 text-center sm:text-left"
            >
              {shortenedUrl}
            </a>
            <button
              onClick={handleCopy}
              disabled={copied}
              className={`mt-2 sm:mt-0 sm:ml-2 px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center whitespace-nowrap min-w-[120px]
                          ${copied 
                            ? 'bg-green-500 text-white cursor-default' 
                            : 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 text-white focus:ring-2 focus:ring-gray-400 focus:outline-none'
                          }`}
              aria-label={copied ? "Đã sao chép!" : "Sao chép liên kết"}
            >
              {copied ? (
                <> <Check size={18} className="mr-2" /> Đã sao chép </>
              ) : (
                <> <Copy size={18} className="mr-2" /> Sao chép </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanUriTool;