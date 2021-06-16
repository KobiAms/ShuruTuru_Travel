let tours, key_path_showen, sorted_key;
$("document").ready(() => load_page());


dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

// this function loads the main objects in page
load_page = () => {
    // getting the list of all tours by ajax call from server
    show_add_buttons()
    $.ajax({
        url: '/tours',
        success: (data) => {
            tours = data;
            sorted_key = "tourID"
            create_tours_table();
        },
        error: (err) => console.log("error at loading tours" + err)
    })
    // set close prompt button click 
    $(".close_prompt").click(() => {
        $(".shuru_prompt").hide()
    })
    // set sort_by buttons in the table and send the function the key required to sort by
    $("#tourid").click(() => sortby("tourID"))
    $("#start_date").click(() => sortby("start_date"))
    $("#duration").click(() => sortby("duration"))
    $("#price").click(() => sortby("price"))
}

// set ADD_TOUR buttons click
show_add_buttons = () => {
    $(".add_tour").click(() => {
        window.location = "/add_tour"
    })
    $(".add_guide").click(() => {
        window.location = "/add_guide"
    })
}

// this function push the data (tours) into the table
create_tours_table = () => {
    // clear the table before Appending any data (this funtcion calls not only from load_page)
    $("#tours_table tr:gt(0)").remove()
    // for each tour in our tours data we want to inflate the details as raw in the table
    Object.keys(tours).forEach(key => {
        // append new tr (line) to the table
        $("#tours_table").append("<tr class=\"tt\" id=\"tt_" + key + "\"></tr>");
        // add the edit tour buttons and set it properly and click Setting 
        $("#tt_" + key).append("<td><button class=\"th_edit\" id=\"edit_" + key + "\"><h4>Edit</h4></button></td>");
        $("#edit_" + key).click(() => edit_tour(key))
        // add the details of the tour to the table 
        $("#tt_" + key).append("<td>" + tours[key].name + "</td><td>" + dateToReadbleFormat(new Date(tours[key].start_date)) + "</td>");
        $("#tt_" + key).append("<td>" + tours[key].duration + "</td><td>" + tours[key].price + " $" + "</td>");
        $("#tt_" + key).append("<td>" + tours[key].guide.name + "</td><td>" + tours[key].guide.email + "</td>");
        $("#tt_" + key).append("<td>" + tours[key].guide.cellular + "</td>");
        // add the path box and the "Show Path" button and the set click Setting 
        $("#tt_" + key).append("<td id=\"path_td_" + key + "\"></td>");
        if (tours[key].path.length > 0) {
            $("#path_td_" + key).append("<button class=\"buttons\" id=\"path_" + key + "\"><h4>Show Path</h4></button>");
            $("#path_" + key).click(() => show_path(key));
        } else {
            $("#path_td_" + key).append("<button class=\"site_btn_add\" id=\"path_" + key + "\"><h4>Add Path</h4></button>");
            $("#path_" + key).click(() => add_site(key));
        }
        // add the "Delete Tour" box and button to the table 
        $("#tt_" + key).append("<td><button id=\"delete_" + key + "\"class=\"site_btn_delete\"><h4>Delete</h4></button></td>");
        $("#delete_" + key).click(() => delete_tour(key));
    });
}

