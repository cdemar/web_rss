// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to the form, input field, and the feed entries container
  const form = document.getElementById("rss-form");
  const feedUrlInput = document.getElementById("feed-url");
  const feedEntries = document.getElementById("feed-entries");

  // Add an event listener to handle form submission
  form.addEventListener("submit", async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the RSS feed URL from the input field
    const feedUrl = feedUrlInput.value.trim();

    // Check if the input field is not empty
    if (feedUrl) {
      try {
        // Fetch the RSS feed using the RSS2JSON API
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
          {
            // Enforce the use of the GET method
            method: "GET",
            // Define the headers for the fetch request
            headers: {
              // Only allow the application to receive JSON
              Accept: "application/json",
            },
          },
        );

        // Check if the response is not ok (e.g., 404, 500 errors)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response as JSON
        const data = await response.json();

        // Display the feed entries
        displayFeedEntries(data.items);
      } catch (error) {
        // Log the error to the console
        console.error("Error fetching the RSS feed:", error);

        // Display an error message to the user
        feedEntries.innerHTML =
          "<li>Error fetching the RSS feed. Please try again.</li>";
      }
    } else {
      // If the input field is empty, display an error message
      feedEntries.innerHTML = "<li>Please enter a valid RSS feed URL.</li>";
    }
  });

  // Function to display the feed entries
  function displayFeedEntries(items) {
    // Clear any existing feed entries
    feedEntries.innerHTML = "";

    // Check if there are no items in the feed
    if (items.length === 0) {
      feedEntries.innerHTML = "<li>No entries found.</li>";
      return;
    }

    // Iterate over each item in the feed
    items.forEach((item) => {
      // Create a list item element
      const entry = document.createElement("li");

      // Format the publication date of the item using formatDate function
      const formattedDate = formatDate(item.pubDate);

      // Populate the list item with HTML content (title, link, date, description)
      entry.innerHTML = `
        <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
        <small>${formattedDate}</small>
        <p>${item.description}</p>
      `;

      // Append the list item to the feed entries container
      feedEntries.appendChild(entry);
    });

    // Function to format a given date string into "MM/DD/YYYY HH:MM" format
    function formatDate(dateString) {
      // Create a Date object from the dateString
      const date = new Date(dateString);

      // Format the date components (day, month, year, hours, minutes) with leading zeros if necessary
      const formattedDate = `${padZero(date.getMonth())}/${padZero(date.getDate())}/${date.getFullYear()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
      return formattedDate; // Return the formatted date string
    }

    // Function to pad a single-digit number with a leading zero
    function padZero(num) {
      return (num < 10 ? "0" : "") + num;
    }
  }
});
