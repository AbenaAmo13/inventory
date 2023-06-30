
 let editButtons = document.querySelectorAll('.edit');
  console.log(editButtons)
  let saveButtons = document.querySelectorAll('.save');
  let cancelButtons = document.querySelectorAll('.cancel');
  let inputName={
      0: 'isbn',
      1: 'book_name',
      2: 'quantity_requested',
      3: 'year_group',
      4:'order_status',
      5:'date_requested'
  }
  // Add click event listeners to edit buttons
  editButtons.forEach(function(editButton) {
    editButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
      let row = this.parentNode.parentNode;
      console.log(row)
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
      /*row.querySelector('.cancel').style.display = 'none';*/
      row.querySelector('.edit').style.display = 'inline-block';
    });
  });


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
