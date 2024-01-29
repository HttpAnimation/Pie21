// JavaScript to interact with the e621 API

const apiUrl = 'http://localhost:3000/e621/posts.json?limit=10';

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
    listItem.textContent = `Post ID: ${post.id}, Rating: ${post.rating}, Score: ${post.score.total}`;
    postList.appendChild(listItem);
  });

  resultContainer.appendChild(postList);
}
