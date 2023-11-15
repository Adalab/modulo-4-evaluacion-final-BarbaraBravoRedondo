// services/user.jsx
const sendLoginToApi = data => {
    fetch('//localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  };
  
  const sendSignUpToApi = data => {
    console.log('Se están enviando datos al signup:', data);
    return fetch('//localhost:5000/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  };
  
  const userFunctions = {
    sendLoginToApi: sendLoginToApi,
    sendSignUpToApi: sendSignUpToApi,
  };
  
  export default userFunctions;
  