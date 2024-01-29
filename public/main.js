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

    // Create an image element
    const imageElement = document.createElement('img');
    imageElement.src = post.file.url; // Assuming the URL to the image is available in the 'file' object

    // Create a div to hold the post information
    const postInfo = document.createElement('div');
    postInfo.textContent = `Post ID: ${post.id}, Rating: ${post.rating}, Score: ${post.score.total}`;

    // Create a button to go to the source
    const sourceButton = document.createElement('button');
    sourceButton.textContent = 'Go to Source';
    sourceButton.onclick = function () {
      const postId = post.id;
      window.open(`https://e621.net/posts/${postId}`, '_blank');
    };

    // Create a button to favorite the post
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Favorite';
    favoriteButton.onclick = function () {
      favoritePost(post.id);
    };

    // Append image, post information, source button, and favorite button to the list item
    listItem.appendChild(imageElement);
    listItem.appendChild(postInfo);

    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(sourceButton);
    buttonContainer.appendChild(favoriteButton);

    listItem.appendChild(buttonContainer);

    // Append the list item to the post list
    postList.appendChild(listItem);
  });

  resultContainer.appendChild(postList);
}

async function favoritePost(postId) {
  try {
    const { username, apiKey } = await fetchApiCredentials();
    const apiUrl = `https://e621.net/favorites.json`;  // Updated URL

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': `Pie21/1.0 (by ${username} on e621)`,
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: postId }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success) {
        console.log(`Post ${postId} favorited successfully!`);
      } else {
        console.error(`Error favoriting post: ${data.reason}`);
      }
    } else {
      console.error(`Error favoriting post: HTTP status ${response.status}`);
    }
  } catch (error) {
    console.error('Error favoriting post:', error);
  }
}

// Run the function when the page is loaded
document.addEventListener('DOMContentLoaded', getRecentPosts);

// Automatically get recent posts when the page is loaded
window.addEventListener('load', getRecentPosts);
