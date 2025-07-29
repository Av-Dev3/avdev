const BLOG_HOSTNAME = "full-stack-in-progress.hashnode.dev";

// Extract the slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// Update page title and meta description
function updatePageMeta(title, description) {
  document.title = `${title} - Alex Vandusen`;
  
  // Update meta description if it exists
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
}

// Show loading state
function showLoading() {
  const container = document.getElementById("post-content");
  container.innerHTML = `
    <div class="post-loading">
      <div class="loading-spinner"></div>
      <p>Loading post...</p>
    </div>
  `;
}

// Show error state
function showError(message) {
  const container = document.getElementById("post-content");
  container.innerHTML = `
    <div class="post-error">
      <h2>Oops! Something went wrong</h2>
      <p>${message}</p>
      <a href="blog.html" class="back-to-blog">Back to Blog</a>
    </div>
  `;
}

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Extract reading time from content
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

// Main function to fetch and render post
async function fetchAndRenderPost() {
  if (!slug) {
    showError("No post specified. Please provide a valid post slug.");
    return;
  }

  showLoading();

  const query = `
    query {
      publication(host: "${BLOG_HOSTNAME}") {
        post(slug: "${slug}") {
          title
          brief
          content {
            html
          }
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
  `;

  try {
    const response = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error("API Errors:", JSON.stringify(data.errors, null, 2));
      throw new Error("API returned errors");
    }

    const post = data.data.publication.post;
    
    if (!post) {
      showError("Post not found. It may have been moved or deleted.");
      return;
    }

    renderPost(post);
    
  } catch (error) {
    console.error("Error fetching post:", error);
    showError("Failed to load the post. Please check your connection and try again.");
  }
}

// Render the post with the new modern design
function renderPost(post) {
  const container = document.getElementById("post-content");
  
  // Update page meta
  updatePageMeta(post.title, post.brief);
  
  // Calculate reading time
  const readingTime = calculateReadingTime(post.content.html);
  
  // Format date
  const formattedDate = formatDate(post.publishedAt);
  
  // Generate cover image HTML
  let coverImageHTML = "";
  if (post.coverImage && post.coverImage.url) {
    coverImageHTML = `<img src="${post.coverImage.url}" alt="${post.title}" class="post-cover-image" />`;
  }
  
  // Generate tags HTML
  let tagsHTML = "";
  if (post.tags && post.tags.length > 0) {
    tagsHTML = post.tags.map(tag => `<span class="post-tag">${tag.name}</span>`).join('');
  }
  
  // Generate the post HTML
  const postHTML = `
    <a href="blog.html" class="back-to-blog">Back to Blog</a>
    
    <article class="post-article">
      ${coverImageHTML}
      
      <div class="post-header">
        <div class="post-header-content">
          <h1 class="post-title">${post.title}</h1>
          <div class="post-meta">
            <div class="post-date">${formattedDate}</div>
            <div class="post-reading-time">📖 ${readingTime} min read</div>
            ${post.tags && post.tags.length > 0 ? `<div class="post-category">${post.tags[0].name}</div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="post-body">
        <div class="post-content">
          ${post.content.html}
        </div>
        
        ${tagsHTML ? `
          <div class="post-tags">
            <h4>Tags:</h4>
            <div class="tags-list">
              ${tagsHTML}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
    
    <div class="post-navigation">
      <a href="blog.html" class="post-nav-link prev">Back to Blog</a>
      <a href="blog.html" class="post-nav-link next">All Posts</a>
    </div>
  `;
  
  container.innerHTML = postHTML;
  
  // Add smooth scroll to top when clicking back to blog
  const backLinks = document.querySelectorAll('.back-to-blog, .post-nav-link');
  backLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.location.href = link.href;
      }, 300);
    });
  });
  
  // Add syntax highlighting for code blocks
  highlightCodeBlocks();
  
  // Add smooth animations
  addPostAnimations();
}

// Add syntax highlighting to code blocks
function highlightCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    // Add line numbers if it's a large code block
    if (block.textContent.split('\n').length > 10) {
      block.classList.add('line-numbers');
    }
  });
}

// Add smooth animations to post elements
function addPostAnimations() {
  const postArticle = document.querySelector('.post-article');
  if (postArticle) {
    postArticle.style.opacity = '0';
    postArticle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      postArticle.style.transition = 'all 0.6s ease-out';
      postArticle.style.opacity = '1';
      postArticle.style.transform = 'translateY(0)';
    }, 100);
  }
}

// Initialize the post page
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderPost();
});

// Add some additional CSS for tags and reading time
const additionalStyles = `
  <style>
    .post-tag {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: var(--border-radius-full);
      font-size: 0.75rem;
      font-weight: 500;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      display: inline-block;
    }
    
    .post-reading-time {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .post-tags {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
    }
    
    .post-tags h4 {
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .line-numbers {
      counter-reset: line;
    }
    
    .line-numbers > span {
      display: block;
      position: relative;
      padding-left: 3rem;
    }
    
    .line-numbers > span::before {
      counter-increment: line;
      content: counter(line);
      position: absolute;
      left: 0;
      width: 2rem;
      text-align: right;
      color: var(--text-light);
      font-size: 0.75rem;
      padding-right: 0.5rem;
      border-right: 1px solid var(--border-color);
    }
  </style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
