let picker;
let input;
let display;

const resetPicker = () => {
  picker = document.querySelector("#color-picker");
  input = document.querySelector("#color-input");
  display = document.querySelector("#color-display");

  picker.addEventListener("change", () => {
    input.value = picker.value;
    display.style.backgroundColor = picker.value;
  });

  display.style.backgroundColor = picker.value;
};

resetPicker();
