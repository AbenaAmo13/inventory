

let editButtons = document.querySelectorAll('.edit');
  console.log(editButtons)
  let saveButtons = document.querySelectorAll('.save');
  let cancelButtons = document.querySelectorAll('.cancel');
  const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']
  const order_status_options = ['REQUESTED', 'ORDERED','RECEIVED']
  let inputName={
      0: 'isbn',
      1: 'book_name',
      2: 'quantity_requested',
      3: 'quantity_received',
      4: 'year_group',
      5: 'order_status',
      6: 'date_requested'
  }
  let inputType={
      0:'text',
      1: 'text',
      2:'number',
      3:'number',
      4: 'text',
      5: 'select',
      6: 'date',
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
        dataCell.innerHTML = '<input type="text" value="'+content+'"  name="' + input_name + '" required  />';
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
    fetch('/books/save_edit_made', {
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
    if(add_row_btn){
    add_row_btn.addEventListener('click', function (event){
             event.preventDefault(); // Prevent form submission
        const table = document.getElementById('books_inventory_table');
        let newRow = table.insertRow()
        let input1 = document.createElement('input')
        input1.type='checkbox'
        input1.name = 'select_checkbox'
        let cell1 = newRow.insertCell()
        cell1.append(input1)

        let input2 = document.createElement('input')
        input2.type='text'
        input2.name = 'isbn'
        input2.required = true
        let cell2 = newRow.insertCell()
        cell2.append(input2)

        let input3 = document.createElement('input')
        input3.type='text'
        input3.name = 'book_name'
        input3.required = true
        let cell3 = newRow.insertCell()
        cell3.append(input3)

        let input4 = document.createElement('input')
        input4.type='number'
        input4.name = 'quantity_requested'
        input4.required = true
        let cell4 = newRow.insertCell()
        cell4.append(input4)

        let input5 = document.createElement('input')
        input5.type='number'
        input5.name = 'quantity_received'
        input5.required = true
        let cell5 = newRow.insertCell()
        cell5.append(input5)

        let year_group_selection = document.createElement('select')
        let cell6 = newRow.insertCell()
        year_options.forEach(function (option_name, index){
            option_name = document.createElement('option');
            option_name.value = year_options[index]
            option_name.text = year_options[index]
            year_group_selection.appendChild(option_name)
        })
        year_group_selection.name= 'year_group'
        year_group_selection.required = true
        cell6.append(year_group_selection)

        let cell7 = newRow.insertCell()
        let order_status_selection = document.createElement('select')
        order_status_selection.required = true
        order_status_selection.name = 'order_status'
        order_status_options.forEach(function (option_name, index){
            option_name= document.createElement('option')
            option_name.value = order_status_options[index]
            option_name.text = order_status_options[index]
            order_status_selection.appendChild(option_name)
        })
        cell7.append(order_status_selection)

        let input6 = document.createElement('input')
        input6.value=new Date().toISOString().slice(0, 16)
        input6.type= 'datetime-local'
        input6.name= 'date_added'
        input6.readOnly = true
        let cell8 = newRow.insertCell()
        cell8.appendChild(input6)

        let cell9 = newRow.insertCell()
        let saveBtn = document.createElement('button')
        saveBtn.innerHTML = 'Save'
        saveBtn.className = 'add_book'
        cell9.appendChild(saveBtn)

        let addStudentRow = newRow.querySelector('.add_book')
        addStudentRow.addEventListener('click', function (event){
            let form = new FormData()
            let inputData = newRow.querySelectorAll('input, select')
            inputData.forEach((data)=>{
                console.log(data.name, data.value)
                form.append(data.name, data.value)
            })
             const csrftoken = Cookies.get('csrftoken');

            fetch('/books/add_book_entry', {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
                headers:{'X-CSRFToken': csrftoken}
            }).then(r =>{
                location.reload()
            })

        })







        })
    }






   /*      add_row_btn.addEventListener('click', function(event) {
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

         const fieldConfigs = [
    {
      fieldName: 'isbn',
      type: 'text',
      defaultValue: '',
    },
    {
      fieldName: 'book_name',
      type: 'text',
      defaultValue: '',
    },
    {
      fieldName: 'quantity_requested',
      type: 'text',
      defaultValue: '',
    },
    {
      fieldName: 'year_group',
      type: 'text',
      defaultValue: '',
    },
    {
      fieldName: 'order_status',
      type: 'select',
      options: ['REQUESTED', 'RECEIVED', 'ORDERED'],
    },
    {
      fieldName: 'date_added',
      type: 'datetime-local',
      defaultValue: new Date().toISOString().slice(0, 16),
    },
  ];


      fieldConfigs.forEach(function(fieldConfig) {
        let cell = new_row.insertCell();
        let inputHTML = '';
        if (fieldConfig.type === 'select') {
          let optionsHTML = fieldConfig.options
            .map(option => `<option value="${option}">${option}</option>`)
            .join('');
          inputHTML = `<select name="${fieldConfig.fieldName}" required>${optionsHTML}</select>`;
        } else {
          inputHTML = `<input type="${fieldConfig.type}" name="${fieldConfig.fieldName}" value="${fieldConfig.defaultValue}" required />`;
        }
        cell.innerHTML = inputHTML;
      });

      let button_action_cell = new_row.insertCell()
      const button_save = '<button class="add_new_save">Save</button>'
      button_action_cell.innerHTML = button_save
      // Attach event listener to the newly added save button
      let add_new_save = new_row.querySelector('.add_new_save');
      add_new_save.addEventListener('click', function(event) {
        //alert('Add button saved clicked');
        event.preventDefault(); // Prevent form submission
         // Send the data to the endpoint
        let formData = new FormData();
        let row = this.parentNode.parentNode;
        let inputCells = row.querySelectorAll('input, select')
        inputCells.forEach(function(input, index){
            /!*console.log("The field names are" + input.name)
            console.log('The field values are: ' + input.value)*!/
            formData.append(input.name, input.value)
            //formData.append(,input.value)
            //console.log(input.value)
        })

          //To enable csrf token in a javascript post
     const csrftoken = Cookies.get('csrftoken');
           // For example, using fetch API
    fetch('/books/add_book_entry', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
        headers:{'X-CSRFToken': csrftoken}
    })
    .then(response => {
        location.reload()

      // Handle the response
    })
    .catch(error => {
      // Handle errors
    });
      });
});*/




     let updateOrderButtons = document.querySelectorAll('.update_order');
     updateOrderButtons.forEach(function (button){
         button.addEventListener('click', function (event){
             let updated_order_status
             event.preventDefault(); // Prevent form submission
             let row = this.parentNode.parentNode;
             let dataCell = row.querySelector('.order_status_data');
             let cell_status = dataCell.innerHTML
                 if (cell_status==="REQUESTED"){
                      updated_order_status= "ORDERED"
                 }else{
                      updated_order_status= "RECEIVED"
                 }
              let book_id = row.querySelector('input[name="book_id"]')
             // console.log("The book id value is: " + book_id.value)
              let formData = new FormData()
             formData.append('book_id', book_id.value);
             formData.append('order_status', updated_order_status)
             //To enable csrf token in a javascript post
             const csrToken = Cookies.get('csrftoken');
             fetch('/books/update_order_status', {
              method: 'POST',
              body: formData,
              credentials: 'same-origin',
                headers:{'X-CSRFToken': csrToken}
            })
            .then(response => {
                 location.reload()

            })
            .catch(error => {
              // Handle errors
            });


             console.log("UPDATED ORDER STATUS: " + updated_order_status)
         })
     })


    // Delete function to remove an item in the table in the dashboard.html
    let deleteButton = document.querySelectorAll('.delete')
    deleteButton.forEach(function (button){
        button.addEventListener('click', function(event){
            event.preventDefault()
            let row = this.parentNode.parentNode;
            let selected_book = row.querySelector('input[name="book_id"]')
            console.log("SELECTED BOOK ID: " + selected_book.value)
            let formData = new FormData()
            formData.append('book_id', selected_book.value)
             //To enable csrf token in a javascript post
             const csrToken = Cookies.get('csrftoken');
             fetch('/books/delete_book_item', {
              method: 'POST',
              body: formData,
              credentials: 'same-origin',
                headers:{'X-CSRFToken': csrToken}
            })
            .then(response => {
                location.reload()
              // Handle the response
            })
            .catch(error => {
              // Handle errors
            });
        })
    })











 /*  //This is to save the newly added column to the backend
    let add_new_save = document.querySelectorAll('.add_new_save');
    add_new_save.forEach(function(addButton) {
        addButton.addEventListener('click', function(event) {
            alert('Add button saved clicked')
            event.preventDefault(); // Prevent form submission
            let row = this.parentNode.parentNode;
            console.log("Add button row: " + row)

        })

    })*/




/*
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
