const API_KEY = 'AIzaSyBMrqe_SpGHdunSNKTk6t06FA386S3cvtk';  // ⚠️ Apni API key yaha paste karo
const CHANNEL_ID = 'UCHDIE8He7i3dPenCqtB6UAw';  // ⚠️ Apna YouTube Channel ID yaha paste karo

const videosContainer = document.getElementById('videos');
const searchBox = document.getElementById('search-box');
const themeToggle = document.getElementById('theme-toggle');
const loadMoreBtn = document.getElementById('load-more');

let nextPageToken = '';

// ✅ Loading Indicator
const loadingMessage = document.createElement('p');
loadingMessage.textContent = 'Loading videos...';
loadingMessage.style.textAlign = 'center';
loadingMessage.style.fontSize = '18px';
loadingMessage.style.margin = '20px 0';
videosContainer.appendChild(loadingMessage);

async function fetchVideos(pageToken = '') {
    loadingMessage.style.display = 'block';

    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&pageToken=${pageToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items) {
            loadingMessage.textContent = 'No videos found or API limit exceeded.';
            return;
        }

        displayVideos(data.items);
        nextPageToken = data.nextPageToken || '';
        loadMoreBtn.style.display = nextPageToken ? 'block' : 'none';
    } catch (error) {
        console.error('Error fetching videos:', error);
        loadingMessage.textContent = 'Failed to load videos. Please try again.';
    } finally {
        loadingMessage.style.display = 'none';
    }
}

function displayVideos(videos) {
    videos.forEach(video => {
        if (video.id.videoId) {
            const videoElement = document.createElement('div');
            videoElement.classList.add('video');
            videoElement.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                <h3>${video.snippet.title}</h3>
            `;
            videosContainer.appendChild(videoElement);
        }
    });
}

// ✅ Search Functionality
searchBox.addEventListener('input', () => {
    const searchText = searchBox.value.toLowerCase();
    document.querySelectorAll('.video').forEach(video => {
        const title = video.querySelector('h3').textContent.toLowerCase();
        video.style.display = title.includes(searchText) ? 'block' : 'none';
    });
});

// ✅ Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// ✅ Load theme from localStorage
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
}

// ✅ Load More Videos
loadMoreBtn.addEventListener('click', () => {
    if (nextPageToken) fetchVideos(nextPageToken);
});

// ✅ Initial Fetch
fetchVideos();
