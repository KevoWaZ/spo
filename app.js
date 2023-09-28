const tokenUrl = 'https://accounts.spotify.com/api/token';
const clientId = '1d4ff0355987413d96814ffa2bd8a82a'; // Remplace avec ton propre identifiant client Spotify
const clientSecret = '5c45da7510174e8fa6bda6bcbb7ebd25'; // Remplace avec ton propre identifiant client Spotify
let input = document.getElementById("input")
let btnTest = document.getElementById("btnTest")
let artistId
let singleId


// Configure l'authentification pour obtenir le jeton
const authOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
  },
  body: 'grant_type=client_credentials'
};


// Sélectionne tous les éléments <li> dans la liste des onglets
const tabs = document.querySelectorAll('.tabs ul li');
const tabContentBoxes = document.querySelectorAll('#tab-content > div')

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.remove('is-active'))
    tab.classList.add('is-active')

    const target = tab.dataset.target
    tabContentBoxes.forEach(box => {
      if (box.getAttribute('id') === target) {
        box.classList.remove('is-hidden')
      } else {
        box.classList.add('is-hidden')
      }
    })
  })
})

const container = document.getElementById('album');
const containerAlbum = document.getElementById('album');
const container2 = document.getElementById('single');


// Gère la recherche en temps réel lorsque l'utilisateur tape
input.addEventListener('input', () => {
  const container3 = document.getElementById('artist');
  const artistName = input.value;

  let mainTab = document.getElementById('mainTab')
  let albumTab = document.getElementById('albumTab')
  let singleTab = document.getElementById('singleTab')

  mainTab.classList.add("is-active")
  albumTab.classList.remove("is-active")
  singleTab.classList.remove("is-active")
  container.classList.add('is-hidden')

  // Supprime tous les enfants de l'élément "container" (les albums précédents)
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  while (container2.firstChild) {
    container2.removeChild(container2.firstChild);
  }

  // Vérifie que la longueur du texte est suffisante pour lancer une recherche (par exemple, au moins 3 caractères)
  if (artistName.length >= 3) {
    // Utilise une seule requête pour obtenir le jeton d'authentification
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
        }

        // Effectue la recherche d'artistes en temps réel
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, requestOptions)
          .then(response => response.json())
          .then(data => {
            // Efface les suggestions précédentes
            container3.innerHTML = '';

            let artistsWithImages = 0; // Compteur d'artistes avec des images

            for (let i = 0; i < data.artists.items.length && artistsWithImages < 6; i++) {
              const artist = data.artists.items[i];
              console.log(artist);

              let imageUrl;

              if (artist.images && artist.images[1] && artist.images[1].url) {
                imageUrl = artist.images[1].url;
                artistsWithImages++; // Incrémente le compteur d'artistes avec des images
              }

              const htmlToAdd = `

                  <div class="album card has-background-success-dark has-text-success-light has-text-centered is-family-primary mr-5 mb-5">
                    <div class="card-image">
                      <img id="artistImage-${artist.id}" src="${imageUrl}" alt="${artist.name}">
                    </div>
                    <h1 class="is-size-4">${artist.name}</h1>
                    <p class="is-size-5">${artist.genres[0]}</p>
                  </div>
                </div>
              </div>
              `;

              // Ajoute le code HTML à l'élément "container3"
              container3.insertAdjacentHTML('beforeend', htmlToAdd);
              container3.classList.remove('is-hidden');
            }



            // Ajoute les gestionnaires d'événements pour le clic sur les images d'artiste
            data.artists.items.forEach(artist => {
              const artistImage = document.getElementById(`artistImage-${artist.id}`);
              artistImage.addEventListener('click', () => {
                container3.innerHTML = ""
                mainTab.classList.remove('is-active')
                albumTab.classList.add('is-active')
                container.classList.remove('is-hidden')
                container2.classList.add('is-hidden')
                // Récupère le nom de l'artiste à partir de l'élément HTML

                if (artist) {
                  artistId = artist.id; // Obtient l'ID de l'artiste trouvé
                  console.log(artist);
                  console.log(`L'ID de l'artiste ${artistName} est : ${artistId}`);

                  // Récupère les albums de l'artiste spécifié en filtrant par le type (album ou single)
                  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?album_type=album&limit=50`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                      // data contient la liste des albums de l'artiste
                      console.log(data.items);
                      for (let i = 0; i < data.items.length; i++) {
                        const albumList = data.items[i]
                        console.log(`album ${i + 1}: ${albumList.name}, sortie le: ${albumList.release_date} avec ${albumList.total_tracks} son`);
                      }
                      // Affiche les albums
                      data.items.forEach(album => {
                        const htmlToAdd = `
                        <div class="album card has-background-success-dark has-text-success-light has-text-centered is-family-primary mr-5 mb-5">
                        <div class="card-image">
                        <a href="${album.external_urls.spotify}" target="_blank"> <img src="${album.images[1].url}" alt="${album.name}"></a>
                      </div>
                        <h1 class="is-size-4">${album.name}</h1>
                        <p class="is-size-5">${album.release_date}</p>
                      </div>
                        `;

                        // Ajoute le code HTML à l'élément "container"
                        container.insertAdjacentHTML('beforeend', htmlToAdd);
                      });
                    })
                    .catch(error => console.error('Erreur lors de la récupération des albums :', error));
                  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?album_type=single&limit=50`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                      // data contient la liste des albums de l'artiste
                      console.log(data.items);
                      for (let i = 0; i < data.items.length; i++) {
                        const albumList = data.items[i]
                        console.log(`single ${i + 1}: ${albumList.name}, sortie le: ${albumList.release_date} avec ${albumList.total_tracks} son, id: ${albumList.id}`);
                        singleId = albumList.id

                                              // Affiche les singles
                      fetch(`https://api.spotify.com/v1/albums/${singleId}` , requestOptions)
                      .then(response => response.json())
                      .then(data => {
                        console.log(data.tracks.items[0].id);
                        let id = data.tracks.items[0].id
                
                        fetch(`https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Fintl-fr%2Ftrack%2F${id}`)
                        .then(response => response.json())
                        .then(data => {
                          console.log(data);
                            let htmlToAdd = data.html
                
                            htmlToAdd = htmlToAdd.replace('height="152"', 'height="200"').replace('width="100%"', 'width="500px"')
                  
                            // Ajoute le code HTML à l'élément "container"
                            container2.insertAdjacentHTML('beforeend', htmlToAdd);
                        })              
                      })
                      }
                    })
                    .catch(error => console.error('Erreur lors de la récupération des albums :', error));
                } else {
                  console.log(`Aucun artiste trouvé avec le nom ${artistName}`);
                }

              });
            });
          });
      });
  }
});


btnTest.addEventListener('click', () => {
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
      }

      fetch('https://api.spotify.com/v1/albums/48afeIJZCY6l2itZzygOFX' , requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.tracks.items[0].id);
        let id = data.tracks.items[0].id

        fetch(`https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Fintl-fr%2Ftrack%2F${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
            let htmlToAdd = data.html

            htmlToAdd = htmlToAdd.replace('height="152"', 'height="200"')
  
            // Ajoute le code HTML à l'élément "container"
            container2.insertAdjacentHTML('beforeend', htmlToAdd);
        })

        fetch(`https://open.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Fintl-fr%2Ftrack%2F${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
            let htmlToAdd = data.html

            htmlToAdd = htmlToAdd.replace('height="152"', 'height="200"')
  
            // Ajoute le code HTML à l'élément "container"
            container2.insertAdjacentHTML('beforeend', htmlToAdd);
        })

      })

    })
})