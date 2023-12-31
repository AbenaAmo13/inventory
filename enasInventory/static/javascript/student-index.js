/*Edit for the students book*/

let studentEdit = document.querySelectorAll('.student_edit');
const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']

studentEdit.forEach(function (button){
    button.addEventListener('click', function (event){
    event.preventDefault(); // Prevent form submission
    let row = this.parentNode.parentNode;
             // Get the updated values from input fields
    let dataCells = row.querySelectorAll('.editable_data');
    let input1 = document.createElement('input')
    input1.name='student_name'
    input1.type= 'text'
    input1.value = dataCells[0].innerHTML
    input1.required= true
    dataCells[0].innerHTML =''
    dataCells[0].appendChild(input1)
    let year_group_selection = document.createElement('select')
        year_group_selection.name = "year_group"
        year_group_selection.value= dataCells[1].innerHTML
        year_options.forEach((option_name, index)=>{
            option_name = document.createElement('option');
            option_name.value = year_options[index]
            option_name.text = year_options[index]
            year_group_selection.appendChild(option_name)
             // Set the selected attribute if the option value matches the cell content
            if (option_name.value === dataCells[1].innerHTML) {
            option_name.selected = true;
            }
        })

    dataCells[1].innerHTML=''
    dataCells[1].appendChild(year_group_selection)
    this.style.display = 'none';
    row.querySelector('.student_save').style.display = 'inline-block';
    })
})

let saveBtn = document.querySelectorAll('.student_save');
saveBtn.forEach(function (button, index){
    button.addEventListener('click', function (event){
        event.preventDefault(); // Prevent form submission
        let row = this.parentNode.parentNode;
        let dataCells = row.querySelectorAll('.editable_data');
        //console.log(dataCells)
        // Send the data to the endpoint
        let formData = new FormData();
        let student_id = this.getAttribute('data-student-id');
        formData.append('student_id', student_id)
        dataCells.forEach(function(dataCell, index) {
          let input_field = dataCell.querySelector('input, select');
          let updated_value = input_field.value
          let input_name= input_field.name
          console.log(input_name)
          formData.append(input_name, updated_value)
        });
        //To enable csrf token in a javascript post
        const csrftoken = Cookies.get('csrftoken');
        fetch('/students/edit_student_row', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: {'X-CSRFToken': csrftoken}
        }).then(r =>{
            location.reload()
            console.log(r)})
    })
})

let updatePaidStatusBtn = document.querySelectorAll('.update_paid_status')
updatePaidStatusBtn.forEach(function (btn){
    btn.addEventListener('click', function (event){
        event.preventDefault(); // Prevent form submission
        let row = this.parentNode.parentNode
        let studentId = this.getAttribute('data-student-id');
        let formData = new FormData()
        formData.append('student_id', studentId);
          //To enable csrf token in a javascript post
        const csrftoken = Cookies.get('csrftoken');
        fetch('/students/update_paid_status', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: {'X-CSRFToken': csrftoken}
        }).then(r =>{
            location.reload()
            console.log(r)})
    })
})


