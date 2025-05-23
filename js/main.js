document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const dropdownPanel = document.querySelector('.dropdown-panel');

  [menu, dropdownPanel].forEach(el => {
    el.addEventListener('mouseenter', () => {
      header.classList.add('open');
    });
    el.addEventListener('mouseleave', () => {
      header.classList.remove('open');
    });
  });
});
