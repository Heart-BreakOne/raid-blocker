
//Declaring variables and constants
let state;
const on = "ON";
const off = "OFF";
const delay = ms => new Promise(res => setTimeout(res, ms));

//An event listener for when the page loads and the ON/OFF toggle button is injected into the page top right navbar
window.addEventListener('load', async function () {
  //Initializes variables with the navbar and injected button elements
  const navBar = document.querySelector(".Layout-sc-1xcs6mc-0.jdpzyl");
  let blockButton = document.querySelector(".block_button");
  //If the button doesn't exist, inject it into the page
  if (!blockButton) {
    blockButton = document.createElement("button");
    blockButton.className = "block_button";
    //Get button state from memory, if the user has not clicked on the button the default value is set to ON (true)
    state = await getRaidStatus();
    //Set button text based on stored value
    if (state || state == undefined) {
      blockButton.textContent = on;
    } else {
      blockButton.textContent = off;
    }
    blockButton.style.fontWeight = "bold";
    //Injects.
    navBar.insertBefore(blockButton, navBar.firstChild);
  }
});

//An on click event listener for the injected button
document.addEventListener("click", async function (event) {

  if (event.target.classList.contains("block_button")) {
    let button = event.target;
    //Gets button state from memory
    state = await getRaidStatus();
    //Updates button state based on the current state.
    if (!state && state != undefined) {
      button.textContent = on;
      setRaidStatus(true);
    } else {
      button.textContent = off;
      setRaidStatus(false);
    }
  }
});

//Set button state into the storage
function setRaidStatus(value) {
  chrome.storage.local.set({ 'raid': value }, function () {
  });
}

//Get button state from memory when the function is invoked
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

//Mutator observer to check for new elements loading in the page.
async function handleMutations(mutations) {
  //Tries to get the text content of the button (ON/OFF)
  try {
    state = document.querySelector(".block_button").textContent;
  } catch (error) {
    return;
  };
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(async function (node) {
      //Checks if raid banner exists among the new elements
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("dUREKt")) {
        //Waits 8 seconds to ensure the LEAVE raid button loads, then check the current state of the button
        await delay(5000);
        if (state === on) {
          //Initializes leaveButton with the abandon raid button of interest then clicks it.
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