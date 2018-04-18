window.onload = function () {
  /**
   * submit button on click listener
   */
  document.getElementById('send-btn').click(uploadFiles)

  $('#send-btn').click(uploadFiles)

  /**
   * files input on change listener
   */
  $('#data-file-input').change((evt) => {
    $('#data-file-label').text(evt.currentTarget.value)
  })

  $('#ontology-file-input').change((evt) => {
    $('#ontology-file-label').text(evt.currentTarget.value)
  })
}
