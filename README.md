# Pie21/Main

Pie21 is a web client designed for [e621](https://e621.net/), developed using HTML, CSS, JS, and JSON.

## Installation
To install, open a terminal and execute the following command. If you are using [Windows](https://www.microsoft.com/en-us/windows), utilize [WSL](https://learn.microsoft.com/en-us/windows/wsl/install). I recommend using [Fedora](https://github.com/WhitewaterFoundry/Fedora-Remix-for-WSL) as it is the platform on which Pie21 is built.
```bash
wget https://github.com/HttpAnimation/Pie21/blob/main/install.bash && bash install.bash
```

## Running
Once installed, run the following command in the installation directory.
```bash
node proxy.js
```

## API
To obtain your API key, visit the following URL in your browser (e.g., [Firefox](https://www.mozilla.org/en-US/firefox/new/)/[Chrome](https://www.google.com/chrome/)).

#### API - Replace {replaceWithID} with your user ID (e.g., 1234521)
```
https://e621.net/users/{replaceWithID}/api_key
```
```
https://e621.net/users/1234521/api_key
```

## Working
1) Loading photos
2) Loading videos
3) Info on posts
4) Favorite/Unfavorite

## Credits
1) [NotMeNotYou](https://e621.net/users/NotMeNotYou) | [e621](https://e621.net) - Creator of [e621](https://e621.net), the source of my affection for boys.

2) [HttpAnimations](https://github.com/HttpAnimation) | [FYC-Rewrite V2](https://github.com/HttpAnimation/FYC-Rewrite-V2/tree/Stable) - Code from gh-pages used as a template.
