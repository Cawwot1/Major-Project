import '../../styles/main.css';
import React from 'react';

export default function NewsSection() {
  return (
    <div id="news-section">
      <div id="news-heading">
        <p id="news-heading-text">Current News</p>
      </div>

      <div className="container-fluid" id="news-container">
        <div id="news-content">
          {/* First Row */}
          <div className="news-row-container">
            <div className="news-objects">
              <div className="news-object-background">
                <img src="/Wish-Upon-A-Star.jpg" className="news-image" alt="News Item 1" />
                <div className="news-text">News Item 1</div>
                <div className="news-button-container">
                  <button type="button" className="btn btn-outline-primary" id="news-button">
                    Go to News
                  </button>
                </div>
              </div>
            </div>

            <div className="news-objects">
              <div className="news-object-background">
                <img src="/Wish-Upon-A-Star.jpg" className="news-image" alt="News Item 2" />
                <div className="news-text">News Item 2</div>
                <div className="news-button-container">
                  <button type="button" className="btn btn-outline-primary" id="news-button">
                    Go to News
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="news-row-container">
            <div className="news-objects">
              <div className="news-object-background">
                <img
                  src="/Wish-Upon-A-Star.jpg"
                  className="news-image"
                  alt="News Item 3"
                  id="news-image-100"
                />
                <div className="news-text">News Item 3</div>
                <div className="news-button-container">
                  <button type="button" className="btn btn-outline-primary" id="news-button">
                    Go to News
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
