/*Edit for the students book*/

let studentEdit = document.querySelectorAll('.student_edit');
let studentInputConfig={
    0: "student_name",
    1: "year_group"
}
studentEdit.forEach(function (button){
    button.addEventListener('click', function (event){
    event.preventDefault(); // Prevent form submission
    let row = this.parentNode.parentNode;
             // Get the updated values from input fields
      let dataCells = row.querySelectorAll('.editable_data');
      dataCells.forEach(function (cell, index){
          console.log(cell)
          let input_name = studentInputConfig[index]
          console.log(input_name)
          let content = cell.innerHTML;
          cell.innerHTML= '<input type="text" value="'+content+'"  name="' + input_name + '" required  />';
          console.log(content)
      })

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
        let bookId = this.getAttribute('data-book-id');
        formData.append('book_id', bookId)
        dataCells.forEach(function(dataCell, index) {
          let input_field = dataCell.querySelector('input');
          let updated_value = input_field.value
          let input_name= input_field.name
          console.log(input_name)
          formData.append(input_name, updated_value)
        });
        //To enable csrf token in a javascript post
        const csrftoken = Cookies.get('csrftoken');
        fetch('/edit_student_row', {
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
        let bookId = this.getAttribute('data-book-id');
        let formData = new FormData()
        formData.append('book_id', bookId);
          //To enable csrf token in a javascript post
        const csrftoken = Cookies.get('csrftoken');
        fetch('/update_paid_status', {
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
        let bookId = this.getAttribute('data-book-id');
        let formData = new FormData()
        formData.append('book_id', bookId);
          //To enable csrf token in a javascript post
        const csrftoken = Cookies.get('csrftoken');
        fetch('/delete_student_row', {
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
            fetch('/update_all_paid', {
                method: "POST",
                body: JSON.stringify(data),
                credentials: 'same-origin',
                headers: {'X-CSRFToken': csrftoken}

            }).then(r=>{location.reload()})
        })
     })




    const year_options = ['Reception', 'Nursery 1', 'Nursery 2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']
    document.querySelector('#add_new_student').addEventListener('click', function (event) {
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
            alert('Saved entry was clicked')
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
                //formData.append(,input.value)
                //console.log(input.value)
            })
        })
    })







