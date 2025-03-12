document.getElementById('dropdown-button').addEventListener('click', function(event) {
    event.stopPropagation();
    let menu = document.getElementById('dropdown-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });
  
  window.addEventListener('click', function(event) {
    let menu = document.getElementById('dropdown-menu');
    if (!event.target.closest('.dropdown-button, #dropdown-menu, .animefilter')) {
      menu.style.display = 'none';
    }
  });