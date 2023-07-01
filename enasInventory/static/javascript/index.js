
 let editButtons = document.querySelectorAll('.edit');
  console.log(editButtons)
  let saveButtons = document.querySelectorAll('.save');

  let cancelButtons = document.querySelectorAll('.cancel');
  let inputName={
      0: 'isbn',
      1: 'book_name',
      2: 'quantity_requested',
      3: 'year_group',
      4: 'order_status',
      5: 'date_requested'
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
        dataCell.innerHTML = '<input type="text" value="'+content+'"  name="' + input_name + '"  />';
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
    console.log(dataCells)
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
    // Perform AJAX request or submit the form
    // For example, using fetch API
    fetch('/save_edit_made', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
        headers:{'X-CSRFToken': csrftoken}
    })
    .then(response => {
            dataCells.forEach(function(dataCell, index) {
                let input_field = dataCell.querySelector('input');
                let updated_value = input_field.value
                dataCell.innerHTML = updated_value
            })
         this.style.display = 'none';
        row.querySelector('.edit').style.display = 'inline-block';

      // Handle the response
    })
    .catch(error => {
      // Handle errors
    });
  });
});

//Adding a new table entry:
   const add_row_btn = document.getElementById('add_new_entry_button');
   add_row_btn.addEventListener('click', function(event) {
       event.preventDefault(); // Prevent form submission
      const table = document.getElementById('books_inventory_table');
      let previous_row_index = (table.rows.length)-2
      let previous_row_id_value = table.rows[previous_row_index].cells[0]
       console.log(previous_row_id_value)
       let last_book_id = previous_row_id_value.querySelector('input[name="book_id"]')
       let current_row_id = parseInt(last_book_id.value) + 1
       console.log('The last book id is: '+ last_book_id.value)
        console.log('The current book id is: '+current_row_id)

      let new_row = table.insertRow(table.rows.length);
      let selection_cell=  new_row.insertCell()
       // Create the HTML content with multiple input elements
       const selectionHtmlContent = '<input type="checkbox" name="books_selection" value="' + current_row_id + '">' +
                    '<input type="hidden" name="book_id" value="'+current_row_id+'">';
        // Set the HTML content of the selection_cell
        selection_cell.innerHTML = selectionHtmlContent;


        let cells = {};
        for (let i = 0; i < 6; i++) {
            let input_name = inputName[i]
          let cellName = `cell${i + 1}`; // Dynamic cell name using template literal
          cells[cellName] = new_row.insertCell(); // Store the cell reference with dynamic name
            cells[cellName].innerHTML = '<input type="text"   name="' + input_name + '"  />'
        }


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
