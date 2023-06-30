
 let editButtons = document.querySelectorAll('.edit');
  console.log(editButtons)
  let saveButtons = document.querySelectorAll('.save');
  let cancelButtons = document.querySelectorAll('.cancel');
  let inputName={
      0: 'isbn',
      1: 'book_name',
      2: 'quantity_requested',
      3: 'year_group',
  }
  // Add click event listeners to edit buttons
  editButtons.forEach(function(editButton) {
    editButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
      let row = this.parentNode.parentNode;
      console.log(row)
     // Get the updated values from input fields
      let dataCells = row.querySelectorAll('.data');
      // Convert data cells to input fields
      dataCells.forEach(function(dataCell, index) {
          console.log(index)
          let input_name = inputName[index]
          console.log(input_name)
        let content = dataCell.innerHTML;
        dataCell.innerHTML = '<input type="text" value="' + content + '"  name="' + input_name + '"  />';
      });
      this.style.display = 'none';
      row.querySelector('.save').style.display = 'inline-block';
/*
      row.querySelector('.cancel').style.display = 'inline-block';*!/
*/
    });
  });

  // Add click event listeners to save buttons
saveButtons.forEach(function(saveButton) {
  saveButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    let row = this.parentNode.parentNode;
    let dataCells = row.querySelectorAll('.data');
    // Send the data to the endpoint
    let formData = new FormData();
    let bookId = this.getAttribute('data-book-id');
    // Get the updated values from input fields
    let updatedValues = [];
    formData.append('book_id', bookId);
    dataCells.forEach(function(dataCell, index) {
      let input_field = dataCell.querySelector('input');
      let updated_value = input_field.value
      let input_name= inputName[index]
      formData.append(input_name, updated_value)
      /*let updatedValue = inputField.value;
      updatedValues.push(updatedValue);*/
    });
    //To enable csrf token in a javascript post
    const csrftoken = Cookies.get('csrftoken');


    /*updatedValues.forEach(value)*/

    // Add other form data if needed
    // formData.append('field_name', field_value);

    // Perform AJAX request or submit the form
    // For example, using fetch API
    fetch('/save_edit_made', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
        headers:{'X-CSRFToken': csrftoken}

    })
    .then(response => {
      // Handle the response
    })
    .catch(error => {
      // Handle errors
    });
  });
});











    /*// Add click event listeners to save buttons
  saveButtons.forEach(function(saveButton) {
    saveButton.addEventListener('click', function(event) {
        console.log('save button clicked')
      event.preventDefault(); // Prevent form submission
      let row = this.parentNode.parentNode;
      let dataCells = row.querySelectorAll('.data');

      // Update data cells with input values
      dataCells.forEach(function(dataCell) {
        let input = dataCell.querySelector('input');
        dataCell.innerHTML = input.value;
      });

      this.style.display = 'none';
      /!*row.querySelector('.cancel').style.display = 'none';*!/
      row.querySelector('.edit').style.display = 'inline-block';
    });
  });
*/

/*
  let editButtons = document.querySelectorAll('.edit');
  console.log(editButtons)
  let saveButtons = document.querySelectorAll('.save');
  let cancelButtons = document.querySelectorAll('.cancel');

  // Add click event listeners to edit buttons
  editButtons.forEach(function(editButton) {
    editButton.addEventListener('click', function() {
      let row = this.parentNode.parentNode;
      console.log(row)
      let dataCells = row.querySelectorAll('.data');

      // Convert data cells to input fields
      dataCells.forEach(function(dataCell) {
        var content = dataCell.innerHTML;
        dataCell.innerHTML = '<input type="text" value="' + content + '" />';
      });

      this.style.display = 'none';
      row.querySelector('.save').style.display = 'inline-block';
      row.querySelector('.cancel').style.display = 'inline-block';
    });
  });

  // Add click event listeners to save buttons
  saveButtons.forEach(function(saveButton) {
    saveButton.addEventListener('click', function() {
      var row = this.parentNode.parentNode;
      var dataCells = row.querySelectorAll('.data');

      // Update data cells with input values
      dataCells.forEach(function(dataCell) {
        var input = dataCell.querySelector('input');
        dataCell.innerHTML = input.value;
      });

      this.style.display = 'none';
      row.querySelector('.cancel').style.display = 'none';
      row.querySelector('.edit').style.display = 'inline-block';
    });
  });

  // Add click event listeners to cancel buttons
  cancelButtons.forEach(function(cancelButton) {
    cancelButton.addEventListener('click', function() {
      var row = this.parentNode.parentNode;
      var dataCells = row.querySelectorAll('.data');

      // Reset data cells to their original content
      dataCells.forEach(function(dataCell) {
        var input = dataCell.querySelector('input');
        dataCell.innerHTML = input.getAttribute('value');
      });

      this.style.display = 'none';
      row.querySelector('.save').style.display = 'none';
      row.querySelector('.edit').style.display = 'inline-block';
    });
  });
*/
