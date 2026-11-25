async function fetchCard() {
  const grid = document.querySelector(".grid");
  const template = document.getElementById("productTemplate");

  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    grid.innerHTML = "";

    products.forEach((product) => {
      const card = template.cloneNode(true);
      card.removeAttribute("id");
      card.style.display = "flex";

      card.querySelector(".product-title").textContent = product.title;
      card.querySelector(".product-price").textContent = `${product.price} ₽`;

      const img = card.querySelector(".product-image");
      img.src = product.image || "/no-photo.png";

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchCard);

function profileClick() {
  const avatar = document.getElementById("avatarBtn");

  if (avatar) {
    avatar.addEventListener("click", () => {
      window.location.href = "../html/profile.html";
    });
  }
}

profileClick();
