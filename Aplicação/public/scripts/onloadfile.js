window.onload = function() {
    document.getElementById('send-btn')
      .addEventListener('click', uploadFiles, false);

    document.getElementById('get-files')
      .addEventListener('click', getAllFiles, false);
    
    function getAllFiles() {
      let path ='/dataFiles'
      httpRequest('GET', path, null, (err, res) => {
        if(err) return alert(err)
        displayContents(res, 'file-list', 'innerHTML')
      })
    }
}

function displayContents(contents, elem, evt) {
  var element = document.getElementById(elem);
  element[evt] = contents;
}


