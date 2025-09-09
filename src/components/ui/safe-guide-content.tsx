"use client";
import { useEffect } from 'react';
import { InstagramEmbed } from './instagram-embed';

interface SafeGuideContentProps {
  guide: any;
}

export function SafeGuideContent({ guide }: SafeGuideContentProps) {
  // Log validation warnings in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Guide content validation for:', guide?.slug);
    }
  }, [guide]);

  if (!guide) return null;

  const extractValidGuidePoints = (guide: any) => {
    const points = [];
    
    // Process guide points from gp_1_type to gp_60_type
    for (let i = 1; i <= 60; i++) {
      const typeField = `gp_${i}_type`;
      const dataField = `gp_${i}_data_de`;
      const subDataField = `gp_${i}_sub_data_de`;
      
      const type = guide[typeField];
      const data = guide[dataField] || guide[`gp_${i}_data`]; // Fallback to English if German not available
      const subData = guide[subDataField] || guide[`gp_${i}_sub_data`]; // Fallback to English if German not available
      
      if (!type || !data) continue;
      
      points.push({
        index: i,
        type,
        data,
        subData
      });
    }
    
    return points;
  };

  const renderContent = () => {
    const elements = [];
    
    // Add main description
    if (guide.long_desc_de || guide.long_desc_en) {
      const contentText = guide.long_desc_de || guide.long_desc_en;
      elements.push(
        <div 
          key="description" 
          className="mb-6"
          dangerouslySetInnerHTML={{ __html: contentText }}
        />
      );
    }
    
    // Use the validated guide points extractor
    const validPoints = extractValidGuidePoints(guide);
    
    validPoints.forEach((point) => {
      
      if (point.type === 'topic') {
        elements.push(
          <div key={`topic-${point.index}`} className="mb-8">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">{point.data}</h2>
            {point.subData && (
              <div 
                className="mb-6 text-base leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: point.subData }}
              />
            )}
          </div>
        );
      } else if (point.type === 'point') {
        elements.push(
          <div key={`point-${point.index}`} className="mb-6">
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{point.data}</h3>
            {point.subData && (
              <div 
                className="mb-4 text-base leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: point.subData }}
              />
            )}
          </div>
        );
      } else if (point.type === 'embed') {
        if (point.data && point.data.includes('instagram.com')) {
          elements.push(
            <InstagramEmbed
              key={`embed-${point.index}`}
              embedUrl={point.data}
              mode="auto-load"
            />
          );
        }
      } else if (point.type === 'info') {
        elements.push(
          <div key={`info-${point.index}`} className="my-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-blue-800">{point.data}</p>
          </div>
        );
      }
    });
    
    return elements;
  };

  return <div>{renderContent()}</div>;
}
