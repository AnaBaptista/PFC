window.onload = function () {
    document.getElementById("btn").addEventListener('click', readFile)

    function readFile(e) {
        let elem = document.getElementById('file-input')

        let file = elem.files[0]
        if (!file) {
            return;
        }

        const reader = new FileReader()
        reader.onload = function(e) {
            const contents = e.target.result
            displayContents(contents);
        };
        reader.readAsText(file);
    }

    function displayContents(contents) {
        const element = document.getElementById('file-content')
        element.textContent = contents;
    }

}