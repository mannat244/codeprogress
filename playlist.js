let completedItems = {};

document.addEventListener('DOMContentLoaded', () => {
    loadCompletedItems();
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('playlistId');
    if (playlistId) {
        fetchPlaylistDetails(playlistId);
    }
});

function fetchPlaylistDetails(playlistId) {
    const playlistDetailsDiv = document.getElementById('playlistDetails');
    playlistDetailsDiv.innerHTML = '';

    fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=AIzaSyDoR9SR-LskHH2X4Hp0sSrI0vpVhvm3N48`)
        .then(response => response.json())
        .then(data => {
            data.items.forEach(item => {
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.maxres.url;
                const videoId = item.snippet.resourceId.videoId;
                const itemId = item.id;

                const newDiv = document.createElement('div');
                newDiv.classList.add('video-item');

                newDiv.innerHTML = `
                    <img src="${thumbnail}">
                    <p class="title"><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a></p>
                    <button onclick="markComplete('${itemId}', ${data.items.length})">${completedItems[itemId] ? 'Completed' : 'Mark Complete'}</button>
                `;

                playlistDetailsDiv.appendChild(newDiv);
            });
            updateProgressBar(data.items.length);
        })
        .catch(error => console.error('Error fetching playlist details:', error));
}

function markComplete(itemId, totalItems) {
    completedItems[itemId] = true;
    saveCompletedItems();
    document.querySelector(`button[onclick="markComplete('${itemId}', ${totalItems})"]`).innerText = 'Completed';
    updateProgressBar(totalItems); // Update progress bar immediately
    fetchRandomQuote((quote) => {
        alert(`Congratulations! 🎉\n\n"${quote.quote}" - ${quote.author}`);
    });
}

function saveCompletedItems() {
    localStorage.setItem('completedItems', JSON.stringify(completedItems));
}

function loadCompletedItems() {
    const storedCompletedItems = localStorage.getItem('completedItems');
    if (storedCompletedItems) {
        completedItems = JSON.parse(storedCompletedItems);
    }
}

function clearCompletedItems() {
    localStorage.removeItem('completedItems');
    completedItems = {};
    fetchPlaylistDetails(new URLSearchParams(window.location.search).get('playlistId'));
}

function updateProgressBar(totalItems) {
    const completedCount = Object.keys(completedItems).length;
    const progressBar = document.getElementById('progressBar');
    const progress = (completedCount / totalItems) * 100;
    progressBar.style.width = `${progress}%`;
}



function fetchRandomQuote(callback) {
    var category = 'inspirational'; // Replace with your desired category
    fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        headers: {
            'X-Api-Key': 'C7ZXHZxGIGWu6ibkmUq5Ig==QKZwOF3YRbgckST4'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('API request failed');
        }
    })
    .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomQuote = data[randomIndex];
        if (callback) {
            callback(randomQuote);
        }
    })
    .catch(error => {
        console.error('Error fetching quote:', error);
    });
}
