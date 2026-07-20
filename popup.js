// Generic handler to fetch, sort, and share private tabs
async function sharePrivateTabs(sortComparator) {
  try {
    // 1. Fetch all open tabs and isolate private ones
    const allTabs = await browser.tabs.query({});
    const tabs = allTabs.filter(tab => tab.incognito);

    if (tabs.length === 0) {
      alert("No open private tabs found.");
      return;
    }

    // 2. Sort the tabs using the passed comparator function
    tabs.sort(sortComparator);

    // 3. Extract and format URLs (one per line)
    const urls = tabs.map(tab => tab.url).join('\n');

    // 4. Trigger Android sharesheet (or fallback to clipboard)
    if (navigator.share) {
      await navigator.share({
        title: 'Private Tabs',
        text: urls
      });
    } else {
      await navigator.clipboard.writeText(urls);
      alert("Share API not supported. URLs copied to clipboard instead!");
    }
  } catch (error) {
    console.error("Error sharing tabs: ", error);
    alert("An error occurred. Check the console.");
  }
}

// Top Button: Sort by .index (Creation / Engine order)
document.getElementById('btnIndex').addEventListener('click', () => {
  sharePrivateTabs((a, b) => a.index - b.index);
});

// Bottom Button: Sort by .lastAccessed (Most recently viewed first)
document.getElementById('btnRecent').addEventListener('click', () => {
  sharePrivateTabs((a, b) => a.url.localeCompare(b.url));
});