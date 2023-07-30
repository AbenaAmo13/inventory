

let editButtons = document.querySelectorAll('.edit');
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

  // Add click event listeners to edit buttons
editButtons.forEach(function (editBtn){
    editBtn.addEventListener('click', function (event){
        event.preventDefault()
        let row = this.parentNode.parentNode
        let form = new FormData()
        let bookId = this.getAttribute('data-book-id')
        form.append('book_id',bookId)
        let dataCells = row.querySelectorAll('.data');
        let isbn = dataCells[0]
        let input1 = document.createElement('input')
        input1.type = 'text'
        input1.name= 'isbn'
        input1.value = isbn.innerHTML
        isbn.innerHTML = ''
        isbn.appendChild(input1)

        let bookName = dataCells[1]
        let input2 = document.createElement('input')
        input2.type = 'text'
        input2.name= 'book_name'
        input2.value = bookName.innerHTML
        bookName.innerHTML = ''
        bookName.appendChild(input2)

        let quantity_requested = dataCells[2];
        let input3 = document.createElement('input');
        input3.type = 'number';
        input3.name = 'quantity_requested';
        input3.value = quantity_requested.innerText;
        quantity_requested.innerHTML = '';
        quantity_requested.appendChild(input3);

        let quantity_received = dataCells[3]
        let input4 = document.createElement('input')
        input4.type= 'number';
        input4.name = 'quantity_received'
        input4.value = quantity_received.innerText;
        quantity_received.innerHTML = '';
        quantity_received.appendChild(input4)

        let year_group = dataCells[4]
        let year_selection = document.createElement('select')
        year_selection.name = "year_group"
        year_options.forEach((option)=>{
            let option_name = document.createElement('option')
            option_name.text = option
            option_name.value = option
            if(option=== year_group.innerText){
                option_name.selected = true
            }
            year_selection.appendChild(option_name)
        })
        console.log(year_selection)
        year_group.innerHTML = ''
        year_group.appendChild(year_selection)

        this.style.display = 'none';
        let save = row.querySelector('.save')
        save.style.display = 'inline-block'
        let cancel = row.querySelector('.cancel')
        cancel.style.display= 'inline-block';
        row.querySelector('.delete').style.display= 'none';
        row.querySelector('.update_order').style.display= 'none';
        save.addEventListener('click', function (event){
            event.preventDefault()
            let inputValues = row.querySelectorAll('input, select')
            inputValues.forEach(inputValue=>{
                form.append(inputValue.name, inputValue.value)
            })
             const csrftoken = Cookies.get('csrftoken');
            fetch('/books/save_edit_made', {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
                headers: {'X-CSRFToken': csrftoken}
            }).then(r => {
                location.reload()
            })
        })
        cancel.addEventListener('click', function (event){
            location.reload()
        })






    })

})



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
        let cancelBtn = document.createElement('button')
        saveBtn.innerHTML = 'Save'
        saveBtn.className = 'add_book'
        cancelBtn.className = 'cancel_book'
        cancelBtn.innerHTML = 'Cancel'
        cell9.className = 'button_actions'
        cell9.appendChild(saveBtn)
        cell9.appendChild(cancelBtn)

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
        let cancelRow = newRow.querySelector('.cancel_book')
            cancelRow.addEventListener('click', function (event){
            location.reload()
        })

        })

    }


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

    let tableAppended = false; // Flag variable to keep track of whether the table has been appended

    let add_first_entry = document.getElementById('add_first_book')
    if(add_first_entry){
        add_first_entry.addEventListener('click', function (event){
            if(!tableAppended){
                          let div_container = document.getElementsByClassName('table_container')[0]
            let body = document.getElementsByTagName('body')[0]
            let table = document.createElement('table');
            let table_row = table.insertRow()
            let headers = ['ISBN', 'Book Name', 'Quantity Requested', 'Quantity Received', 'Year Group', 'Order Status', 'Date Added']
            headers.forEach(function (headers_name){
                let header_title = document.createElement('th')
                header_title.textContent = headers_name
                table_row.appendChild(header_title)
            })

            let input_row = table.insertRow()
            let input1_cell = input_row.insertCell()
            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'isbn'
            input1_cell.appendChild(input1)

            let input2_cell = input_row.insertCell()
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'book_name'
            input2_cell.appendChild(input2)

            let input3_cell = input_row.insertCell()
            let input3 = document.createElement('input')
            input3.type = 'number'
            input3.name = 'quantity_requested'
            input3_cell.appendChild(input3)

            let input4_cell = input_row.insertCell()
            let input4 = document.createElement('input')
            input4.type = 'number'
            input4.name = 'quantity_received'
            input4_cell.appendChild(input4)

            let input5_cell = input_row.insertCell()
            const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']
            let year_group_element = document.createElement('select')
            year_group_element.name='year_group'
            year_options.forEach((option_name,index)=>{
                option_name = document.createElement('option');
                option_name.value = year_options[index]
                option_name.text = year_options[index]
                year_group_element.appendChild(option_name)
            })
            input5_cell.appendChild(year_group_element)

            let input6_cell = input_row.insertCell()
            const order_options = ['REQUESTED', 'ORDERED', 'RECEIVED']
            let order_group_element = document.createElement('select')
            order_group_element.name = 'order_status'
                order_options.forEach((order_items, index)=>{
                    order_items = document.createElement('option');
                    order_items.value = order_options[index]
                    order_items.text = order_options[index]
                    order_group_element.appendChild(order_items)
                })
            input6_cell.appendChild(order_group_element)


            let input7 = document.createElement('input')
            input7.value=new Date().toISOString().slice(0, 16)
            input7.type= 'datetime-local'
            input7.name= 'date_added'
            input7.readOnly = true
            let input7_cell = input_row.insertCell()
            input7_cell.appendChild(input7)


            div_container.appendChild(table)
             tableAppended = true; // Set the flag to true, indicating that the table has been appended
            }


        })
    }











