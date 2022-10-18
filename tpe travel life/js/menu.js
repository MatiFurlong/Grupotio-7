const toggleMenuElement = document.getElementById("Navb");
  const mainMenuElement = document.getElementById("nav");

  toggleMenuElement.addEventListener("click", () => {
      mainMenuElement.classList.toggle("nav--show");
  });