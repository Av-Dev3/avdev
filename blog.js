const BLOG_HOSTNAME = "full-stack-in-progress.hashnode.dev";

const query = `
  query {
    publication(host: "${BLOG_HOSTNAME}") {
      posts(first: 12) {
        edges {
          node {
            title
            brief
            slug
            coverImage {
              url
            }
            publishedAt
            tags {
              name
            }
          }
        }
      }
    }
  }
`;

// Show loading state
function showLoading() {
  const container = document.querySelector(".blog-grid");
  if (container) {
    container.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    `;
  }
}

// Show error state
function showError(message) {
  const container = document.querySelector(".blog-grid");
  if (container) {
    container.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Unable to load posts</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
      </div>
    `;
  }
}

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

// Calculate reading time
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Get category from tags
function getCategoryFromTags(tags) {
  if (!tags || tags.length === 0) return 'Web Development';
  
  const tagNames = tags.map(tag => tag.name.toLowerCase());
  
  if (tagNames.some(tag => tag.includes('tutorial') || tag.includes('guide'))) {
    return 'Tutorials';
  } else if (tagNames.some(tag => tag.includes('learn') || tag.includes('learning'))) {
    return 'Learning';
  } else if (tagNames.some(tag => tag.includes('thought') || tag.includes('opinion'))) {
    return 'Thoughts';
  } else {
    return 'Web Development';
  }
}

// Fetch and render blog posts
fetch("https://gql.hashnode.com", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.errors) {
      console.error("API Errors:", JSON.stringify(data.errors, null, 2));
      throw new Error("API returned errors");
    }

    const posts = data.data.publication.posts.edges.map((edge) => edge.node);
    console.log('Fetched posts:', posts);
    
    if (posts.length === 0) {
      showError("No blog posts found. Check back soon!");
      return;
    }
    
    renderAllPosts(posts);
  })
  .catch((err) => {
    console.error("Error fetching blog posts:", err.message);
    console.error("Full error object:", err);
    
    // Show error state instead of using fallback
    showError("Failed to load blog posts. Please check your connection and try again.");
  });

function renderAllPosts(posts) {
  const container = document.querySelector(".blog-grid");
  
  if (!container) {
    console.error("Blog grid container not found");
    return;
  }

  // Clear existing static content
  container.innerHTML = "";

  posts.forEach((post, index) => {
    const card = document.createElement("article");
    card.classList.add("blog-card");
    
    // Add featured class to first post
    if (index === 0) {
      card.classList.add("featured");
    }

    // Get category from tags
    const category = getCategoryFromTags(post.tags);
    
    // Add data-category for filtering
    card.setAttribute('data-category', category.toLowerCase().replace(' ', '-'));

    let imageHTML = "";
    if (post.coverImage && post.coverImage.url) {
      imageHTML = `
        <div class="blog-image">
          <img src="${post.coverImage.url}" alt="${post.title}" loading="lazy" />
          ${index === 0 ? '<div class="blog-overlay"><span class="featured-badge">Featured</span></div>' : ''}
        </div>
      `;
    } else {
      // Fallback image
      imageHTML = `
        <div class="blog-image">
          <img src="../assets/bloglogo.png" alt="${post.title}" loading="lazy" />
          ${index === 0 ? '<div class="blog-overlay"><span class="featured-badge">Featured</span></div>' : ''}
        </div>
      `;
    }

    // Format date
    const formattedDate = formatDate(post.publishedAt);
    
    // Calculate reading time
    const readingTime = calculateReadingTime(post.brief || post.title);

    // Generate tags HTML
    let tagsHTML = '';
    if (post.tags && post.tags.length > 0) {
      tagsHTML = post.tags.slice(0, 3).map(tag => 
        `<span class="tag">${tag.name}</span>`
      ).join('');
    } else {
      tagsHTML = '<span class="tag">Development</span><span class="tag">Learning</span>';
    }

    // Use h2 for featured post, h3 for regular posts
    const titleTag = index === 0 ? 'h2' : 'h3';

    card.innerHTML = `
      ${imageHTML}
      <div class="blog-content">
        <div class="blog-meta">
          <span class="blog-category">${category}</span>
          <span class="blog-date">${formattedDate}</span>
        </div>
        <${titleTag}>${post.title}</${titleTag}>
        <p>${post.brief || 'Click to read this article about web development and learning experiences.'}</p>
        <div class="blog-tags">
          ${tagsHTML}
        </div>
        <a href="post.html?slug=${post.slug}" class="read-more">
          ${index === 0 ? 'Read Full Article' : 'Read More'} →
        </a>
      </div>
    `;

    container.appendChild(card);
  });

  // Update category counts
  updateCategoryCounts(posts);
  
  // Reinitialize category filtering after adding dynamic content
  initializeCategoryFiltering();
  
  // Add smooth animations
  addCardAnimations();
}

function updateCategoryCounts(posts) {
  const categoryCounts = {};
  
  posts.forEach(post => {
    const category = getCategoryFromTags(post.tags);
    const categoryKey = category.toLowerCase().replace(' ', '-');
    categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + 1;
  });
  
  // Update category button counts
  document.querySelectorAll('.category-btn').forEach(btn => {
    const category = btn.getAttribute('data-category');
    const count = categoryCounts[category] || 0;
    const countElement = btn.querySelector('.category-count');
    if (countElement) {
      countElement.textContent = count;
    }
  });
  
  // Update sidebar category counts
  document.querySelectorAll('.sidebar-category').forEach(link => {
    const categoryName = link.querySelector('.category-name').textContent;
    const categoryKey = categoryName.toLowerCase().replace(' ', '-');
    const count = categoryCounts[categoryKey] || 0;
    const countElement = link.querySelector('.category-count');
    if (countElement) {
      countElement.textContent = count;
    }
  });
}

function initializeCategoryFiltering() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const category = button.getAttribute('data-category');

      blogCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
          // Add staggered animation
          card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function addCardAnimations() {
  const cards = document.querySelectorAll('.blog-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cards.forEach(card => {
    observer.observe(card);
  });
}

// Load more functionality
document.addEventListener('DOMContentLoaded', function() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // For now, just show a message
      this.innerHTML = '<span class="btn-text">No more posts</span>';
      this.disabled = true;
      this.style.opacity = '0.6';
    });
  }
  
  // Newsletter form handling
  const newsletterForms = document.querySelectorAll('.newsletter-form, .sidebar-newsletter');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      
      // Show success message
      const button = this.querySelector('button');
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="btn-text">Subscribed!</span>';
      button.style.background = 'var(--success-color, #10b981)';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        this.reset();
      }, 2000);
    });
  });
});

// Add loading and error styles
const style = document.createElement('style');
style.textContent = `
  .loading-state, .error-state {
    text-align: center;
    padding: 3rem;
    grid-column: 1 / -1;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .error-state h3 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .error-state p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
`;
document.head.appendChild(style);
