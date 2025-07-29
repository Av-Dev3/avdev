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
          }
        }
      }
    }
  }
`;

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
    console.log(posts);
    renderAllPosts(posts);
  })
  .catch((err) => {
    console.error("Error fetching blog posts:", err.message);
    console.error("Full error object:", err);
    // Fallback to static content if API fails
    console.log("Using fallback static content");
  });

function renderAllPosts(posts) {
  const container = document.querySelector(".blog-grid");
  
  if (!container) {
    console.error("Blog grid container not found");
    return;
  }

  // Clear existing static content
  container.innerHTML = "";

  if (posts.length === 0) {
    container.innerHTML = `
      <article class="blog-card">
        <div class="blog-content">
          <h3>No posts available at the moment</h3>
          <p>Check back soon for new content!</p>
        </div>
      </article>
    `;
    return;
  }

  posts.forEach((post, index) => {
    const card = document.createElement("article");
    card.classList.add("blog-card");
    
    // Add featured class to first post
    if (index === 0) {
      card.classList.add("featured");
    }

    let imageHTML = "";
    if (post.coverImage && post.coverImage.url) {
      imageHTML = `
        <div class="blog-image">
          <img src="${post.coverImage.url}" alt="${post.title}" />
          ${index === 0 ? '<div class="blog-overlay"><span class="featured-badge">Featured</span></div>' : ''}
        </div>
      `;
    }

    // Format date
    const date = new Date(post.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    card.innerHTML = `
      ${imageHTML}
      <div class="blog-content">
        <div class="blog-meta">
          <span class="blog-category">Web Development</span>
          <span class="blog-date">${formattedDate}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.brief}</p>
        <div class="blog-tags">
          <span class="tag">Development</span>
          <span class="tag">Learning</span>
        </div>
        <a href="post.html?slug=${post.slug}" class="read-more">Read More →</a>
      </div>
    `;

    container.appendChild(card);
  });

  // Reinitialize category filtering after adding dynamic content
  initializeCategoryFiltering();
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

      blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
