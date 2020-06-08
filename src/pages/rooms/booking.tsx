import React from 'react';
import { useTranslation } from 'react-i18next';

export const RoomBooking: React.FunctionComponent = () => {
  const { t } = useTranslation(['translation', 'rooms']);
  return (
    <section className="room-booking">
      <div className="room-booking__mobile">
        <a
          href="https://www.booking.com/hotel/no/huset-cafe-amp-motell-as.en-gb.html"
          className="button"
        >
          {t('rooms:book-btn')}
        </a>
      </div>
    </section>
  );
};
