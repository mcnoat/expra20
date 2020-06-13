function generateAlphabet() {
    let alphabet = [];
    let start = 'A'.charCodeAt(0);
    let last  = 'Z'.charCodeAt(0);
    for (let i = start; i <= last; i++) {
      alphabet.push(String.fromCharCode(i));
    }
  return alphabet;
}


function saveData(name, data){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
}