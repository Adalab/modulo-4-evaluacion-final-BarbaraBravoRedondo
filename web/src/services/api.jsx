// services/api.jsx
const getDreamsFromApi = () => {
  console.log('Se están pidiendo las películas de la app');
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch(`//localhost:5000/dreams`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const api = {
  getDreamsFromApi: getDreamsFromApi,
};

export default api;
