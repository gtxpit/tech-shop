document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
  });

  const result = await res.json();

  if (res.ok) {
    alert("Вы вошли!");
    localStorage.setItem("userId", result.user.id);
    window.location.href = "/";
  } else {
    alert("Ошибка: " + result.error);
  }
});
я