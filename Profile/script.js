function toggleMenu() {
  var slideMenu = document.getElementById("slide-menu");
  var contents = document.querySelectorAll(".content");

  if (slideMenu.style.left === "-200px" || slideMenu.style.left === "") {
    slideMenu.style.left = "0";
    slideMenu.classList.add("open");
    contents.forEach((content) => {
      content.style.marginLeft = "200px"; // Sesuaikan nilai ini sesuai kebutuhan
    });
  } else {
    slideMenu.style.left = "-200px";
    slideMenu.classList.remove("open");
    contents.forEach((content) => {
      content.style.marginLeft = "0";
    });
  }
}

function showContent(contentId) {
  var contents = document.querySelectorAll(".content");
  var selectedContent = document.getElementById(contentId + "-content");

  if (selectedContent.classList.contains("open")) {
    return;
  }

  contents.forEach((content) => {
    if (content.classList.contains("open")) {
      animateContentOut(content);
      content.classList.remove("open");
    }
  });

  animateContentIn(selectedContent);
  selectedContent.classList.add("open");
}

function animateContentIn(content) {
  content.style.opacity = 0;
  content.style.marginLeft = "-200px";
  content.style.display = "block";

  void content.offsetWidth;

  content.style.opacity = 1;
  content.style.marginLeft = "0";
  content.style.transition = "opacity 0.5s ease-out, margin-left 0.5s ease-out";
}

function animateContentOut(content) {
  content.style.opacity = 0;
  content.style.marginLeft = "-200px";
  content.style.transition = "opacity 0.5s ease-out, margin-left 0.5s ease-out";

  content.addEventListener(
    "transitionend",
    function () {
      content.style.display = "none";
      content.style.marginLeft = "0";
    },
    { once: true }
  );
}

document.addEventListener("click", function (event) {
  var slideMenu = document.getElementById("slide-menu");
  var contents = document.querySelectorAll(".content");

  if (event.target.closest(".content") || event.target.closest(".menu-icon")) {
  } else {
    slideMenu.style.left = "-200px";
    slideMenu.classList.remove("open");
    contents.forEach((content) => {
      content.style.marginLeft = "0";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  showContent("Home");
});
