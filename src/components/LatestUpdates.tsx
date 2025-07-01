import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X, ArrowRight } from 'lucide-react';

interface Update {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  readTime?: string;
  isTop?: boolean;
  content?: string;
}

const LatestUpdates = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch updates from API
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.vidyavani.com/api/latest-updates');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Sort updates to prioritize isTop:true items
        const sortedUpdates = (result.data || []).sort((a: Update, b: Update) => {
          // If a is top and b is not, a comes first
          if (a.isTop && !b.isTop) return -1;
          // If b is top and a is not, b comes first
          if (!a.isTop && b.isTop) return 1;
          // Otherwise, keep original order
          return 0;
        });
        
        setUpdates(sortedUpdates);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch updates:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch updates');
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Set up auto-scrolling
  useEffect(() => {
    if (isAutoPlay && updates.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % updates.length);
        if (scrollRef.current) {
          const nextCard = scrollRef.current.children[
            (activeIndex + 1) % updates.length
          ] as HTMLElement;
          if (nextCard) {
            scrollRef.current.scrollTo({
              left: nextCard.offsetLeft - 20,
              behavior: 'smooth'
            });
          }
        }
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [activeIndex, isAutoPlay, updates.length]);

  const handlePrevious = () => {
    setIsAutoPlay(false);
    setActiveIndex((prevIndex) => (prevIndex === 0 ? updates.length - 1 : prevIndex - 1));

    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);

    if (scrollRef.current) {
      const prevCard = scrollRef.current.children[
        activeIndex === 0 ? updates.length - 1 : activeIndex - 1
      ] as HTMLElement;
      if (prevCard) {
        scrollRef.current.scrollTo({
          left: prevCard.offsetLeft - 20,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveIndex((prevIndex) => (prevIndex + 1) % updates.length);

    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);

    if (scrollRef.current) {
      const nextCard = scrollRef.current.children[
        (activeIndex + 1) % updates.length
      ] as HTMLElement;
      if (nextCard) {
        scrollRef.current.scrollTo({
          left: nextCard.offsetLeft - 20,
          behavior: 'smooth'
        });
      }
    }
  };

  const openUpdateModal = (update: Update) => {
    setSelectedUpdate(update);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeUpdateModal = () => {
    setSelectedUpdate(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  if (loading) {
    return (
      <div className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-blue-600">
              LATEST UPDATES
            </h2>
          </div>
          <div className="flex justify-center items-center h-48 md:h-64">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-blue-600">
              LATEST UPDATES
            </h2>
          </div>
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>Failed to load updates. Please try again later.</p>
            <p className="text-sm mt-2">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-blue-600">
              LATEST UPDATES
            </h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>No updates available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div
            className="flex space-x-6 md:space-x-8 overflow-x-auto pb-6 hide-scrollbar scroll-smooth"
            ref={scrollRef}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {updates.map((update, index) => (
              <div
                key={update._id}
                className={`group min-w-[320px] md:min-w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-3 hover:shadow-3xl cursor-pointer relative ${
                  index === activeIndex ? 'ring-4 ring-blue-500/30 scale-105' : ''
                }`}
                onClick={() => openUpdateModal(update)}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
                
                {/* Image Section with Enhanced Effects */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  <img
                    src={update.image}
                    alt={update.title}
                    className="w-full h-48 md:h-56 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Premium Badges */}
                  {update.isTop && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        <span className="flex items-center gap-1">
                          ⭐ TOP
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {index === activeIndex && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                        ✨ NEW
                      </div>
                    </div>
                  )}
                  
                  {/* Floating Action Button */}
                  <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Content Section with Premium Styling */}
                <div className="p-6 md:p-8 relative">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-50 transform translate-x-16 -translate-y-16"></div>
                  
                  {/* Tags and Meta Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                      Study Material
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {update.readTime || '10 min read'}
                    </div>
                  </div>
                  
                  {/* Title with Better Typography */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {update.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-gray-600 text-base mb-6 leading-relaxed line-clamp-3">
                    {update.subtitle}
                  </p>
                  
                  {/* Footer with Enhanced Design */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium">{update.date}</span>
                    </div>
                    <button className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <span className="flex items-center gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {updates.length > 1 && (
            <>
              <button
                className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Premium Indicator dots */}
              <div className="flex justify-center mt-8 space-x-4">
                {updates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsAutoPlay(false);

                      setTimeout(() => {
                        setIsAutoPlay(true);
                      }, 10000);

                      if (scrollRef.current) {
                        const selectedCard = scrollRef.current.children[index] as HTMLElement;
                        if (selectedCard) {
                          scrollRef.current.scrollTo({
                            left: selectedCard.offsetLeft - 20,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }}
                    className={`transition-all duration-300 ${
                      index === activeIndex 
                        ? 'w-12 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg transform scale-110' 
                        : 'w-4 h-4 bg-gray-300 rounded-full hover:bg-gray-400 hover:scale-110'
                    }`}
                  ></button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Update Modal Popup - Enhanced Mobile Responsive */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-2 md:p-4 animate-fadeIn" onClick={closeUpdateModal}>
          <div
            className="bg-white w-full max-w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-scaleIn relative sm:rounded-xl overflow-y-auto overscroll-contain touch-manipulation scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with enhanced close button */}
            <div className="flex justify-between items-center p-4 md:p-4 border-b bg-white sticky top-0 z-10">
              <h2 className="text-base md:text-xl font-bold line-clamp-1 pr-4 flex-1">{selectedUpdate.title}</h2>
              <button
                onClick={closeUpdateModal}
                className="flex-shrink-0 p-3 md:p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 md:w-6 md:h-6 text-gray-700" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow">
              {/* Single Image */}
              <div className="relative">
                <img
                  src={selectedUpdate.image}
                  alt={selectedUpdate.title}
                  className="w-full h-48 md:h-64 lg:h-72 object-cover"
                />
                {selectedUpdate.isTop && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    TOP
                  </div>
                )}
              </div>

              {/* Update Content */}
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap items-center mb-4 gap-2 md:gap-4">
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                    Study Material
                  </span>
                  <div className="text-gray-500 text-xs md:text-sm flex items-center">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {selectedUpdate.date}
                  </div>
                  <div className="text-gray-500 text-xs md:text-sm flex items-center">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {selectedUpdate.readTime || '5 min read'}
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-sm md:prose-base prose-blue max-w-none">
                  {selectedUpdate.content}
                </div>

                <div className="mt-4 md:mt-6 flex justify-center">
                  {/* Button placeholder for potential actions */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestUpdates;