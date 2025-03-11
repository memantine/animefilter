document.getElementById('dropdown-button').addEventListener('click', function(event) {
    event.stopPropagation();
    var menu = document.getElementById('dropdown-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });
  
  window.addEventListener('click', function(event) {
    var menu = document.getElementById('dropdown-menu');
    if (!event.target.closest('.dropdown-button')) {
      menu.style.display = 'none';
    }
  });