// this function open the sub table in the path box for showing and Modifying the path (add/delete)
show_path = (key) => {
    // if some path table Already open (in other tour) close it and return the "Show Path" button
    if (key_path_showen) {
        // using tmp cause we must using local variable
        let tmp = key_path_showen;
        // clear the old path
        $("#path_td_" + tmp).empty()
        // show the button again
        $("#path_td_" + tmp).append("<button class=\"buttons\" id=\"path_" + tmp + "\"><h4>Show Path</h4></button>");
        // set button click setting
        $("#path_" + tmp).click(() => show_path(tmp));
    }
    // save the new open path box
    key_path_showen = key;
    // clear the box from the button
    $("#path_td_" + key).empty()
    // create the path table
    $("#path_td_" + key).append("<table id=\"path_details\"></table>");
    // append the titles
    $("#path_details").append("<tr><th class=\"th_path\">Site Name</th><th class=\"th_path\">Country</th><th><button id=\"add_path\" class=\"site_btn_add\"><h4>Add Site</h4></button></th></tr>")
    // add the "Add Site" button setting click
    $("#add_path").click(() => add_site(key))
    // for each site in tour path add line to table includes name, country, and delete site button
    tours[key].path.forEach((site, idx) => {
        $("#path_details").append("<tr id=\"site_" + idx + "\"></tr>");
        $("#site_" + idx).append("<td>" + site.name.replace(/_/g, " ") + "</td><td>" + site.country + "</td>")
        $("#site_" + idx).append("<td><button id=\"delete_site_" + site.name + "\" class=\"site_btn_delete\"><h4>Delete</h4></button></td>")
        $("#delete_site_" + site.name).click(() => delete_site(key, site))
    })
    $("#path_td_" + key).append("<button id=\"delete_path" + key + "\" class=\"site_btn_delete\"><h4>Delete Path</h4></button>");
    $("#delete_path" + key).click(() => delete_path(key))
}

// edit tour propeties by opening a floating form on the screen and put the current values for easy Modify
edit_tour = (key) => {
    set_input_ok_style("edit_tour_name")
    set_input_ok_style("edit_tour_start_date")
    set_input_ok_style("edit_tour_duration")
    set_input_ok_style("edit_tour_price")
    // insert the current data into the input fields
    $("#edit_tour_name").val(tours[key].name);
    let date_parse = new Date(tours[key].start_date)
    $("#edit_tour_start_date").val(date_parse.getFullYear() + '-0' + (date_parse.getMonth() + 1) + '-' + ("0" + (date_parse.getDate())).slice(-2));
    $("#edit_tour_duration").val(tours[key].duration)
    $("#edit_tour_price").val(tours[key].price)
    $("#edit_prompt_btn").off("click");
    // set the click of the prompt to send the new data to server
    $("#edit_prompt_btn").click(() => {
        // put the data in js object with the right keys
        let edit_tour = {
            name: $("#edit_tour_name").val(),
            start_date: new Date($("#edit_tour_start_date").val()),
            duration: parseFloat($("#edit_tour_duration").val()),
            price: parseFloat($("#edit_tour_price").val()),
        }
        // validate that all the inputs have Correct data
        if (!validate_edit_tour(edit_tour)) {
            // call ajax to update the data
            $.ajax({
                url: '/tours/' + key,
                type: 'PUT',
                data: edit_tour,
                success: () => {
                    // in success we want to render the table with the currect data from sever
                    $.ajax({
                        url: 'http://localhost:3001/tours',
                        success: (data) => {
                            tours = data;
                            // close the prompt
                            $("#edit_tour_prompt").hide()
                            create_tours_table();
                        },
                        error: (err) => console.log(err.responseText)
                    })
                },
                error: (err) => {
                    alert("Oops..! Some error just happend: \n\"" + err.responseText + "\"")
                }
            })
        }
    })
    $("#edit_tour_prompt").show()
}

// add new site into some tour by opening a floating form on the screen
add_site = (key) => {
    // clear from old val if there is and clear old click event
    $("#add_site_name").val("")
    $("#add_site_country").val("")
    set_input_ok_style("add_site_name")
    set_input_ok_style("add_site_country")
    $("#add_site_btn").off("click");
    // set the click event 
    $("#add_site_btn").click(() => {
        // create the new site as an object
        let new_site = { name: $("#add_site_name").val().replace(/ /g, "_"), country: $("#add_site_country").val() }
        // validate the site fields are full
        if (!validate_site(new_site)) {
            // by ajax send the server the new site to add into the tour
            $.ajax({
                url: 'http://localhost:3001/tours/' + key + '/site',
                type: 'PUT',
                data: new_site,
                success: () => {
                    // gets the new data table from the server and render it 
                    $.ajax({
                        url: 'http://localhost:3001/tours',
                        success: (data) => {
                            tours = data;
                            create_tours_table();
                            show_path(key)
                            $("#add_site_prompt").hide()
                        },
                        error: (err) => console.log(err.responseText)
                    })
                },
                error: (err) => alert("Error with adding new site\n" + err.responseText)
            })
        }
    })
    $("#add_site_prompt").show()
}
// validate site field are not empty 
validate_site = (site) => {
    // set the flag to false 
    let missing = false;
    // for every field if the field are empty set the style to red for indicating that it is error input
    if (site.name.length == 0) {
        set_input_error_style("add_site_name")
        missing = true;
    }
    if (site.country.length == 0) {
        set_input_error_style("add_site_country")
        missing = true;
    }
    return missing
}