let deleteBtn = document.querySelectorAll('.student_delete')
deleteBtn.forEach(function (btn){
    btn.addEventListener('click', function (event){
        event.preventDefault(); // Prevent form submission
        let row = this.parentNode.parentNode
        let studentId = this.getAttribute('data-student-id');
        let formData = new FormData()
        formData.append('student_id', studentId);
          //To enable csrf token in a javascript post
        const csrftoken = Cookies.get('csrftoken');
        fetch('/students/delete_student_row', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: {'X-CSRFToken': csrftoken}
        }).then(r =>{
            location.reload()
            console.log(r)})
    })
})



     function toggleAllCheckboxes(source) {
        let checkboxes = document.querySelectorAll('input[type="checkbox"][name="students_check"]');
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = source.checked;
        }
    }

    let updateAllBtn = document.querySelector('#update_all_students')
   if(updateAllBtn){
       let update_ids = []
    updateAllBtn.addEventListener('click', function (event){
        let student_id= document.querySelectorAll('input[type="checkbox"][name="students_check"]')
        student_id.forEach(function (button){
            console.log(button)
            if (button.checked){
                console.log("Checked ids are" + button.value)
                update_ids.push(button.value)
            }
            let data = {
                student_ids : update_ids
            }
             //To enable csrf token in a javascript post
            const csrftoken = Cookies.get('csrftoken');
            fetch('/students/update_all_paid', {
                method: "POST",
                body: JSON.stringify(data),
                credentials: 'same-origin',
                headers: {'X-CSRFToken': csrftoken}

            }).then(r=>{location.reload()})
                .catch(error=>{console.log(error)})
        })
     })
   }



   let add_new_student =  document.querySelector('#add_new_student')
   if (add_new_student){
       add_new_student.addEventListener('click', function (event) {
        //alert('Heyyy aaa')
        let studentTable = document.getElementById("student_table");
        let row_count = studentTable.rows.length
        let new_row = studentTable.insertRow(row_count)
        //Get the last Id:

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        let cell1 = new_row.insertCell(0);
        let cell2 = new_row.insertCell(1);
        let cell3 = new_row.insertCell(2);
        let cell4 = new_row.insertCell(3);
        let cell5 = new_row.insertCell(4);
        let input1 = document.createElement('input');

        input1.type = 'checkbox';
        input1.name = 'students_check';
        cell1.appendChild(input1);

        let input2 = document.createElement('input');
        input2.type = 'text';
        input2.name = 'student_name';
        cell2.appendChild(input2);

        let input3 = document.createElement('input');
        input3.type = 'text';
        input3.name = 'paid_status';
        input3.value = "False"
        input3.readOnly = true
        cell3.appendChild(input3);

        /*let input4 = document.createElement('input');
        input4.type = 'text';
        input4.name = 'year_group';
        cell4.appendChild(input4);*/
        let selectElement = document.createElement('select')
        selectElement.name='year_group'
        year_options.forEach((option_name,index)=>{
            option_name = document.createElement('option');
            option_name.value = year_options[index]
            option_name.text = year_options[index]
            selectElement.appendChild(option_name)
        })
        cell4.appendChild(selectElement)

        let saveBtn = document.createElement('button');
        saveBtn.className = 'add_save';
        saveBtn.name = 'save';
        saveBtn.innerHTML = "Save entry"
        cell5.appendChild(saveBtn);

        let addStudentRow = new_row.querySelector('.add_save')
        addStudentRow.addEventListener('click', function (event) {
            //alert('Saved entry was clicked')
            //alert('Add button saved clicked');
            event.preventDefault(); // Prevent form submission
            // Send the data to the endpoint
            let formData = new FormData();
            let row = this.parentNode.parentNode;
            let inputCells = row.querySelectorAll('input, select')
            inputCells.forEach(function (input, index) {
                console.log("The field names are" + input.name)
                console.log('The field values are: ' + input.value)
                formData.append(input.name, input.value)
                 const csrftoken = Cookies.get('csrftoken');
                // For example, using fetch API
                fetch('/students/add_student_entry', {
                  method: 'POST',
                  body: formData,
                  credentials: 'same-origin',
                  headers:{'X-CSRFToken': csrftoken}
                })
                .then(response => {location.reload()})
            })
        })
    })
   }




let updateReceivedStatus = document.querySelectorAll('.update_received_status')
if(updateReceivedStatus){
    updateReceivedStatus.forEach((btn)=>{
    btn.addEventListener('click', function(event){
        event.preventDefault()
        let bookID = this.getAttribute('data-book-id')
        let studentID = this.getAttribute('data-student-id')
        let formData = new FormData()
        formData.append('book_id', bookID)
        formData.append('student_id', studentID)
         const csrToken = Cookies.get('csrftoken');
        let updateReceivedStatusURL = this.getAttribute('data-url');
        fetch('/students/update_received_status', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
                headers:{'X-CSRFToken': csrToken}
        })
        .then(response => response.json())
        console.log(bookID, studentID)
    })
})
}


