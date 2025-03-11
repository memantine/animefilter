// set basic functionality to run after page load
window.addEventListener('load', function() {
    chrome.storage.local.get("animefilter_userList", function(result) {
      userList.length = 0;
      if (result.animefilter_userList) {
        result.animefilter_userList.forEach(function(item) {
          userList.push(item);
        });
      }
      // force elements that are already stored to delete on page load
      document.querySelectorAll('.link-title').forEach(function(link) {
        if (userList.includes(link.textContent)) {
          let target = link;
          for (let i = 0; i < 5; i++) {
            if (target && target.parentNode) {
              target = target.parentNode;
            } else {
              break;    //if the target isn't on the page resume script
            }
          }
          if (target && target.parentNode) {
            target.parentNode.removeChild(target);
          }
        }
      });
      document.querySelectorAll(".hoverinfo_trigger").forEach(function(link) {
        if (userList.includes(link.textContent)) {
          let target = link;
          for (let i = 0; i < 5; i++) {
            if (target && target.parentNode) {
              target = target.parentNode;
            } else {
              break;    //if the target isn't on the page resume script
            }
          }
          if (target && target.parentNode) {
            target.parentNode.removeChild(target);
          }
        }
      });
      popList();
    });
});
// chrome storage for user's filter list
function updateStorage(callback) {
  chrome.storage.local.set({ "animefilter_userList": userList }, callback);
}
const userList = [];   // user's list of avoided titles 
const userListElements = []; // list of associated HTML list elements
let clickedElement = null;
let ulList = document.getElementById("slop-list");  // dropdown menu list element
// custom context menu to display on .link-title elements
let slopMenu = document.getElementById("custom-menu");
if (!slopMenu) {        
  slopMenu = document.createElement('div');   
  slopMenu.id = "custom-menu";
  slopMenu.style.position = "absolute";
  slopMenu.innerHTML = '<div class="silly-button"><button id="menuButton"></button></div>';
  slopMenu.style.display = "none";
  document.body.appendChild(slopMenu);
  slopMenu.querySelector("#menuButton").addEventListener("click", addToList);
        // forced styling, i assume javascript elements just don't like css that isn't also coming from javascript?
        const menuButton = slopMenu.querySelector("#menuButton");
        menuButton.style.width = "200px";
        menuButton.style.height = "200px";
        menuButton.style.backgroundImage = `url(${chrome.runtime.getURL("icons/image.png")})`;
        menuButton.style.backgroundSize = "cover";
        menuButton.style.backgroundPosition = "center";
        menuButton.style.border = "none"; 
        menuButton.style.cursor = "pointer";
}
// adds an event listener to every .link-title element for bringing up the alternative contextmenu
document.querySelectorAll('.link-title').forEach(function(link) {
  link.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    clickedElement = event.target;
    slopMenu.style.left = (event.pageX + 20) + 'px';
    slopMenu.style.top = event.pageY + 'px';
    slopMenu.style.display = 'block';
  });
});
// adds user's choices to the user's list
function addToList() {  
  const name = clickedElement.textContent;
  // removing the node
  let target = clickedElement;
  for (let i = 0; i < 5; i++){        // same deletion logic that occurs on page load
    if (target && target.parentNode) {
      target = target.parentNode;
    } else {
      break;
    }
  }
  if (target && target.parentNode) {
    target.parentNode.removeChild(target);
  }
  // adds user choices to array, populates list in storage
  if (!userList.includes(name)) {
    userList.push(name);
  }
  updateStorage(function() {
    popList();
  });
  slopMenu.style.display = "none";
  return;
}
// hides the context menu when clicks occur elsewhere
document.addEventListener('click', function(event) {
  if (!slopMenu.contains(event.target)) {
    slopMenu.style.display = "none";
  }
});
// repopulate userlist when a change occurs
function popList() {
  ulList = document.getElementById("slop-list");
  if (!ulList) {
    const observer = new MutationObserver(function(mutations, obs) {   // watches for changes to the ulList to occur and updates accordingly
      ulList = document.getElementById("slop-list");
      if (ulList) {
        obs.disconnect(); // tells mutation observer to stop if the list exists
        popList();        // force update
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });  //specifying which elements for the mutation observer to pay attention to
    return;
  }
  ulList.innerHTML = "";
  userListElements.length = 0;
  userList.forEach(function(item, index) {
    const li = document.createElement("li");  
    li.innerText = item;
    li.dataset.index = index;
    // adds a remove button to the banned titles list for deleting items 
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', function() {
      userList.splice(index, 1);
      updateStorage(function() {
        popList();        // force update for list after removing an item
      });
    });
    li.appendChild(removeBtn);
    ulList.appendChild(li);
    userListElements.push(li);
  });
}
document.querySelectorAll(".hoverinfo_trigger").forEach(function(link) {
  link.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    clickedElement = event.target;
    slopMenu.style.left = (event.pageX + 20) + 'px';
    slopMenu.style.top = event.pageY + 'px';
    slopMenu.style.display = 'block';
  });
});
