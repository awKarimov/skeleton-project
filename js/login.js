const elForm = document.getElementById("form");
const elSub = document.getElementById("sub");

elForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(elForm);

  const result = Object.fromEntries(formData.entries());

  fetch("https://json-api.uz/api/project/fn44/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("token", res.access_token);
      location.href = "../index.html";
    });
});
