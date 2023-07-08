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














