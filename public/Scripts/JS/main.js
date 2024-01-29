const apiUrl = 'https://e621.net/posts.json?limit=20';

function clear() {
  console.clear();
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
    console.log('API Response:', data); 
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

    const mediaElement = post.file.ext === 'webm' ? document.createElement('video') : document.createElement('img');
    mediaElement.src = post.file.url;

    if (post.file.ext === 'webm') {
      mediaElement.controls = true;
      mediaElement.loop = true;
      mediaElement.width = '100%'; 
      mediaElement.height = 'auto'; 

      const sourceElement = document.createElement('source');
      sourceElement.src = post.file.url;
      sourceElement.type = 'video/webm';
      mediaElement.appendChild(sourceElement);
    }

    const postInfo = document.createElement('div');
    postInfo.textContent = `Post ID: ${post.id}, Rating: ${post.rating}, Score: ${post.score.total}`;

    const sourceButton = document.createElement('button');
    sourceButton.textContent = 'Go to Source';
    sourceButton.onclick = function () {
      window.open(`https://e621.net/posts/${post.id}`, '_blank');
    };

    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = post.is_favorited ? 'Unfavorite' : 'Favorite';
    favoriteButton.onclick = function () {
      if (post.is_favorited) {
        unfavoritePost(post.id);
      } else {
        favoritePost(post.id);
      }
    };

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

    listItem.appendChild(mediaElement);
    listItem.appendChild(postInfo);
    listItem.appendChild(sourceButton);
    listItem.appendChild(favoriteButton);
    listItem.appendChild(upvoteButton);
    listItem.appendChild(downvoteButton);

    postList.appendChild(listItem);
  });

  resultContainer.appendChild(postList);
}

async function votePost(postId, direction) {
  try {
    const { username, apiKey } = await fetchApiCredentials();
    const apiUrl = `https://e621.net/posts/${postId}/votes.json`;

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
        console.error(`Error ${direction}voting post: ${data.message}`);
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
    const apiUrl = `https://e621.net/favorites.json`;

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

document.addEventListener('DOMContentLoaded', getRecentPosts);

window.addEventListener('load', getRecentPosts);
