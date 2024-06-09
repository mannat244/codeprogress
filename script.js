let playlists = [];
let currentPlaylistItem = null;

document.addEventListener('DOMContentLoaded', loadPlaylists);

function fetchPlaylist() {
	var url = document.getElementById('playlistUrl').value;
	const playlistId = extractPlaylistId(url);
	console.log(playlistId);
	console.log(url);
	let nextPageToken = '';

	fetchPage();

	function fetchPage() {
	var requestUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=AIzaSyDoR9SR-LskHH2X4Hp0sSrI0vpVhvm3N48`;

	if (nextPageToken) {
		requestUrl += `&pageToken=${nextPageToken}`;
	}

		fetch(requestUrl)
		.then(response => {
			if (response.ok) {
			return response.json(); 
			} else {
			throw new Error('API request failed');
			}
		})
		.then(data => {
			console.log(data); 
			nextPageToken = data.nextPageToken;
			if(!data.prevPageToken){currentPlaylistItem = data.items[0]; 
			savePlaylist(currentPlaylistItem); // Sa
			savePlaylists();
			displayList();}
			
			if (nextPageToken) {
				fetchPage(); 
			}
			
		})
		.catch(error => {
			console.error(error); 
		});
		
}




function extractPlaylistId(url) {
		const urlParams = new URLSearchParams(new URL(url).search);
		return urlParams.get('list');
	}

	function savePlaylist(playlist) {
        playlists.push(playlist);
    }
}

function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

function loadPlaylists() {
    const storedPlaylists = localStorage.getItem('playlists');
    if (storedPlaylists) {
        playlists = JSON.parse(storedPlaylists);
        playlists.forEach(displayList);
    }
}

function displayList(item){
	const playlistDiv = document.getElementById('playlistList');
    playlistDiv.innerHTML = '';

playlists.forEach(playlist => {
	if (playlist) {
		const title = playlist.snippet.title;
		const thumbnail = playlist.snippet.thumbnails.maxres.url;

		const newDiv = document.createElement('div');
		newDiv.classList.add('playlist-item'); // Add a class for styling

		newDiv.innerHTML = ` <img src="${thumbnail}">
							<p class="title">Course: ${title}</p>
						`; // Set text content

		newDiv.onclick = () => {
							window.location.href = `playlist.html?playlistId=${playlist.snippet.playlistId}`;
						};

		playlistDiv.appendChild(newDiv); // Append the new div to the playlistList container
	}
});
}

function clearPlaylists() {
    localStorage.removeItem('playlists');
    playlists = [];
    const playlistContainer = document.getElementById('playlistContainer');
    playlistContainer.innerHTML = '';
}