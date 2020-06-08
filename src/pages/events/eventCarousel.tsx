import React from 'react';
import { Image } from 'cloudinary-react';
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
            <Image
              cloudName="huset-cafe-og-motell"
              publicId={`events/${image}`}
              crop="scale"
              height="300"
              width="300"
            />
          </div>
        );
      })}
    </Carousel>
  );
};
