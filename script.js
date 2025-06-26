document.addEventListener("DOMContentLoaded", () => {
  const isRoot = location.pathname.endsWith("index.html") || location.pathname === "/avdev/";
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

  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navList.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        navList.classList.contains("active") &&
        !navList.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navList.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }
});
