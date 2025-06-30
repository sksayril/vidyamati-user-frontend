import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SponsorData {
  name: string;
  url: string;
  contextColor: string;
}

interface NotificationBannerProps {
  url?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ url }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [sponsorData, setSponsorData] = useState<SponsorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.vidyavani.com/api/getsponser');
        
        if (!response.ok) {
          throw new Error('Failed to fetch sponsor data');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSponsorData(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching sponsor data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsorData();
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent redirection when clicking the close button
    setIsVisible(false);
  };

  const handleClick = () => {
    const targetUrl = url || (sponsorData && sponsorData.url);
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  // Don't render anything if the banner is closed or no data is available
  if (!isVisible || isLoading || error || !sponsorData) return null;

  // Create style for using the hex color directly as background
  const bannerStyle: React.CSSProperties = {
    backgroundColor: sponsorData.contextColor,
  };

  return (
    <div
      className="relative px-4 py-3 cursor-pointer"
      style={bannerStyle}
      onClick={handleClick}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center pr-8">
          <p className="font-medium text-black">
            {sponsorData.name}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner; 