// validate site field are not empty 
validate_edit_tour = (new_tour) => {
    let missing = false;
    // for every field if the field are empty set the style to red for indicating that it is error input
    if (new_tour.start_date.length == 0) {
        set_input_error_style("edit_tour_start_date")
        missing = true;
    }
    if (new_tour.name.length == 0) {
        set_input_error_style("edit_tour_name")
        missing = true;
    }
    if (!new_tour.duration) {
        set_input_error_style("edit_tour_duration")
        missing = true;
    }
    if (!new_tour.price) {
        set_input_error_style("edit_tour_price")
        missing = true;
    }
    return missing
}

// set the input back to Regular style
set_input_ok_style = (id) => {
    $("#" + id).css('border-color', '#a4a3a3')
    $("#" + id).css('background-color', '#ffffff')
    $("#" + id).off('focus')
}
// set the input back to Error style
set_input_error_style = (id) => {
    $("#" + id).css('border-color', '#a20000')
    $("#" + id).css('background-color', '#ffaeae')
    $("#" + id).focus(() => set_input_ok_style(id))
}

// validate email tamplate (xxx@xxx.xxx)
validate_email = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// this function gets a key of some tour and send the server DELETE request to delete it from the DB
delete_tour = (key) => {
    // ask user to be sure for skipping mistakes
    if (confirm('Are you sure you want to delete this tour from the server?')) {
        // ajax call to delete tour
        $.ajax({
            url: 'http://localhost:3001/tours/' + key,
            type: 'DELETE',
            success: () => {
                // after Confirm Deleted render the table again with new data
                $.ajax({
                    url: 'http://localhost:3001/tours',
                    success: (data) => {
                        tours = data;
                        create_tours_table();
                    },
                    error: (err) => console.log("error at loading tours" + err)
                })
            },
            error: (err) => console.log("error at delete site" + err)
        })
    }
}

// this function gets a key and delete the tour path using DELETE request from the server
delete_path = (key) => {
    // ask user to be sure for skipping mistakes
    if (confirm('Are you sure you want to delete this whole path from the server?')) {
        // ajax call to delete path
        $.ajax({
            url: 'http://localhost:3001/tours/' + key + '/site/delete_all',
            type: 'DELETE',
            success: () => {
                $.ajax({
                    url: 'http://localhost:3001/tours',
                    success: (data) => {
                        tours = data;
                        create_tours_table();
                    },
                    error: (err) => console.log("error at loading tours" + err)
                })
            },
            error: (err) => console.log("error at delete site" + err)
        })
    }
}

// this funtion is to delete some specific site from some tour by key tour and site name
delete_site = (key, site) => {
    $.ajax({
        url: 'http://localhost:3001/tours/' + key + '/site/' + site.name,
        type: 'DELETE',
        success: () => {
            $.ajax({
                url: 'http://localhost:3001/tours',
                success: (data) => {
                    tours = data;
                    create_tours_table();
                    if (tours[key].path.length > 0) {
                        show_path(key)
                    }
                },
                error: (err) => console.log("error at loading tours" + err.responseText)
            })
        },
        error: (err) => console.log("error at delete site" + err.responseText)
    })
}

// this function ssort the data by the Received key
sortby = (key) => {
    tours_arr = Object.entries(tours);
    if (key == sorted_key) {
        tours_arr = tours_arr.reverse();
    } else if (key == "start_date") {
        tours_arr.sort((a, b) => new Date(a[1][key]) - new Date(b[1][key]));
    } else if (key == "tourID") {
        tours_arr.sort((a, b) => a[0].localeCompare(b[0]));
    } else {
        tours_arr.sort((a, b) => a[1][key] - b[1][key]);
    }
    sorted_key = key;
    tours = Object.fromEntries(tours_arr)
    create_tours_table()
}