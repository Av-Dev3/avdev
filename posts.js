const BLOG_HOSTNAME = "full-stack-in-progress.hashnode.dev";

// Extract the slug from the URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

if (!slug) {
  console.error("No slug provided in URL.");
} else {
  const query = `
    query {
      publication(host: "${BLOG_HOSTNAME}") {
        post(slug: "${slug}") {
          title
          content {
            html
          }
          coverImage {
            url
          }
          publishedAt
        }
      }
    }
  `;

  fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(data => {
      const post = data.data.publication.post;
      if (!post) {
        console.error("Post not found");
        return;
      }
      renderPost(post);
    })
    .catch(err => console.error("Error fetching post:", err));
}

function renderPost(post) {
  const container = document.getElementById("post-container");

  let imageHTML = "";
  if (post.coverImage && post.coverImage.url) {
    imageHTML = `<img src="${post.coverImage.url}" alt="${post.title}" />`;
  }

  container.innerHTML = `
    <div class="post">
      ${imageHTML}
      <h1>${post.title}</h1>
      <div class="post-date">${new Date(post.publishedAt).toLocaleDateString()}</div>
      <div class="post-content">${post.content.html}</div>
    </div>
  `;
}
