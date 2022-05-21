const trigger = document.getElementById("compile");

trigger.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { event: "build-gh-pr-notes" },
      function (response) {
        navigator.clipboard.writeText(response.data).then(
          function () {
            alert("PR notes copied to clipboard!");
          },
          function (e) {
            alert(e);
          }
        );
      }
    );
  });
});
