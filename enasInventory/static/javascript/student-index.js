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







