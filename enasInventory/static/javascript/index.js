window.addEventListener('load', function () {
    addNewBookItem()
    
  })



let editButtons = document.querySelectorAll('.edit');
const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']
const order_status_options = ['REQUESTED', 'ORDERED', 'RECEIVED']
let inputName = {
    0: 'isbn',
    1: 'book_name',
    2: 'quantity_requested',
    3: 'quantity_received',
    4: 'year_group',
    5: 'order_status',
    6: 'date_requested'
}

// Add click event listeners to edit buttons
editButtons.forEach(function (editBtn) {
    editBtn.addEventListener('click', function (event) {
        event.preventDefault()
        let row = this.parentNode.parentNode
        let form = new FormData()
        let bookId = this.getAttribute('data-book-id')
        form.append('book_id', bookId)
        let dataCells = row.querySelectorAll('.data');
        let isbn = dataCells[0]
        let input1 = document.createElement('input')
        input1.type = 'text'
        input1.name = 'isbn'
        input1.classList.add('textfield_mui')
        input1.value = isbn.innerHTML
        isbn.innerHTML = ''
        isbn.appendChild(input1)

        let bookName = dataCells[1]
        let input2 = document.createElement('input')
        input2.type = 'text'
        input2.name = 'book_name'
        input2.classList.add('textfield_mui')
        input2.value = bookName.innerHTML
        bookName.innerHTML = ''
        bookName.appendChild(input2)

        let quantity_requested = dataCells[2];
        let input3 = document.createElement('input');
        input3.type = 'number';
        input3.name = 'quantity_requested';
        input3.classList.add('textfield_mui')
        input3.value = quantity_requested.innerText;
        quantity_requested.innerHTML = '';
        quantity_requested.appendChild(input3);

        let quantity_received = dataCells[3]
        let input4 = document.createElement('input')
        input4.classList.add('textfield_mui')
        input4.type = 'number';
        input4.name = 'quantity_received'
        input4.value = quantity_received.innerText;
        quantity_received.innerHTML = '';
        quantity_received.appendChild(input4)

        let year_group = dataCells[4]
        let year_selection = document.createElement('select')
        year_selection.classList.add('mui_select')
        year_selection.name = "year_group"
        year_options.forEach((option) => {
            let option_name = document.createElement('option')
            option_name.text = option
            option_name.value = option
            if (option === year_group.innerText) {
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
        cancel.style.display = 'inline-block';
        row.querySelector('.delete').style.display = 'none';
        row.querySelector('.update_order').style.display = 'none';
        save.addEventListener('click', function (event) {
            event.preventDefault()
            let inputValues = row.querySelectorAll('input, select')
            inputValues.forEach(inputValue => {
                form.append(inputValue.name, inputValue.value)
            })
            const csrftoken = Cookies.get('csrftoken');
            fetch('/books/save_edit_made', {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
                headers: { 'X-CSRFToken': csrftoken }
            }).then(r => {
                location.reload()
            })
        })
        cancel.addEventListener('click', function (event) {
            location.reload()
        })






    })

})


function apiFunctions(methodType, dataBody){
    const csrftoken = Cookies.get('csrftoken');

    fetch('api/', {
        method: `${methodType}`,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken

        },
        body: JSON.stringify(dataBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Optionally, redirect to another page or perform any other action upon success
    })
    .catch(error => {
        console.error('Error:', error);
    });

}
function addNewBookItem(){
    //Adding a new table entry:
    const add_row_btn = document.getElementById('add_new_entry_button');
    if (add_row_btn) {
        add_row_btn.addEventListener('click', function (event) {
            console.log()
            event.preventDefault(); // Prevent form submission
            const table = document.getElementById('books_inventory_table');
            let newRow = table.insertRow()
            const elements = [
                { type: 'checkbox', name: 'select_checkbox', required: true },
                { type: 'text', name: 'isbn', required: true, class: 'textfield_mui'},
                { type: 'text', name: 'book_name', required: true, class: 'textfield_mui'},
                { type: 'number', name: 'quantity_requested', required: true, class: 'textfield_mui' },
                { type: 'number', name: 'quantity_received', required: true, class: 'textfield_mui' }
            ];

            elements.forEach(element => {
                let input = Object.assign(document.createElement('input'), element);
                input.classList.add(element.class)
                newRow.insertCell().appendChild(input);
            });

            ['year_group', 'order_status'].forEach(name => {
                let select = newRow.insertCell().appendChild(document.createElement('select'));
                select.classList.add('textfield_mui');
                select.name = name;
                select.required = true;
                
                const options = name === 'year_group' ? year_options : order_status_options;
                options.forEach(option => select.add(new Option(option, option)));
            });

            let dateInput = Object.assign(document.createElement('input'), {
                value: new Date().toISOString().slice(0, 16),
                type: 'datetime-local',
                name: 'date_added',
                class: 'textfield_mui',
                readOnly: true
            });
            newRow.insertCell().appendChild(dateInput);
            ['Save', 'Cancel'].forEach(action => {
                let button = newRow.insertCell().appendChild(document.createElement('button'));
                button.className = action === 'Save' ? 'add_book button_style' : 'cancel_book button_style';
                button.innerHTML = `<div class="align-button">${action}</div>`;
            });

            newRow.querySelector('.cancel_book').addEventListener('click', function (event) {
                location.reload()
            })
            newRow.querySelector('.add_book').addEventListener('click', function(event){
            let booksData = {
                    'isbn': newRow.querySelector('[name="isbn"]').value, 
                    'book_name': newRow.querySelector('[name="book_name"]').value, 
                    'year_group': newRow.querySelector('[name="year_group"]').value,
                    'date_requested': newRow.querySelector('[name="date_added"]').value,
                    'order_status':newRow.querySelector('[name="order_status"]').value,
                    'quantity_needed': newRow.querySelector('[name="quantity_requested"]').value,
                    'quantity_received': newRow.querySelector('[name="quantity_received"]').value
                }
            apiFunctions('POST', booksData)
            })
            
    
        })
    
    }

}





let updateOrderButtons = document.querySelectorAll('.update_order');
updateOrderButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        let updated_order_status
        event.preventDefault(); // Prevent form submission
        let row = this.parentNode.parentNode;
        let dataCell = row.querySelector('.order_status_data');
        let cell_status = dataCell.innerHTML
        if (cell_status === "REQUESTED") {
            updated_order_status = "ORDERED"
        } else {
            updated_order_status = "RECEIVED"
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
            headers: { 'X-CSRFToken': csrToken }
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
deleteButton.forEach(function (button) {
    button.addEventListener('click', function (event) {
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
            headers: { 'X-CSRFToken': csrToken }
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
if (add_first_entry) {
    add_first_entry.addEventListener('click', function (event) {
        if (!tableAppended) {
            let div_container = document.getElementsByClassName('table_container')[0]
            let table = document.createElement('table');
            let table_row = table.insertRow()
            
            let headers = ['Hidden','ISBN', 'Book Name', 'Quantity Requested', 'Quantity Received', 'Year Group', 'Order Status', 'Date Added', 'Actions']
            headers.forEach(function (headers_name) {
                let header_title = document.createElement('th')
                header_title.textContent = headers_name
                if (headers_name==="Hidden"){
                    header_title.style.display='none'

                }
                table_row.appendChild(header_title)
            })
            let input_row = table.insertRow()
            let hidden_cell = input_row.insertCell()
            hidden_cell.style.display='none'

            let input1_cell = input_row.insertCell()
            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'isbn'
            input1.setAttribute('data-column-index', 1)
            input1.classList.add('textfield_mui')
            input1_cell.appendChild(input1)
            
    
            let input2_cell = input_row.insertCell()
            let input2 = document.createElement('input')
            input2.setAttribute('data-column-index', 2)
            input2.type = 'text'
            input2.name = 'book_name'
            input2.classList.add('textfield_mui')
            input2_cell.appendChild(input2)

            let input3_cell = input_row.insertCell()
            let input3 = document.createElement('input')
            input3.classList.add('textfield_mui')
            input3.type = 'number'
            input3.name = 'quantity_requested'
            input3_cell.appendChild(input3)

            let input4_cell = input_row.insertCell()
            let input4 = document.createElement('input')
            input4.type = 'number'
            input4.name = 'quantity_received'
            input4.classList.add('textfield_mui')
            input4_cell.appendChild(input4)

            let input5_cell = input_row.insertCell()
            const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']
            let year_group_element = document.createElement('select')
            year_group_element.name = 'year_group'
            year_options.forEach((option_name, index) => {
                option_name = document.createElement('option');
                option_name.value = year_options[index]
                option_name.text = year_options[index]
                year_group_element.appendChild(option_name)
            })
            year_group_element.classList.add('mui_select')
            
            input5_cell.appendChild(year_group_element)

            let input6_cell = input_row.insertCell()
            const order_options = ['REQUESTED', 'ORDERED', 'RECEIVED']
            let order_group_element = document.createElement('select')
            order_group_element.name = 'order_status'
            order_options.forEach((order_items, index) => {
                order_items = document.createElement('option');
                order_items.value = order_options[index]
                order_items.text = order_options[index]
                order_group_element.appendChild(order_items)
            })
            order_group_element.classList.add('mui_select')
            input6_cell.appendChild(order_group_element)


            let input7 = document.createElement('input')
            input7.value = new Date().toISOString().slice(0, 16)
            input7.type = 'datetime-local'
            input7.name = 'date_added'
            input7.classList.add('textfield_mui')
            input7.readOnly = true
            let input7_cell = input_row.insertCell()
            input7_cell.appendChild(input7)

            let input8_cell = input_row.insertCell()
            let button_save = document.createElement('button')
            button_save.className = 'save_button'
            button_save.textContent = 'Save'
            let span_element_save = document.createElement('span')
            span_element_save.classList.add('material-symbols-outlined')
            span_element_save.textContent = 'save'
            button_save.classList.add('button_style')
            button_save.classList.add('align-button')
            button_save.appendChild(span_element_save)


            let button_cancel = document.createElement('button')
            let button_icon = document.createElement('span')
            button_icon.classList.add('material-symbols-outlined')
            button_icon.textContent = 'close'
    
            button_cancel.className = 'cancel_button'
            button_cancel.classList.add('button_style')
            button_cancel.textContent = 'Cancel'

            button_cancel.appendChild(button_icon)
            button_cancel.classList.add('align-button')

            input8_cell.appendChild(button_save)
            input8_cell.appendChild(button_cancel)
            input8_cell.className = 'added_table'
            div_container.appendChild(table)
            tableAppended = true; // Set the flag to true, indicating that the table has been appended
            let formData = new FormData()
            let save_add = input_row.querySelector('.save_button')
            if (save_add) {
                save_add.addEventListener('click', function (event) {
                    let valid = true
                    let inputCells = input_row.querySelectorAll('input, select')
                    inputCells.forEach(function (input, index) {
                        let cellInput = input.parentElement
                        if(!input.value){
                            valid = false;
                            input.classList.add('error');
                             // Check if the error span already exists within the parent element
                        if (!cellInput.querySelector('.error-message')) {
                            const errorSpan = document.createElement('span');
                            errorSpan.textContent = '*This field is required.';
                            errorSpan.classList.add('error-message');
                            cellInput.appendChild(errorSpan);
                        }
                        }else{
                            input.classList.remove('error');
                            const errorSpan = input.parentNode.querySelector('.error-message');
                            if (errorSpan) {
                                input.parentNode.removeChild(errorSpan);
                            }
                            formData.append(input.name, input.value);
                        }
                  
                    })
                    if(valid){
                        const csrftoken = Cookies.get('csrftoken');
                        fetch('/books/add_book_entry', {
                            method: 'POST',
                            body: formData,
                            credentials: 'same-origin',
                            headers: { 'X-CSRFToken': csrftoken }

                        }).then(response => { location.reload() })
                    }
                })
            }
            let cancel_btn = input_row.querySelector('.cancel_button')
            cancel_btn.addEventListener('click', function (event) {
                // Remove the table from the div_container
                div_container.removeChild(table);
                // Reset the tableAppended flag to false so the table can be re-added when the user clicks the 'add_first_book' button again
                tableAppended = false;

            })


        }
    })
}
/* // Function to toggle column visibility based on checkbox status
function toggleColumnVisibility(checkboxId, columnIndex) {
    const checkbox = document.getElementById(checkboxId);
    const columnCells = document.querySelectorAll(`td:nth-child(${columnIndex})`);
    const headerCell = document.querySelector(`th:nth-child(${columnIndex})`);
    headerCell.style.display = checkbox.checked ? 'table-cell' : 'none';
    columnCells.forEach(cell => {
        cell.style.display = checkbox.checked ? 'table-cell' : 'none';
    });
    if (checkbox.checked) {
        //console.log(checkboxId + "has been checked")
        localStorage.setItem(checkboxId, 'visible'); // Store the state in localStorage
    } else {
        //console.log(checkboxId + "has not been checked")
        localStorage.setItem(checkboxId, 'hidden'); // Store the state in localStorage

    }
}

// Add event listeners to the checkboxes
document.getElementById('toggleISBN').addEventListener('change', function () {
    toggleColumnVisibility('toggleISBN', 2); // 2 represents the column index (1-based) of ISBN in the table
});

document.getElementById('toggleBookName').addEventListener('change', function () {
    toggleColumnVisibility('toggleBookName', 3); // 2 represents the column index (1-based) of ISBN in the table
});

document.getElementById('toggleQuantityRequested').addEventListener('change', function () {
    toggleColumnVisibility('toggleQuantityRequested', 4); // 4 represents the column index (1-based) of Quantity Requested in the table
});


document.getElementById('toggleQuantityReceived').addEventListener('change', function () {
    toggleColumnVisibility('toggleQuantityReceived', 5); // 4 represents the column index (1-based) of Quantity Requested in the table
});

document.getElementById('toggleYearGroup').addEventListener('change', function () {
    toggleColumnVisibility('toggleYearGroup', 6); // 4 represents the column index (1-based) of Quantity Requested in the table
});

document.getElementById('toggleOrderStatus').addEventListener('change', function () {
    toggleColumnVisibility('toggleOrderStatus', 7); // 4 represents the column index (1-based) of Quantity Requested in the table
});


document.getElementById('toggleOrderStatus').addEventListener('change', function () {
    toggleColumnVisibility('toggleOrderStatus', 7); // 4 represents the column index (1-based) of Quantity Requested in the table
});

document.getElementById('toggleDateAdded').addEventListener('change', function () {
    toggleColumnVisibility('toggleDateAdded', 8); // 4 represents the column index (1-based) of Quantity Requested in the table
});

const checkboxIds = [
    'toggleISBN',
    'toggleBookName',
    'toggleQuantityRequested',
    'toggleQuantityReceived',
    'toggleYearGroup',
    'toggleOrderStatus',
    'toggleDateAdded'
];

function applyStoredColumnSettings() {
    checkboxIds.forEach(checkboxId => {
        const visibility = localStorage.getItem(checkboxId);
        console.log(checkboxId, visibility)
        const columnIndex = parseInt(document.getElementById(checkboxId).getAttribute('data-column-index'));
        if (visibility === 'hidden') {
            toggleColumnVisibility(checkboxId, columnIndex);
            document.getElementById(checkboxId).checked = false;
        } else {
            document.getElementById(checkboxId).checked = true;
        }
    });
}

// Call the function on page load
window.addEventListener('load', applyStoredColumnSettings);

// Add more event listeners for other checkboxes and columns as needed

// Function to toggle all checkboxes in the table
function toggleAllCheckboxes(source) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="books_selection"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
} */


let currentPage = window.location.href
let books_active = document.getElementsByClassName('tabs_links')[0]
let student_active = document.getElementsByClassName('tabs_links')[1]
if (currentPage.includes('books')) {
    books_active.classList.add('active_link')
    student_active.classList.remove('active_link')
    console.log('here')
}


















