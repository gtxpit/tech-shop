document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".name");
  const result = document.querySelector(".result");
  const saveBtn = document.getElementById("saveBtn");

  const savedName = localStorage.getItem("userName");
  
  if (savedName) {
    result.textContent = `Привет, ${savedName}!`;
    input.value = savedName;
    document.querySelector('.settings').style.display = 'none';
  }

  saveBtn.addEventListener("click", () => {
    const name = input.value; 
    if (name.trim() === "") {
      alert("Введи имя!");
      return;
    }
    localStorage.setItem("userName", name);
    result.textContent = `Привет, ${name}!`;
  });
});