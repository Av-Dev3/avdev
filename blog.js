const BLOG_HOSTNAME = "full-stack-in-progress.hashnode.dev";

const query = `
  query {
    publication(host: "${BLOG_HOSTNAME}") {
      posts(first: 4) {
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
      console.error("API Errors:", JSON.stringify(data.errors, null, 2)); // Log the detailed error
      throw new Error("API returned errors");
    }

    const posts = data.data.publication.posts.edges.map((edge) => edge.node);
    console.log(posts); // Check if posts are being fetched correctly
    renderAllPosts(posts);
  })
  .catch((err) => {
    console.error("Error fetching blog posts:", err.message); // Log the exact error message
    console.error("Full error object:", err); // Log the full error object for more context
  });

function renderAllPosts(posts) {
  const container = document.getElementById("all-posts-container");
  container.innerHTML = ""; // Clear any existing content

  if (posts.length === 0) {
    container.innerHTML = "<p>No posts available</p>"; // Show message if no posts are returned
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.classList.add("blog-card");

    let imageHTML = "";
    if (post.coverImage && post.coverImage.url) {
      imageHTML = `<img src="${post.coverImage.url}" alt="${post.title}" />`;
    }

    card.innerHTML = `
  ${imageHTML}
  <h3>${post.title}</h3>
  <p>${post.brief}</p>
  <a href="post.html?slug=${post.slug}">Read More</a>
`;

    container.appendChild(card);
  });
}
