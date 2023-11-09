let state;
const on = "ON";
const off = "OFF";
const delay = ms => new Promise(res => setTimeout(res, ms));

window.addEventListener('load', async function () {
  const navBar = document.querySelector(".Layout-sc-1xcs6mc-0.jdpzyl");
  let blockButton = document.querySelector(".block_button");
  if (!blockButton) {
    blockButton = document.createElement("button");
    blockButton.className = "block_button";
    state = await getRaidStatus();
    if (state || state == undefined) {
      blockButton.textContent = on;
    } else {
      blockButton.textContent = off;
    }
    blockButton.style.fontWeight = "bold";
    navBar.insertBefore(blockButton, navBar.firstChild);
  }
});

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("block_button")) {
    let button = event.target;
    state = await getRaidStatus();
    if (!state && state != undefined) {
      button.textContent = on;
      setRaidStatus(true);
    } else {
      button.textContent = off;
      setRaidStatus(false);
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
        resolve(result.raid);
      }
    });
  });
}

//Mutator observer
async function handleMutations(mutations) {
  try {
    state = document.querySelector(".block_button").textContent;
  } catch (error) {
    return;
  };
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(async function (node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("dUREKt")) {
        await delay(8000);
        if (state === on) {
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
observer.observe(document, { attributes: true, subtree: true, childList: true });