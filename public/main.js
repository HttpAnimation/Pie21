// JavaScript to interact with the e621 API

const apiUrl = 'https://e621.net/posts.json?limit=20';

function clear() {
  clear();
}


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
      window.open(`https://e621.net/posts/${post.id}`, '_blank');
    };

    // Create a button to favorite/unfavorite the post
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = post.is_favorited ? 'Unfavorite' : 'Favorite';
    favoriteButton.onclick = function () {
      if (post.is_favorited) {
        unfavoritePost(post.id);
      } else {
        favoritePost(post.id);
      }
    };

    // Create buttons for upvote and downvote
    const upvoteButton = document.createElement('button');
    upvoteButton.textContent = 'Upvote';
    upvoteButton.onclick = function () {
      votePost(post.id, 'up');
    };

    const downvoteButton = document.createElement('button');
    downvoteButton.textContent = 'Downvote';
    downvoteButton.onclick = function () {
      votePost(post.id, 'down');
    };

    // Append image, post information, source button, favorite button, upvote, and downvote buttons to the list item
    listItem.appendChild(imageElement);
    listItem.appendChild(postInfo);
    listItem.appendChild(sourceButton);
    listItem.appendChild(favoriteButton);
    listItem.appendChild(upvoteButton);
    listItem.appendChild(downvoteButton);

    // Append the list item to the post list
    postList.appendChild(listItem);
  });

  resultContainer.appendChild(postList);
}

async function votePost(postId, direction) {
  try {
    const { username, apiKey } = await fetchApiCredentials();
    const apiUrl = `https://e621.net/posts/${postId}/votes.json`;  // Updated URL

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': `Pie21/1.0 (by ${username} on e621)`,
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: direction }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success) {
        console.log(`Post ${postId} ${direction}voted successfully!`);
      } else {
        console.error(`Error ${direction}voting post: ${data.reason}`);
      }
    } else {
      console.error(`Error ${direction}voting post: HTTP status ${response.status}`);
    }
  } catch (error) {
    console.error(`Error ${direction}voting post:`, error);
  }
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

async function unfavoritePost(postId) {
  try {
    const { username, apiKey } = await fetchApiCredentials();
    const apiUrl = `https://e621.net/favorites/${postId}.json`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'User-Agent': `Pie21/1.0 (by ${username} on e621)`,
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`),
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success) {
        console.log(`Post ${postId} unfavorited successfully!`);
      } else {
        console.error(`Error unfavoriting post: ${data.reason}`);
      }
    } else {
      console.error(`Error unfavoriting post: HTTP status ${response.status}`);
    }
  } catch (error) {
    console.error('Error unfavoriting post:', error);
  }
}

async function searchPosts() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();

  if (query !== '') {
    const searchUrl = `https://e621.net/posts.json?limit=20&tags=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Include additional headers if needed
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Search Results:', data);
      displayPosts(data.posts);
    } else {
      console.error('Error fetching search results:', response.status);
    }
  } else {
    console.log('Please enter a search query.');
  }
}

// Run the function when the page is loaded
document.addEventListener('DOMContentLoaded', getRecentPosts);

// Automatically get recent posts when the page is loaded
window.addEventListener('load', getRecentPosts);
