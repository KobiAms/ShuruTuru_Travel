let paths_counter

// this function loads the main objects in page
$("document").ready(() => load_page());
load_page = () => {
    // set the path counter to sero 
    paths_counter = 0
    // sets the buttons click events
    $("#add_path").click(() => add_path_entery())
    $("#add_tour_btn").click(() => add_new_tour())
    $("#back_list_btn").click(() => window.location = "/list")
}

// this function call by clicking the "Add Tour" button. this function gets the values from the inputs fields
// and validates that they are not empty and send Post request to the server to adding new tour to DB
add_new_tour = () => {
    // first gets the path objects from path field. we count every "Path +" click to put it into the tour object
    let path = []
    // the copy is required for the validation stage
    let path_cpy_vld = []
    // for every site in the path box, adding it into the path array as an correct object
    for (let index = 0; index < paths_counter; index++) {
        path.push({ name: $("#path_" + index + "_name").val().replace(/ /g, "_"), country: $("#path_" + index + "_country").val() })
        path_cpy_vld.push({ name: $("#path_" + index + "_name").val(), country: $("#path_" + index + "_country").val(), idx: index })
    }
    // gets the tour id value form his field
    let name = $("#tourID").val()
    // gets the values from yhe inputs fields into new_tour object
    let new_tour = {
        name: name,
        start_date: new Date($("#start_date").val()),
        duration: parseFloat($("#duration").val()),
        price: parseFloat($("#price").val()),
        guide: $("#guide_id").val(),
        path: path
    }
    // if the validation stage pass, use ajax to set the data into the server
    // if (!validate_tour_fields(tourID, new_tour) && !validate_path_fields(path_cpy_vld)) {
    $.ajax({
        url: '/tours',
        type: 'POST',
        data: new_tour,
        success: () => {
            // in case of success, show alert to user
            alert("new Tour added succefuly!")
        },
        error: (err) => {
            alert("Oops..! Some error just happend: \n\"" + err.responseText + "\"")
        }
    })
    // }
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

// this function validates the path sites input values
// if there are 2 site with the same name or if one of the input is empty
validate_path_fields = (path) => {
    // for checkig if 2 input are with the same name we first sort the data by the name 
    // in this way the 2 equals name must be next to each other 
    path.sort((a, b) => a.name.localeCompare(b.name));
    // set flag to false
    let dup = false
    // for every path
    for (let index = 0; index < path.length; index++) {
        // check if name is empty
        if (path[index].name.length == 0) {
            set_input_error_style("path_" + path[index].idx + "_name")
            dup = true;
        }
        // check if country is empty
        if (path[index].country.length == 0) {
            set_input_error_style("path_" + path[index].idx + "_country")
            dup = true;
        }
        // check if this site has the same name as the next site
        if (index < path.length - 1) {
            if (path[index].name == path[index + 1].name) {
                set_input_error_style("path_" + path[index].idx + "_name")
                set_input_error_style("path_" + path[index + 1].idx + "_name")
                dup = true;
            }
        }
    }
    return dup
}

// validate tour main fields property that are not empty
validate_tour_fields = (tourID, new_tour) => {
    // set the flag
    let missing = false;
    if (tourID.length == 0) {
        set_input_error_style("tourID")
        missing = true;
    }
    if (new_tour.start_date.length == 0) {
        set_input_error_style("start_date")
        missing = true;
    }
    if (!new_tour.duration || new_tour.duration <= 0) {
        set_input_error_style("duration")
        missing = true;
    }
    if (!new_tour.price || new_tour.price < 0) {
        set_input_error_style("price")
        missing = true;
    }
    if (new_tour.guide.name.length == 0) {
        set_input_error_style("guide_name")
        missing = true;
    }
    if (!validateEmail(new_tour.guide.email)) {
        set_input_error_style("guide_email")
        missing = true;
    }
    if (new_tour.guide.cellular.length == 0) {
        set_input_error_style("guide_cellular")
        missing = true;
    }
    return missing
}

// this function check if the email input are in the correct tamplate "xx@xx.xx"
validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// this function add one more site entery at the path box
add_path_entery = () => {
    // can't use global variable, so copy the global into tmp
    let tmp = paths_counter
    // inflate new entery with inputs for name, country, and close entery button
    $("#path_container").append("<div id=\"path_" + paths_counter + "\"class=\"form_field_container\">" +
        "<div class=\"form_field_guide\"><h3>name</h3><input id=\"path_" + paths_counter + "_name\" " +
        "type=\"text\"/></div>" + "<div class=\"form_field_guide\"><h3>countrey</h3><input " +
        "id=\"path_" + paths_counter + "_country\" type=\"text\" /></div><button id=\"path_" + paths_counter +
        "_btn\"class=\"path_btns\"><h4>X</h4></button></div>")
    $("#path_" + paths_counter + "_btn").click(() => {
        $("#path_" + tmp).remove()
        paths_counter--;
    })
    // update counter
    paths_counter++;
}