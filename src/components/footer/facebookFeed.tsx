import React from 'react';

export const FacebookFeed: React.FunctionComponent = () => {
  return (
    <section className="facebook-feed">
      <div className="facebook-container">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/Husetcafe"
          data-tabs="timeline"
          data-width="340"
          data-height=""
          data-small-header="false"
          data-adapt-container-width="false"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote
            cite="https://www.facebook.com/Husetcafe"
            className="fb-xfbml-parse-ignore"
          >
            <a href="https://www.facebook.com/Husetcafe">
              Huset Café &amp; Motell
            </a>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
