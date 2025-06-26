document.addEventListener("DOMContentLoaded", () => {
  // Figure out where we are (index.html = 0, public/about.html = 1 level deep)
  const isRoot = location.pathname.endsWith("index.html") || location.pathname === "/avdev/";

  // Set the correct image path prefix
  const prefix = isRoot ? "assets/" : "../assets/";

  const myimage = document.getElementById("git_js");
  if (myimage) {
    myimage.addEventListener("mouseover", () => {
      myimage.src = prefix + "Git3.png";
    });
    myimage.addEventListener("mouseout", () => {
      myimage.src = prefix + "GitHub_Invertocat_Light.png";
    });
  }

  const myimage_2 = document.getElementById("codepen");
  if (myimage_2) {
    myimage_2.addEventListener("mouseover", () => {
      myimage_2.src = prefix + "codepen3.png";
    });
    myimage_2.addEventListener("mouseout", () => {
      myimage_2.src = prefix + "logo-white.png";
    });
  }

  const hamburger = document.getElementById("hamburger");
  const ul = document.getElementById("ul");
  if (hamburger && ul) {
    hamburger.addEventListener("click", () => {
      ul.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }
});
