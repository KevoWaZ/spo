const tokenUrl = 'https://accounts.spotify.com/api/token';
const clientId = '1d4ff0355987413d96814ffa2bd8a82a'; // Remplace avec ton propre identifiant client Spotify
const clientSecret = '5c45da7510174e8fa6bda6bcbb7ebd25'; // Remplace avec ton propre identifiant client Spotify
let btn = document.getElementById("btn")
let btnTest = document.getElementById("test")
let input = document.getElementById("input")
let artistId;
let artistRet
const artistesRetenus = []

// Configure l'authentification pour obtenir le jeton
const authOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
  },
  body: 'grant_type=client_credentials'
};


btn.addEventListener('click', () => {
  getData('album');
  getData('single');
});

function obtain() {
  getData('album');
  getData('single');
}


const container = document.getElementById('album');
const containerAlbum = document.getElementById('album');
const container2 = document.getElementById('single');

function getData(albumType) {
  console.clear();



  let artistName = input.value; // Demande le nom de l'artiste à l'utilisateur

  // Sélectionne l'élément HTML où tu veux afficher les albums
  const container = (albumType === 'album') ? document.getElementById('album') : document.getElementById('single');



  // Supprime tous les enfants de l'élément "container" (les albums précédents)
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Effectue la requête pour obtenir le jeton d'authentification
  fetch(tokenUrl, authOptions)
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token; // Récupère le jeton d'authentification

      // Utilise le jeton d'authentification pour authentifier tes requêtes à l'API Spotify
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };

      // Effectue une recherche d'artistes par nom
      fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, requestOptions)
        .then(response => response.json())
        .then(data => {
          let artist

          if (data.artists.items[0].name === artistName) {
            for (let i = 0; i < 3 && i < data.artists.items.length; i++) {
              artist = data.artists.items[0]
              artistRet = data.artists.items[i]
              console.log(`Artiste retenu: ${artistRet.name}`);
            }
          } else {
            for (let i = 1; i < 3 && i < data.artists.items.length; i++) {
              artist = data.artists.items[1]
              artistRet = data.artists.items[i]
              console.log(`Artiste retenu: ${artistRet.name}`);
            }
          }
          if (artist) {
            artistId = artist.id; // Obtient l'ID de l'artiste trouvé
            console.log(artist);
            console.log(`L'ID de l'artiste ${artistName} est : ${artistId}`);

            // Récupère les albums de l'artiste spécifié en filtrant par le type (album ou single)
            fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?album_type=${albumType}&limit=50`, requestOptions)
              .then(response => response.json())
              .then(data => {
                // data contient la liste des albums de l'artiste
                console.log(data.items);
                for (let i = 0; i < data.items.length; i++) {
                  const albumList = data.items[i]
                  console.log(`${albumType} ${i + 1}: ${albumList.name}, sortie le: ${albumList.release_date} avec ${albumList.total_tracks} son`);
                }
                // Affiche les albums
                data.items.forEach(album => {
                  containerAlbum.classList.remove("is-hidden")
                  const htmlToAdd = `
                  <div class="album is-family-primary mr-5">
                  <h1 class="is-size-4">${album.name}</h1>
                  <p class="is-size-5">${album.release_date}</p>
                  <a href="${album.external_urls.spotify}" target="_blank"> <img src="${album.images[1].url}" alt="${album.name}"></a>
                </div>
                  `;

                  // Ajoute le code HTML à l'élément "container"
                  container.insertAdjacentHTML('beforeend', htmlToAdd);
                });
              })
              .catch(error => console.error('Erreur lors de la récupération des albums :', error));
          } else {
            console.log(`Aucun artiste trouvé avec le nom ${artistName}`);
          }
        })
        .catch(error => console.error('Erreur lors de la recherche d\'artistes :', error));
    })
    .catch(error => console.error('Erreur lors de l\'obtention du jeton d\'authentification :', error));
}