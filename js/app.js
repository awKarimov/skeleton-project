import {
  elCardTemp,
  elParent,
  elLoader,
  errorMessage,
  elData,
} from "./html-elements.js";

function init() {
  elLoader.classList.remove("hidden");
  fetch("https://json-api.uz/api/project/fn43/cars")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      ui(res.data);
    })
    .catch(() => {
      errorMessage.classList.remove("hidden");
    })
    .finally(() => {
      elLoader.classList.add("hidden");
    });
}

init();

function ui(cars) {
  elParent.innerHTML = "";
  cars.forEach((element) => {
    const clone = elCardTemp.cloneNode(true).content;
    const elTitle = clone.querySelector("h2");
    const elDesc = clone.querySelectorAll("#desc");
    const elYear = clone.querySelector("#year");
    const elAcceleration = clone.querySelector("#acceleration");
    const elMaxSpeed = clone.querySelector("#maxSpeed");
    const elHorsePower = clone.querySelector("#horesePower");
    const elColorName = clone.querySelector("#colorName");

    elTitle.innerHTML = `<strong>${element.name}</strong>`;
    elDesc.innerHTML = `<strong>${element.description}</strong>`;
    elYear.innerHTML = `<strong>Yili:</strong> ${element.year}`;
    elAcceleration.innerHTML = `<strong>Tezlanishi:</strong> ${element.acceleration}`;
    elMaxSpeed.innerHTML = `<strong>Max Tezligi:</strong> ${element.maxSpeed}`;
    elHorsePower.innerHTML = `<strong>Ot Kuchi:</strong> ${element.horsepower}`;
    elColorName.innerHTML = `<strong>Rangi:</strong> ${element.colorName}`;
    elParent.append(clone);
  });
}
