// JavaScript to interact with the e621 API

const apiUrl = 'https://e621.net/posts.json?limit=10';

async function getRecentPosts() {
  try {
    const { username, apiKey } = await fetchApiCredentials();
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': `MyProject/1.0 (by ${username} on e621)`,
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
    
    // Create an image element
    const imageElement = document.createElement('img');
    imageElement.src = post.file.url; // Assuming the URL to the image is available in the 'file' object

    // Create a div to hold the post information
    const postInfo = document.createElement('div');
    postInfo.textContent = `Post ID: ${post.id}, Rating: ${post.rating}, Score: ${post.score.total}`;

    // Append image and post information to the list item
    listItem.appendChild(imageElement);
    listItem.appendChild(postInfo);

    // Append the list item to the post list
    postList.appendChild(listItem);
  });

  resultContainer.appendChild(postList);
}

// Run the function when the page is loaded
document.addEventListener('DOMContentLoaded', getRecentPosts);
