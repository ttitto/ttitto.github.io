$(function () {
    var headers = {
            'X-Parse-Application-Id': 'uPaYGHeiAXZEhQCet3lJoWt0mvWuClKDXmOY4TGV',
            'X-Parse-REST-API-Key': 'NzZlkbo49SUb8m3RkJ4bVyOXXRVnkFYoRQ0j74Nc'
        },
        countries = [],
        towns = [],
        errorMessage = function (err, message) {
            var errorsDiv = $('<div />');
            errorsDiv.addClass('errors-container').html(message + ': ' + err).appendTo(document.body).fadeOut(4000);
            setTimeout(function () {
                errorsDiv.remove();
            }, 6000);
        },

        successMessage = function (message) {
            var successDiv = $('<div />');
            successDiv.addClass('success-message-container').html(message).appendTo(document.body).fadeOut(4000);
            setTimeout(function () {
                successDiv.remove();
            }, 6000);
        },

        loadCountries = function () {
            $.ajax({
                url: 'https://api.parse.com/1/classes/Country',
                type: 'GET',
                headers: headers,
                success: function (data) {
                    var countriesList = $('#countries-list');
                    countries = data.results;
                    countriesList.html('');

                    $.each(countries, function (index, country) {
                        $('<option />').addClass('country-item').html(country.name).appendTo(countriesList);
                    })

                    loadTowns(getSelectedCountry()[0].objectId);
                },
                error: function (err) {
                    errorMessage(err.responseText, "Error occurred when loading countries");
                }
            });
        },

        loadTowns = function (countryId) {
            $.ajax({
                url: 'https://api.parse.com/1/classes/Town',
                type: 'GET',
                headers: headers,
                success: function (data) {
                    towns = data.results;
                    var selectedTowns = towns.filter(function (country) {
                            return country['country'].objectId == countryId;
                        }),
                        townsList = $('#towns-list');

                    townsList.html('');
                    $.each(selectedTowns, function (index, town) {
                        $('<option />').addClass('town-item').html(town.name).appendTo(townsList);
                    });
                },
                error: function (err) {
                    errorMessage(err, 'Error occured when loading towns');
                }
            });
        },

        getSelectedCountry = function () {
            var countryName = $('#countries-list').children(':selected').val();
            return countries.filter(function (country) {
                return countryName == country.name;
            });
        },

        getSelectedTowns = function () {
            var townsOptions = $('#towns-list').children(':selected'),
                selectedTowns = [];

            $(towns).each(function (index, town) {
                $.each(townsOptions, function (index, townOption) {
                    if (town.name == townOption.value) {
                        selectedTowns.push(town);
                    }
                });
            });
            return selectedTowns;
        };

    $('#countries-list').change(function () {
        loadTowns(getSelectedCountry()[0].objectId);
    });

    $('#country-add-btn').click(function () {
        var input = $('.country-input')[0];
        if (input) {
            if (input.value.length < 3) {
                return false;
            }

            $.ajax({
                url: 'https://api.parse.com/1/classes/Country',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({"name": encodeURI(input.value)}),
                headers: headers,
                success: function () {
                    successMessage("New country successfully added");
                },
                error: function (err) {
                    errorMessage(err.responseText, 'Error occurred while adding new country');
                }
            });
            input.remove();
            loadCountries();
        } else {
            $('<input type="text" />').addClass('country-input').prependTo($(this).parent());
        }
    });

    $('#town-add-btn').click(function () {
        var input = $('.town-input')[0],
            selectedCountryId = '';
        if (input) {
            if (input.value.length < 3) {
                return false;
            }

            selectedCountryId = getSelectedCountry()[0].objectId;
            $.ajax({
                url: 'https://api.parse.com/1/classes/Town',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    'name': encodeURI(input.value),
                    'country': {
                        "__type": "Pointer",
                        "className": "Country",
                        "objectId": selectedCountryId
                    }
                }),
                headers: headers,
                success: function () {
                    successMessage("New town successfully added");
                },
                error: function (err) {
                    errorMessage(err.responseText, 'Error occurred while adding new town');
                }
            });
            input.remove();
            loadTowns(selectedCountryId);
        } else {
            $('<input type="text" />').addClass('town-input').prependTo($(this).parent());
        }
    });

    $('#country-del-btn').click(function () {
        var countryId = getSelectedCountry()[0].objectId;
        $.ajax({
            url: 'https://api.parse.com/1/classes/Country/' + countryId,
            type: 'DELETE',
            headers: headers,
            success: function () {
                successMessage("Country successfully deleted!");
                loadCountries();
            },
            error: function (err) {
                errorMessage(err, "Error occurred while trying to delete country!");
            }
        });
    });

    $('#town-del-btn').click(function () {
        var selectedTowns = getSelectedTowns();
        if (selectedTowns.length > 0) {
            $(selectedTowns).each(function (index, town) {
                $.ajax({
                    url: 'https://api.parse.com/1/classes/Town/' + town.objectId,
                    headers: headers,
                    type: 'DELETE',
                    success: function () {
                        successMessage('Selected towns successfully deleted');
                        loadTowns(getSelectedCountry()[0].objectId);
                    },
                    error: function (err) {
                        errorMessage(err, 'Error occurred while trying to delete selected towns');
                    }
                });
            });

        }
    });

    $('#country-edit-btn').click(function () {
        var selectedCountry = getSelectedCountry(),
            input = $('.country-edit-input')[0];

        if (input) {
            if (input.value.length < 3) {
                return false;
            }

            $.ajax({
                url: 'https://api.parse.com/1/classes/Country/' + selectedCountry[0].objectId,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    'name': encodeURI(input.value)
                }),
                headers: headers,
                success: function () {
                    successMessage('Country edited successfuly');
                    loadCountries();
                },
                error: function (err) {
                    errorMessage(err.responseText, 'Error occured while editing country');
                }
            });

            input.remove();
        } else {
            $('<input type="text" />').addClass('country-edit-input').val(selectedCountry[0].name).appendTo($(this).parent());
        }
    });

    $('#town-edit-btn').click(function () {
        var selectedTowns = getSelectedTowns(),
            input = $('.town-edit-input')[0],
            selectedCountryId = '';

        if (selectedTowns.length !== 1) {
            errorMessage('', 'Please select just one town to edit!');
            return false;
        }

        if (input) {
            if (input.value.length < 3) {
                return false;
            }

            selectedCountryId = getSelectedCountry()[0].objectId;
            $.ajax({
                url: 'https://api.parse.com/1/classes/Town/' + selectedTowns[0].objectId,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    'name': encodeURI(input.value)
                }),
                headers: headers,
                success: function () {
                    successMessage("Town successfully edited");
                    loadTowns(selectedCountryId);
                },
                error: function (err) {
                    errorMessage(err.responseText, 'Error occurred while editing new town');
                }
            });

            input.remove();
        } else {
            $('<input type="text" />').addClass('town-edit-input').val(selectedTowns[0].name).appendTo($(this).parent());
        }
    });

    loadCountries();
})
;