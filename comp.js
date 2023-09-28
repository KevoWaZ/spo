let idArray = []
let idArray2 = []
let nameArray = []
let nameArray2 = []

test.addEventListener('click', () => {
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
      console.log(data);
      const accessToken = data.access_token; // Récupère le jeton d'authentification

      // Utilise le jeton d'authentification pour authentifier tes requêtes à l'API Spotify
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      let Sefyu = "13MkEbt8Xbn3SIa0o5eRSi%2C2o2S4OBFZlVHnlz9WyfjpN%2C336TZOLs1WajqjWuNN0Ima%2C1uB8iizIyyNXqFZKJMzV2Y%2C5NhFwZOMIpoLiP8VKbjWKV%2C1kNJxuonnyOce6uSfG6qOn%2C6MBfjDdBNwYnjJIwJdCuCZ%2C6bjg9iIJ3BBKkcJlF60OZ9"
      
      fetch(`https://api.spotify.com/v1/artists/5t28BP42x2axFnqOOMg3CM/top-tracks?market=FR`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
    
        // Tableau pour stocker les IDs

    
        for (let i = 0; i < data.tracks.length; i++) {
          idArray.push(data.tracks[i].id);
          nameArray.push(data.tracks[i].name);
        }
        // Join les IDs avec le caractère "%" comme délimiteur
        let delimitedIds = idArray.join("%2C");
        console.log(delimitedIds);

        fetch(`https://api.spotify.com/v1/audio-features?ids=${delimitedIds}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            let totalDanceability = 0;
            let totalEnery = 0
            let totalTempo = 0
    
            for (let i = 0; i < data.audio_features.length; i++) {
              let datas = data.audio_features[i];
              console.log(`Chanson ${i + 1}: ${nameArray[i]} ${datas.danceability}`);
              totalDanceability += datas.danceability;
              console.log(`Chanson ${i + 1}: ${nameArray[i]} ${datas.energy}`);
              totalEnery += datas.energy;
              console.log(`Chanson ${i + 1}: ${nameArray[i]} ${datas.tempo}`);
              totalTempo += datas.tempo;
              console.log(`Danceability: ${datas.danceability}, Energy: ${datas.energy}, Tempo: ${datas.tempo}`);
              console.log("____________________________");
            }
    
            const averageDanceability = totalDanceability / data.audio_features.length;
            console.log(`Moyenne danceability: ${averageDanceability}`);
            const averageEnety = totalEnery / data.audio_features.length;
            console.log(`Moyenne energy: ${averageEnety}`);
            const averageTempo = totalTempo / data.audio_features.length;
            console.log(`Moyenne tempo: ${averageTempo}`);
          })
      });
      fetch(`https://api.spotify.com/v1/artists/5gqmbbfjcikQBzPB5Hv13I/top-tracks?market=FR`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
    
        // Tableau pour stocker les IDs

    
        for (let i = 0; i < data.tracks.length; i++) {
          idArray2.push(data.tracks[i].id);
          nameArray2.push(data.tracks[i].name);
        }
        // Join les IDs avec le caractère "%" comme délimiteur
        let delimitedIds = idArray2.join("%2C");
        console.log(delimitedIds);

        fetch(`https://api.spotify.com/v1/audio-features?ids=${delimitedIds}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            let totalDanceability = 0;
            let totalEnery = 0
            let totalTempo = 0
    
            for (let i = 0; i < data.audio_features.length; i++) {
              let datas = data.audio_features[i];
              console.log(`Chanson ${i + 1}: ${nameArray2[i]} ${datas.danceability}`);
              totalDanceability += datas.danceability;
              console.log(`Chanson ${i + 1}: ${nameArray2[i]} ${datas.energy}`);
              totalEnery += datas.energy;
              console.log(`Chanson ${i + 1}: ${nameArray2[i]} ${datas.tempo}`);
              totalTempo += datas.tempo;
              console.log(`Danceability: ${datas.danceability}, Energy: ${datas.energy}, Tempo: ${datas.tempo}`);
              console.log("____________________________");
            }
    
            const averageDanceability = totalDanceability / data.audio_features.length;
            console.log(`Moyenne danceability: ${averageDanceability}`);
            const averageEnety = totalEnery / data.audio_features.length;
            console.log(`Moyenne energy: ${averageEnety}`);
            const averageTempo = totalTempo / data.audio_features.length;
            console.log(`Moyenne tempo: ${averageTempo}`);
          })
      });
    })

  })