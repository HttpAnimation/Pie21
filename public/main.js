// JavaScript to interact with the e621 API

const apiUrl = 'https://e621.net/posts.json?limit=20';

async function getRecentPosts() {
  try {
    const { username, apiKey } = await fetchApiCredentials();

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': `Pie21/1.0 (by ${username} on e621)`,
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
      }
    });

    const data = await response.json();
    console.log('API Response:', data); // Log the response
    displayPosts(data.posts);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchApiCredentials() {
  try {
    const response = await fetch('api.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching API credentials:', error);
    throw error;
  }
}

function displayPosts(posts) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  if (posts.length === 0) {
    resultContainer.innerHTML = '<p>No posts found.</p>';
    return;
  }

  const postList = document.createElement('ul');
  posts.forEach(post => {
    const listItem = document.createElement('li');

    // Check if the file type is an image, video (MP4), or video (WebM)
    if (post.file.ext === 'mp4' || post.file.ext === 'webm') {
      // Create a video element for MP4 or WebM files
      const videoElement = document.createElement('video');
      videoElement.src = post.file.url;
      videoElement.controls = true; // Add controls for playback
      videoElement.setAttribute('width', '100%'); // Adjust width as needed

      // Append video element to the list item
      listItem.appendChild(videoElement);
    } else {
      // Create an image element for other file types
      const imageElement = document.createElement('img');
      imageElement.src = post.file.url;

      // Append image element to the list item
      listItem.appendChild(imageElement);
    }

    // Create a div to hold the post information
    const postInfo = document.createElement('div');
    postInfo.textContent = `Post ID: ${post.id}, Rating: ${post.rating}, Score: ${post.score.total}`;

    // Create a button to go to the source
    const sourceButton = document.createElement('button');
    sourceButton.textContent = 'Go to Source';
    sourceButton.onclick = function () {
      window.open(post.sources, '_blank'); // Assuming the URL to the source is available in the 'sources' property
    };

    // Append post information and the source button to the list item
    listItem.appendChild(postInfo);
    listItem.appendChild(sourceButton);

    // Append the list item to the post list
    postList.appendChild(listItem);
  });

  resultContainer.appendChild(postList);
}

// Automatically fetch recent posts when the page loads
document.addEventListener('DOMContentLoaded', getRecentPosts);
