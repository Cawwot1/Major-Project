import '../../styles/main.css'
import React from 'react';

export default function NewsSection() {
  return (
    <div id="news-section">
      <div id="news-heading">
        <p id="news-heading-text">Current News</p>
      </div>
      <div className="container-fluid" id="news-container">
        <div id="news-content">
          <NewsRow>
            <NewsCard title="News Item 1" imageSrc="/Wish-Upon-A-Star.jpg" />
            <NewsCard title="News Item 2" imageSrc="/Wish-Upon-A-Star.jpg" />
          </NewsRow>
          <NewsRow>
            {/* Pass the id prop here for the image */}
            <NewsCard title="News Item 3" imageSrc="/Wish-Upon-A-Star.jpg" id="news-image-100" />
          </NewsRow>
        </div>
      </div>
    </div>
  );
}

export function NewsRow({ children }) {
  return <div className="news-row-container">{children}</div>;
}

export function NewsCard({ title, imageSrc, id }) {
  return (
    <div className="news-objects">
      <div className="news-object-background">
        {/* Apply the id to the img */}
        <img src={imageSrc} className="news-image" alt={title} id={id} />
        <div className="news-text">{title}</div>
        <div className="news-button-container">
          <button type="button" className="btn btn-outline-primary" id="news-button">
            Go to News
          </button>
        </div>
      </div>
    </div>
  );
}
