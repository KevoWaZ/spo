const tokenUrl = 'https://accounts.spotify.com/api/token';
const clientId = '1d4ff0355987413d96814ffa2bd8a82a'; // Remplace avec ton propre identifiant client Spotify
const clientSecret = '5c45da7510174e8fa6bda6bcbb7ebd25'; // Remplace avec ton propre identifiant client Spotify
let btn = document.getElementById("btn")
let btn2 = document.getElementById("btn2")
let input = document.getElementById("input")
let artistId;


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
});

btn2.addEventListener('click', () => {
  getData('single');
});

function getData(albumType) {
  console.clear();

  let artistName = input.value; // Demande le nom de l'artiste à l'utilisateur

  // Sélectionne l'élément HTML où tu veux afficher les albums
  const container = document.getElementById('la');

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
          // data contient la réponse de la recherche
          const artist = data.artists.items[0]; // Prends le premier artiste de la liste (le plus pertinent)
          for (let i = 0; i < 3 && i < data.artists.items.length; i++) {
            const artist = data.artists.items[i]
            console.log(`Artiste retenu: ${artist.name}`);
          }
          if (artist) {
            artistId = artist.id; // Obtient l'ID de l'artiste trouvé
            console.log(`L'ID de l'artiste ${artistName} est : ${artistId}`);

            // Récupère les albums de l'artiste spécifié en filtrant par le type (album ou single)
            fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?album_type=${albumType}`, requestOptions)
              .then(response => response.json())
              .then(data => {
                // data contient la liste des albums de l'artiste
                console.log(data.items);
                for (let i = 0; i < data.items.length; i++) {
                  const albumList = data.items[i]
                  console.log(`Album ${i + 1}: ${albumList.name}, sortie le: ${albumList.release_date} avec ${albumList.total_tracks} son`);
                }
                // Affiche les albums
                data.items.forEach(album => {
                  const htmlToAdd = `
                    <div class="album mr-5">
                      <h1 class="is-size-4">${album.name}</h1>
                      <p class="is-size-5">${album.release_date}</p>
                      <img src="${album.images[0].url}" alt="${album.name}">
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
