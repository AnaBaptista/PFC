function uploadFiles() {
    let data = document.getElementById('data-file-input');
    let ontology = document.getElementById('ontology-file-input');
    
    let dataFile = data.files[0];
    if (!dataFile) {
      alert('Data file required');
      return;
    }

   let ontologyFile = ontology.files[0];
    if (!ontologyFile) {
      alert('Ontology file required');
      return;
    }

    uploadSingleFile('/dataFile', dataFile, 'data-file-content')
    //endpoint ainda nao existe no chaospop
  //  uploadSingleFile('/ontologyFile', ontologyFile, 'ontology-file-content')
}

function uploadSingleFile(path, file, contentFile) {
  let formData = new FormData()
  formData.append('file', file)
  
  httpRequest('POST', path, formData, (err, res) => {
    if(err) return alert(err)
    let reader = new FileReader();
    reader.onload = function(e) {
      let contents = e.target.result;
      displayContents(contents, contentFile, 'textContent');
    };
    reader.readAsText(file);
  })
}
