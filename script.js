document.addEventListener("DOMContentLoaded", () => {
  const myimage = document.getElementById("git_js");
  if (myimage) {
    myimage.addEventListener("mouseover", () => {
      myimage.src = "/assets/Git3.png";
    });
    myimage.addEventListener("mouseout", () => {
      myimage.src = "/assets/GitHub_Invertocat_Light.png";
    });
  }

  const myimage_2 = document.getElementById("codepen");
  if (myimage_2) {
    myimage_2.addEventListener("mouseover", () => {
      myimage_2.src = "/assets/codepen3.png";
    });
    myimage_2.addEventListener("mouseout", () => {
      myimage_2.src = "/assets/logo-white.png";
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
