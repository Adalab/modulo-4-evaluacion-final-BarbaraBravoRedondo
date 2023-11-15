// services/api.jsx
const getDreamsFromApi = () => {
  console.log('Se están pidiendo las películas de la app');
  
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
