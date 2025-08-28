import React, { useState, useEffect } from 'react';
import './BlogSection.css';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Sample blog data - replace with your API call
  const sampleBlogs = [
    {
      id: 1,
      title: "Understanding Market Volatility in 2025",
      excerpt: "Learn how to navigate through market uncertainties and make informed trading decisions during volatile periods.",
      author: "Sarah Johnson",
      date: "2025-08-25",
      category: "Market Analysis",
      readTime: "5 min read",
      image: "https://www.voronoiapp.com/_next/image?url=https%3A%2F%2Fcdn.voronoiapp.com%2Fpublic%2Fimages%2F4d508da5-4c09-42c8-9b39-ad9f52ea4502.webp&w=1200&q=85",
      tags: ["volatility", "trading", "analysis"]
    },
    {
      id: 2,
      title: "Top 5 Trading Strategies for Beginners",
      excerpt: "Essential trading strategies every new investor should know before entering the stock market.",
      author: "Michael Chen",
      date: "2025-08-23",
      category: "Education",
      readTime: "8 min read",
      image: "https://www.investopedia.com/thmb/WI1NxrgDw_g3JjtiJP3kiPvnoZU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/5KeyInvestmentStrategiestoLearnBeforeTrading_final-9d7b3680b134437996eb36592186314f.png",
      tags: ["beginner", "strategies", "education"]
    },
    {
      id: 3,
      title: "Cryptocurrency vs Traditional Stocks",
      excerpt: "A comprehensive comparison between crypto investments and traditional stock market opportunities.",
      author: "Alex Rodriguez",
      date: "2025-08-20",
      category: "Cryptocurrency",
      readTime: "6 min read",
      image: "data:image/jpeg;base64,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",
      tags: ["crypto", "stocks", "comparison"]
    },
    {
      id: 4,
      title: "Risk Management in Day Trading",
      excerpt: "Essential risk management techniques to protect your capital while day trading.",
      author: "Emma Thompson",
      date: "2025-08-18",
      category: "Risk Management",
      readTime: "7 min read",
      image: "https://www.investopedia.com/thmb/j8EZfRNftMJjnSLBOSdWMTQPMwk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/risk_management-5bfc36abc9e77c005182400f.jpg",
      tags: ["risk", "day-trading", "management"]
    },
    {
      id: 5,
      title: "AI in Financial Markets: Future Trends",
      excerpt: "Exploring how artificial intelligence is revolutionizing trading and investment decisions.",
      author: "David Kumar",
      date: "2025-08-15",
      category: "Technology",
      readTime: "9 min read",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAbdYYANJ2k7xpAY8k4hne3Eq_kBGU1MDBaQ&s",
      tags: ["AI", "technology", "future"]
    },
    {
      id: 6,
      title: "Building Your Investment Portfolio",
      excerpt: "Step-by-step guide to creating a diversified investment portfolio that matches your risk tolerance.",
      author: "Lisa Wang",
      date: "2025-08-12",
      category: "Investment",
      readTime: "10 min read",
      image: "https://getmoneyrich.com/wp-content/uploads/2018/10/Building-an-investment-portfolio-from-scratch-image.jpg",
      tags: ["portfolio", "investment", "diversification"]
    }
  ];

  const categories = ['All', 'Market Analysis', 'Education', 'Cryptocurrency', 'Risk Management', 'Technology', 'Investment'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(sampleBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <section className="blogs-section">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blogs-section">
      <div className="container">
        {/* Header */}
        <div className="blogs-header">
          <h2 className="section-title">Latest Insights</h2>
          <p className="section-subtitle">
            Stay updated with the latest market trends, trading strategies, and financial insights
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Blog */}
        {filteredBlogs.length > 0 && (
          <div className="featured-blog">
            <div className="featured-content">
              <div className="featured-image">
                <img src={filteredBlogs[0].image} alt={filteredBlogs[0].title} />
                <div className="featured-badge">Featured</div>
              </div>
              <div className="featured-info">
                <div className="blog-meta">
                  <span className="category-tag">{filteredBlogs[0].category}</span>
                  <span className="read-time">{filteredBlogs[0].readTime}</span>
                </div>
                <h3 className="featured-title">{filteredBlogs[0].title}</h3>
                <p className="featured-excerpt">{filteredBlogs[0].excerpt}</p>
                <div className="author-info">
                  <div className="author-details">
                    <span className="author-name">{filteredBlogs[0].author}</span>
                    <span className="publish-date">{formatDate(filteredBlogs[0].date)}</span>
                  </div>
                  <button className="read-more-btn">Read Article</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="blogs-grid">
          {filteredBlogs.slice(1).map(blog => (
            <article key={blog.id} className="blog-card">
              <div className="card-image">
                <img src={blog.image} alt={blog.title} />
                <div className="category-overlay">{blog.category}</div>
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span className="read-time">{blog.readTime}</span>
                  <span className="publish-date">{formatDate(blog.date)}</span>
                </div>
                <h3 className="card-title">{blog.title}</h3>
                <p className="card-excerpt">{blog.excerpt}</p>
                <div className="card-tags">
                  {blog.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <span className="author">{blog.author}</span>
                  <button className="read-btn">Read More</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="load-more-container">
          <button className="load-more-btn">Load More Articles</button>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
