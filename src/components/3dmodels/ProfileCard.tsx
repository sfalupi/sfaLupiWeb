import React, { useState } from 'react';

interface Model3D {
  id: string;
  data: {
    title: string;
    image?: any;
    images?: any[]; // Multiple images for gallery
    imageAlt?: string;
    modelType?: string;
    software?: string;
    polyCount?: number;
    textures?: boolean;
    rigged?: boolean;
    animated?: boolean;
    formats?: string[];
    downloadLink?: string;
  };
}

interface TabData {
  id: string;
  label: string;
  content: string;
  models?: Model3D[];
}

interface ProfileCardProps {
  tabsData: TabData[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ tabsData }) => {
  // Set first available section as default (since we removed "about")
  const [expandedSections, setExpandedSections] = useState<string[]>([tabsData[0]?.id || 'weapons-and-tools']);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImages.length]);

  // Prevent body scroll when lightbox is open
  React.useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  const openLightbox = (model: Model3D) => {
    // Get all images for this model (main image + gallery images)
    const allImages = [];
    if (model.data.image) allImages.push(model.data.image);
    if (model.data.images) allImages.push(...model.data.images);
    
    setCurrentImages(allImages);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const renderSectionContent = (section: TabData) => {
    // Only handle model type sections now (no more about section)
    if (section.content === 'weapons-and-tools' || 
        section.content === 'items' || 
        section.content === 'mobs' ||
        section.content === 'blocks' ||
        section.content === 'miscellaneous'||
        section.content === 'commissions') {
      if (!section.models || section.models.length === 0) {
        return (
          <div className="text-center py-4">
            <p className="text-txt-s dark:text-darkmode-txt-s">No models in this category yet.</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {section.models.map((model) => (
            <div key={model.id} className="glass-t rounded-lg p-4 hover:opacity-90 transition-opacity border border-border dark:border-darkmode-border">
              {model.data.image && (
                <div 
                  className="aspect-square mb-3 rounded-lg overflow-hidden bg-bg-t dark:bg-darkmode-bg-t cursor-pointer relative group"
                  onClick={() => openLightbox(model)}
                >
                  <img 
                    src={model.data.image.src} 
                    alt={model.data.imageAlt || model.data.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {/* Click to view indicator */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-70 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <h3 className="font-semibold text-txt-p dark:text-darkmode-txt-p mb-2 text-lg text-center">
                {model.data.title}
              </h3>
              <div className="space-y-1 text-sm text-txt-s dark:text-darkmode-txt-s text-center">
                {model.data.software && (
                  <p><span className="font-medium">Software:</span> {model.data.software}</p>
                )}
                {model.data.polyCount && (
                  <p><span className="font-medium">Polygons:</span> {model.data.polyCount.toLocaleString()}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {model.data.textures && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                      Textured
                    </span>
                  )}
                  {model.data.rigged && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                      Rigged
                    </span>
                  )}
                  {model.data.animated && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                      Animated
                    </span>
                  )}
                </div>
                {model.data.formats && model.data.formats.length > 0 && (
                  <p className="mt-2">
                    <span className="font-medium">Formats:</span> {model.data.formats.join(', ')}
                  </p>
                )}
                {model.data.downloadLink && (
                  <div className="mt-2 text-center">
                    <a 
                      href={model.data.downloadLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-txt-p dark:bg-darkmode-txt-p text-bg-p dark:text-darkmode-bg-p rounded text-sm hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // If somehow an unknown section type is passed, return empty
    return (
      <div className="text-center py-4">
        <p className="text-txt-s dark:text-darkmode-txt-s">Content not available.</p>
      </div>
    );
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-4">
        <div className="glass rounded-lg p-6 md:p-8 min-h-0">
          <div className="space-y-4">
            {tabsData.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              
              return (
                <div key={section.id} className="border-b border-border dark:border-darkmode-border last:border-b-0">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-center py-4 hover:opacity-80 transition-opacity relative"
                  >
                    <h2 className="text-xl font-semibold text-txt-p dark:text-darkmode-txt-p text-center">
                      {section.label}
                    </h2>
                    
                    {/* Expand/Collapse Arrow - Positioned to the right */}
                    <svg 
                      className={`w-5 h-5 text-txt-s dark:text-darkmode-txt-s transition-transform duration-200 absolute right-0 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Section Content - Remove height restrictions */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pb-6">
                      {renderSectionContent(section)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-8"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-6xl max-h-full w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right Outside */}
            <button
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 z-10 text-white bg-red-600 hover:bg-red-700 rounded-full p-3 transition-all shadow-lg"
              title="Close (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Image Container */}
            <div className="relative flex items-center justify-center w-full max-w-6xl">
              {/* Image */}
              {currentImages[currentImageIndex] && (
                <div className="relative">
                  <img
                    src={currentImages[currentImageIndex].src}
                    alt="Model preview"
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                    style={{
                      imageRendering: 'pixelated',
                    }}
                  />
                  
                  {/* Left Arrow - Inside Image */}
                  {currentImages.length > 1 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-all shadow-lg z-10"
                      title="Previous (←)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Right Arrow - Inside Image */}
                  {currentImages.length > 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-all shadow-lg z-10"
                      title="Next (→)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls - Outside Image */}
            {currentImages.length > 1 && (
              <div className="mt-6 flex items-center gap-4 bg-gray-800 bg-opacity-90 px-6 py-3 rounded-full">
                <span className="text-white text-sm font-medium">
                  {currentImageIndex + 1} / {currentImages.length}
                </span>
                
                {/* Dot indicators */}
                <div className="flex gap-2">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white scale-110' 
                          : 'bg-gray-400 hover:bg-gray-300 hover:scale-105'
                      }`}
                      title={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;