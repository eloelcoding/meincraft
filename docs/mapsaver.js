class MapSaver {
    loadMap() {
        let mapName = prompt("Enter map name:");
        if (mapName) {
          fetch(`/api/map/${mapName}`)
            .then((response) => response.json())
            .then((data) => {
                debugger;
              // Handle the response data
              console.log(data);
            })
            .catch((error) => {
              // Handle any errors
              console.error(error);
            });
        }
    }
}