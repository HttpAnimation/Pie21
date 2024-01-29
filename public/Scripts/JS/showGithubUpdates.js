        // Fetch all branches from GitHub API
        fetch('https://api.github.com/repos/HttpAnimation/Pie21/branches')
            .then(res => res.json())
            .then(branches => {
                // Create an array to store all commits
                const allCommits = [];

                // Fetch commits for each branch
                const fetchCommitsPromises = branches.map(branch => {
                    return fetch(`https://api.github.com/repos/HttpAnimation/Pie21/commits?sha=${branch.name}`)
                        .then(res => res.json())
                        .then(commits => {
                            // Add commits with branch information to the array
                            allCommits.push(...commits.map(commit => ({ ...commit, branch: branch.name })));
                        });
                });

                // When all promises are resolved, sort the commits by timestamp
                Promise.all(fetchCommitsPromises)
                    .then(() => {
                        allCommits.sort((a, b) => new Date(b.commit.committer.date) - new Date(a.commit.committer.date));

                        // Create an HTML string for sorted commits
                        const commitsHTML = allCommits.map(commit => {
                            const branchName = commit.branch;
                            const commitMessage = commit.commit.message;
                            const commitTimestamp = new Date(commit.commit.committer.date);
                            const formattedTimestamp = commitTimestamp.toLocaleString();
                            return `<div><strong>Branch:</strong> ${branchName}<br><strong>Commit Message:</strong> ${commitMessage}<br><strong>Timestamp:</strong> ${formattedTimestamp}</div>`;
                        }).join('');

                        // Set the HTML content in the designated element
                        document.getElementById('commits').innerHTML = commitsHTML;
                    })
                    .catch(error => {
                        console.error('Error fetching commit data:', error);
                        document.getElementById('commits').innerHTML = 'Error loading commit information';
                    });
            })
            .catch(error => {
                console.error('Error fetching branch data:', error);
                document.getElementById('commits').innerHTML = 'Error loading branch information';
            });
