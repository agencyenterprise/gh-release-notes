chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.event !== "build-gh-pr-notes") {
    return;
  }

  const timeLineItems = Array.from(document.querySelectorAll(".TimelineItem"));

  const prs = timeLineItems
    .map((item) => {
      const linkTitle = item.querySelector(".Link--secondary")?.title;
      const prId = item.querySelector("a.issue-link")?.innerText;

      if (linkTitle?.includes("Merge pull request")) {
        const linkTitleList = linkTitle.trim().split("\n");
        const prTitle = linkTitleList[linkTitleList.length - 1];

        return { id: prId, title: prTitle };
      }
    })
    .filter((item) => !!item);

  if (prs.length === 0) {
    alert("You need to be in a Release PR page to use this extension!");
    return;
  }

  const firstPrId = prs[0]?.id;
  const lastPrId = prs[prs.length - 1]?.id;
  const today = new Date();
  const releaseInfo = `Includes changes from iteration ${firstPrId}-${lastPrId} (??/?? to ${
    today.getMonth() + 1
  }/${today.getDate()})\n\nThis release includes the following PRs:\n`;
  const releaseList = prs
    .map((item) => `- ${item.title} (${item.id})`)
    .join("\n");

  const result = `${releaseInfo}\n${releaseList}`;

  console.info(result);

  sendResponse({ data: result });
});
