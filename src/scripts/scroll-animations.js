// Script para manejar animaciones basadas en scroll
document.addEventListener('DOMContentLoaded', function() {
  // Función para verificar si un elemento está visible en el viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }

  // Función para activar animaciones cuando los elementos son visibles
  function handleScrollAnimations() {
    const sections = document.querySelectorAll('.reveal');
    
    sections.forEach(section => {
      if (isElementInViewport(section)) {
        section.classList.add('active');
      }
    });
  }

  // Ejecutar al cargar la página y al hacer scroll
  handleScrollAnimations();
  window.addEventListener('scroll', handleScrollAnimations);
});
