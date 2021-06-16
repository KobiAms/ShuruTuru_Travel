
// this function loads the main objects in page
$("document").ready(() => load_page());
load_page = () => {
    // set the path counter to sero 
    paths_counter = 0
    // sets the buttons click events
    $("#add_guide_btn").click(() => add_new_guide())
    $("#back_list_btn").click(() => window.location = "/list")
}

// this function call by clicking the "Add Tour" button. this function gets the values from the inputs fields
// and validates that they are not empty and send Post request to the server to adding new tour to DB
add_new_guide = () => {
    // gets the values from yhe inputs fields into new_tour object
    let new_guide = {
        name: $("#name").val(),
        email: $("#email").val(),
        cellular: $("#cellular").val(),
    }
    // if the validation stage pass, use ajax to set the data into the server
    if (!validate_guide_fields(new_guide)) {
        $.ajax({
            url: '/guides',
            type: 'POST',
            data: new_guide,
            success: () => {
                // in case of success, show alert to user
                alert("new Guide added succefuly!")
            },
            error: (err) => {
                alert("Oops..! Some error just happend: \n\"" + err.responseText + "\"")
            }
        })
    }
}

// this function set the input style to error and back to normal if the user focus on the input
set_input_error_style = (id) => {
    $("#" + id).css('border-color', 'red')
    $("#" + id).css('background-color', '#e67f7f')
    $("#" + id).focus(() => {
        $("#" + id).css('border-color', '#a4a3a3')
        $("#" + id).css('background-color', '#ffffff')
        $("#" + id).off('focus')
    })
}


// validate guide fields property that are not empty
validate_guide_fields = (new_guide) => {
    // set the flag
    let missing = false;
    if (new_guide.name.length == 0) {
        set_input_error_style("name")
        missing = true;
    }
    if (!validateEmail(new_guide.email)) {
        set_input_error_style("email")
        missing = true;
    }
    if (new_guide.cellular.length == 0) {
        set_input_error_style("cellular")
        missing = true;
    }
    return missing
}

// this function check if the email input are in the correct tamplate "xx@xx.xx"
validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}