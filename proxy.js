let currentPage = 1;

const apiUrl = 'https://e621.net/posts.json?limit=20';

async function clear() {
  console.clear();
}

async function getRecentPosts() {
  try {
    const { username, apiKey, wgetPath } = await fetchApiCredentials();
    const response = await fetch(`${apiUrl}&page=${currentPage}`, {
      headers: {
        'User-Agent': `Pie21/1.0 (by ${username} on e621)`,
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
      }
    });

    const data = await response.json();
    console.log('API Response:', data);
    displayPosts(data.posts, wgetPath);
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

async function displayPosts(posts, wgetPath) {
  const resultContainer = document.getElementById('result');
  const postsPerPage = 4;
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  if (startIndex >= posts.length) {
    resultContainer.innerHTML = '<p>No more posts available.</p>';
    return;
  }

  const postList = document.createElement('ul');
  postList.style.display = 'flex';
  postList.style.flexWrap = 'wrap';

  const screenSize = window.innerWidth;
  const maxPhotoSize = screenSize * 0.2;

  for (let i = startIndex; i < endIndex && i < posts.length; i++) {
    const post = posts[i];
    const listItem = document.createElement('li');
    listItem.style.flex = '0 0 auto';

    const mediaElement = post.file.ext === 'webm' ? document.createElement('video') : document.createElement('img');
    mediaElement.src = post.file.url;
    mediaElement.style.maxWidth = `${maxPhotoSize}px`;

    const postInfo = document.createElement('div');
    postInfo.textContent = `Post ID: ${post.id}, Rating: ${post.rating}, Score: ${post.score.total}`;

    const sourceButton = document.createElement('button');
    sourceButton.textContent = 'Go to Source';
    sourceButton.onclick = function () {
      window.open(`https://e621.net/posts/${post.id}`, '_blank');
    };

    const openInNewTabButton = document.createElement('button');
    openInNewTabButton.textContent = 'Open in New Tab';
    openInNewTabButton.onclick = function () {
      window.open(post.file.url, '_blank');
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

    const wgetButton = document.createElement('button');
    wgetButton.textContent = 'Get wget Command';
    wgetButton.onclick = function () {
      const wgetCommand = getWgetCommand(post.file.url, wgetPath);
      console.log('Wget Command:', wgetCommand);
      // You can display the wget command wherever you want, e.g., alert, console, etc.
    };

    listItem.appendChild(mediaElement);
    listItem.appendChild(postInfo);
    listItem.appendChild(sourceButton);
    listItem.appendChild(openInNewTabButton);
    listItem.appendChild(favoriteButton);
    listItem.appendChild(upvoteButton);
    listItem.appendChild(downvoteButton);
    listItem.appendChild(wgetButton);

    postList.appendChild(listItem);
  }

  resultContainer.innerHTML = '';
  resultContainer.appendChild(postList);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.onclick = function () {
    currentPage++;
    getRecentPosts();
  };
  resultContainer.appendChild(nextButton);
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

function getWgetCommand(fileUrl, wgetPath) {
  return `wget ${fileUrl} -P ${wgetPath}`;
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