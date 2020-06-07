import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

interface EventCarouselProps {
  images: string[];
}

export const EventCarousel: React.FunctionComponent<EventCarouselProps> = ({
  images,
}) => {
  return (
    <Carousel
      infiniteLoop
      centerMode
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      showArrows={false}
    >
      {images.map((image) => {
        return (
          <div>
            <img src={image} alt="from actual event" />
          </div>
        );
      })}
    </Carousel>
  );
};
