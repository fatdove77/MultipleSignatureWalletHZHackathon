// import fs from 'fs'
import axios from 'axios';

function base64ToBlob(base64String, contentType) {
  const byteCharacters = window.atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}


export  function ImgToUrl(file){
  // file = base64ToBlob(file);
  let data = new FormData();
  
data.append('file', file);
data.append('bucket', 'fibochain');
data.append('collectionId', '0');
console.log(data);

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://upload.fibo.services/uploadFile',
  headers: { 
    // ...data.getHeaders()
  },
  data : data
};

 axios.request(config)
.then((response) => {
  console.log(JSON.parse(JSON.stringify(response.data)));
  return JSON.parse(JSON.stringify(response.data))
})
.catch((error) => {
  console.log(error);
});

}
