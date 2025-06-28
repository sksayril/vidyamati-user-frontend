import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Share2 } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';

// Create the SocialMediaCarousel component
const SocialMediaCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  // Social media platforms with icons, colors, and links
  const socialPlatforms = [
    { 
      name: 'Facebook', 
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0c5bce]',
      icon: <FaFacebook className="w-6 h-6" />,
      link: 'https://facebook.com/Vidyavani ',
      followers: '50K+'
    },
    { 
      name: 'Instagram', 
      color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      hoverColor: 'hover:opacity-90',
      icon: <Instagram className="w-6 h-6" />,
      link: 'https://www.instagram.com/notes.market',
      followers: '45K+'
    },
    { 
      name: 'YouTube', 
      color: 'bg-[#FF0000]',
      hoverColor: 'hover:bg-[#cc0000]',
      icon: <Youtube className="w-6 h-6" />,
      link: 'https://youtube.com/Vidyavani ',
      followers: '100K+'
    },
    { 
      name: 'Twitter', 
      color: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#0c85d0]',
      icon: <Twitter className="w-6 h-6" />,
      link: 'https://twitter.com/Vidyavani ',
      followers: '20K+'
    },
    { 
      name: 'LinkedIn', 
      color: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#084d93]',
      icon: <Linkedin className="w-6 h-6" />,
      link: 'https://linkedin.com/company/Vidyavani ',
      followers: '15K+'
    },
    { 
      name: 'Pinterest', 
      color: 'bg-[#E60023]',
      hoverColor: 'hover:bg-[#b8001c]',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>,
      link: 'https://pinterest.com/Vidyavani ',
      followers: '10K+'
    },
    { 
      name: 'WhatsApp', 
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#1da84d]',
      icon: <MessageCircle className="w-6 h-6" />,
      link: 'https://whatsapp.com/channel/0029VbAgHAAGk1FjmR9p4v0V',
      followers: '30K+'
    },
    { 
      name: 'Telegram', 
      color: 'bg-[#0088cc]',
      hoverColor: 'hover:bg-[#006699]',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.224 17.871c.188.133.43.166.646.085.215-.082.374-.253.413-.484.331-1.94 1.14-6.868 1.432-8.635.024-.147-.015-.302-.105-.416-.09-.113-.224-.182-.368-.195-.4-.036-1.07-.087-1.84-.087-1.064 0-1.896.118-2.472.575-.696.556-.902 1.454-.8 2.848.028.384.408.585.718.401.128-.076.207-.216.229-.363.045-.296.093-.563.146-.796.052-.228.243-.412.475-.456.278-.053 1.074-.099 1.304-.099.316 0 .35.165.307.447-.135.847-.873 5.315-.949 5.786-.055.335-.342.529-.673.512-.34-.018-.653-.252-.729-.587-.13-.568-.401-1.685-.528-2.222-.066-.283-.211-.504-.435-.612-.225-.108-.47-.101-.684.034-.213.135-.34.372-.336.631.006.259.132.502.349.651.045.031.076.078.096.13.104.427.632 2.578.786 3.317.065.312.166.618.308.909zm-3.797-10.366c.11-.31.401-.092.591.051.19.143.256.38.145.591-.904 1.4-1.786 4.364-3.087 8.678-.069.227-.273.393-.506.405-.233.012-.449-.131-.537-.352-1.024-2.556-1.512-3.891-2.126-5.256-.053-.118-.1-.301-.145-.479-.111-.445.047-.734.267-.868.22-.134.485-.104.659.076 0 0 .178.161.316.483.138.323.348.87.545 1.638.458-1.422 2.738-7.809 3.873-4.967zm-5.111 6.352c.051-.198.241-.334.447-.318.205.016.375.173.399.378.042.35.081.708.117 1.073.24.254-.142.49-.393.523-.251.033-.484-.139-.545-.388-.075-.301-.151-.597-.227-.886-.047-.172-.005-.362.202-.382z" />
            </svg>,
      link: 'https://t.me/Vidyavani official',
      followers: '25K+'
    }
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'right' ? 250 : -250;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          setIsBeginning(scrollLeft <= 10);
          setIsEnd(scrollLeft + clientWidth >= scrollWidth - 10);
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsBeginning(scrollLeft <= 10);
      setIsEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50" aria-labelledby="social-media-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Share2 className="w-8 h-8 text-blue-600" />
            <h2 id="social-media-heading" className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connect With Us
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-6">Join our growing community of over 250K+ students</p>
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vidyavani
            </span>
            <span className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full">
              Official
            </span>
          </div>
        </div>
        
        <div className="relative">
          {/* Left Scroll Button */}
          <button 
            onClick={() => scrollCarousel('left')}
            className={`absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 focus:outline-none transition-all
                      ${isBeginning ? 'opacity-0 pointer-events-none' : 'hover:bg-white hover:scale-110'}`}
            disabled={isBeginning}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          
          {/* Social Media Carousel */}
          <div 
            ref={carouselRef}
            className="overflow-x-auto flex space-x-6 py-6 px-4 scrollbar-hide"
            onScroll={handleScroll}
          >
            {socialPlatforms.map((platform, index) => (
              <a
                key={`${platform.name}-${index}`}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-none group relative ${platform.color} ${platform.hoverColor} text-white p-6 rounded-2xl 
                          shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl
                          min-w-[200px] overflow-hidden`}
                aria-label={`Follow us on ${platform.name}`}
                onMouseEnter={() => setHoveredPlatform(platform.name)}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    {platform.icon}
                    <span className="font-semibold text-lg">{platform.name}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-white/80">Followers</div>
                    <div className="text-2xl font-bold">{platform.followers}</div>
                  </div>
                  <div className={`absolute bottom-4 right-4 transform transition-transform duration-300 ${hoveredPlatform === platform.name ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {/* Right Scroll Button */}
          <button 
            onClick={() => scrollCarousel('right')}
            className={`absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 focus:outline-none transition-all
                      ${isEnd ? 'opacity-0 pointer-events-none' : 'hover:bg-white hover:scale-110'}`}
            disabled={isEnd}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaCarousel;