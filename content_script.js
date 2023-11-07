window.addEventListener('load', function () {
  const navBar = document.querySelector(".Layout-sc-1xcs6mc-0.jdpzyl");
  let blockButton = document.querySelector(".block_button");
  if (!blockButton) {
    blockButton = document.createElement("button");
    blockButton.className = "block_button";
    blockButton.textContent = "ON"
    blockButton.style.fontWeight = "bold";

    navBar.insertBefore(blockButton, navBar.firstChild);
  }
});



document.addEventListener("click", function (event) {
  if (event.target.classList.contains("block_button")) {
    let button = event.target;
    if (button.textContent == "OFF") {
      //Set block to on
      button.textContent = "ON";
      setRaidStatus(true)
    } else {
      //Set block to false
      button.textContent = "OFF";
      setRaidStatus(false)
    }
  }
});

//Set block status
function setRaidStatus(value) {
  chrome.storage.local.set({ 'raid': value }, function () {
  });
}

//Get block status
function getRaidStatus() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('raid', function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.raid !== undefined ? result.raid : true);
      }
    });
  });
}

//Mutator observer
async function handleMutations(mutations) {
  const status = await getRaidStatus()
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      console.log(node)
      if (node.nodeType === Node.ELEMENT_NODE && node.dataset.testSelector === 'raid-banner') {
        if (status) {
          const leaveButton = node.querySelector('[data-a-target="tw-core-button-label-text"]');
          if (leaveButton) {
            leaveButton.click();
          }
        }
      }
    });
  });
}

const observer = new MutationObserver(handleMutations);
observer.observe(document, { subtree: true, childList: true });