const add_student_entry = document.getElementById('add_student_entry');
let studentTableAppended = false; // Flag variable to keep track of whether the table has been appended
if(add_student_entry){
    add_student_entry.addEventListener('click', function (event){
        console.log('I am here')
        event.preventDefault()
        if(!studentTableAppended){
            console.log('I am not appended ')
            let div_container = document.getElementsByClassName('student_table_container')[0]
            //console.log(div_container[0])
            let table = document.createElement('table');
            let table_row = table.insertRow()
            let headers = ['Student name', 'Paid Status', 'Year Group', 'Actions']
            headers.forEach(function (tableHeadersName){
                  let header_title = document.createElement('th')
                header_title.textContent = tableHeadersName
                table_row.appendChild(header_title)
            })

            //Input
            let inputRows = table.insertRow()
            let studentNameInputCell = inputRows.insertCell()
            let studentNameInput = document.createElement('input')
            studentNameInput.type= 'text'
            studentNameInput.name= 'student_name'
            studentNameInputCell.appendChild(studentNameInput)

            let paidStatusInputCell = inputRows.insertCell()
            let paidStatusOptions = ['True', 'False']
            let paidStatusSelect = document.createElement('select')
            paidStatusSelect.name= 'paid_status'
            paidStatusOptions.forEach((option, index)=>{
                let optionElement = document.createElement('option')
                optionElement.value = paidStatusOptions[index]
                optionElement.text= paidStatusOptions[index]
                paidStatusSelect.appendChild(optionElement)
            })
            paidStatusInputCell.appendChild(paidStatusSelect)

            let studentYearGroupCell = inputRows.insertCell()
            const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'IGCSE', 'Year 12', 'Year 13', 'A-level']
            let student_year_group = document.createElement('select')
            student_year_group.name='year_group'
            year_options.forEach((option_name,index)=>{
                option_name = document.createElement('option');
                option_name.value = year_options[index]
                option_name.text = year_options[index]
                student_year_group.appendChild(option_name)
            })
            studentYearGroupCell.appendChild(student_year_group)

            let ActionInputCell = inputRows.insertCell()
            let button_save = document.createElement('button')
            button_save.className= 'save_button'
            button_save.textContent = 'Save'
            let button_cancel = document.createElement('button')
            button_cancel.className= 'cancel_button'
            button_cancel.textContent = 'Cancel'
            ActionInputCell.appendChild(button_save)
            ActionInputCell.appendChild(button_cancel)
            ActionInputCell.className = 'added_table'
            div_container.appendChild(table)
            studentTableAppended = true;

            let formData = new FormData()
            let save_add = inputRows.querySelector('.save_button')
             if(save_add){
                 save_add.addEventListener('click', function (event){
                     let inputCells = inputRows.querySelectorAll('input, select')
                        inputCells.forEach(function (input, index) {
                            console.log('The input is' + input)
                            formData.append(input.name, input.value)
                            const csrftoken = Cookies.get('csrftoken');
                            fetch('/students/add_first_entry', {
                                 method: 'POST',
                                 body: formData,
                                 credentials: 'same-origin',
                                 headers:{'X-CSRFToken': csrftoken}
                             }).then(response => {location.reload()})

                        })
                 })
             }
        }else{

        }

    })
}

let currentPage = window.location.href
if (currentPage.includes('students')) {
    let books_active = document.getElementsByClassName('tabs_links')[0]
    books_active.classList.remove('active_link')
    let student_active = document.getElementsByClassName('tabs_links')[1]
    student_active.classList.add('active_link')
}









