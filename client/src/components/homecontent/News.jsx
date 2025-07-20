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
                <div className="news-text">All Stars Event</div>
                <div className="news-button-container">
                  <a href="https://asia.wotblitz.com/en/news/event/wish-upon-a-star/">
                    <button type="button" className="btn btn-outline-primary" id="news-button">
                      Go to News
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div className="news-objects">
              <div className="news-object-background">
                <img src="/the_outlaws.jpg" className="news-image" alt="News Item 2" />
                <div className="news-text">Operation "The Outlaws"</div>
                <div className="news-button-container">
                  <a href="https://na.wotblitz.com/en/news/event/battle-pass-60/">
                    <button type="button" className="btn btn-outline-primary" id="news-button">
                      Go to News
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="news-row-container">
            <div className="news-objects">
              <div className="news-object-background">
                <img
                  src="/atac.jpg"
                  className="news-image"
                  alt="News Item 3"
                  id="news-image-100"
                />
                <div className="news-text">The Head-Spinning ATAC</div>
                <div className="news-button-container">
                  <a href="https://na.wotblitz.com/en/news/event/atac/">
                    <button type="button" className="btn btn-outline-primary" id="news-button">
                      Go to News
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
