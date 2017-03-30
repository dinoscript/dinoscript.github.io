$(document).ready(function () {
    var dataJSON = [];// array with JSON-files urls
    var map;// google-map
    var marker;// google-map marker
    var infowindow;// google-map infowindow

    // Get a list of JSON-files
    $.ajax({
        url: 'products_data/data_json/data_list.json',
        dataType: 'json',
        success: function (urlList) {
            //$.each(urlList, function (index, data) {
            //    dataJSON.push({'url': data});
            //});
            var counter = 0; // counter of requests

            //Load data from JSON files
            function recFunction() {
                $.ajax({
                    url: dataJSON[counter].url,
                    dataType: 'json',
                    success: function (productData) {
                        // Create a map if it does not exist
                        if (!map) {
                            createMap(productData);
                            infowindow = new google.maps.InfoWindow({
                                pixelOffset: new google.maps.Size(0, 20),
                                maxWidth: 250
                            });
                        }
                        // Create a marker for the product
                        marker = createMarker(productData);

                        // Insert content, specified by the product information
                        $('.hotDeals').append(
                            '<div class="col-md-4 col-sm-6 hotDeals-item">' +
                            '<a href="#hotDealsModal" class="hotDeals-link" data-toggle="modal" data-index="' + counter + '">' +
                            '<div class="hotDeals-hover">' +
                            '<div class="hotDeals-hover-content">' +
                            '<span class="fa fa-search fa-5x" aria-hidden="true"></span>' +
                            '</div>' +
                            '</div>' +
                            '<img src="' + productData.imgUrl + '" class="img-responsive" alt="">' +
                            '</a>' +
                            '<div class="hotDeals-caption">' +
                            '<h4>' + productData.buildingType + '</h4>' +
                            '<p class="text-muted">' + productData.shortPlaceName + '</p>' +
                            '</div>' +
                            '</div>');

                        // Bind an event handler
                        (function (counter, marker) {
                            $('.hotDeals-link[data-index="' + (counter) + '"]').click(function () {
                                $('.hotDeals-link').removeClass('selected');
                                $(this).addClass('selected');
                                //Change the table of product data
                                $('#info-table').html(
                                    '<table class="table" table-collapse="collapse"><tbody><tr><td class="cell-left">Building Type</td><td>' + productData.buildingType + '</td></tr><tr><td>Full Place Address</td><td>' + productData.fullPlaceAddress + '</td></tr><tr><td>Location Lat</td><td class="cell-right">' + productData.locationLat + '</td></tr><tr><td>Location Lng</td><td>' + productData.locationLng + '</td></tr><tr><td>Description</td><td>' + productData.description + '</td></tr></tbody></table>'
                                );
                                //Change the center of the map to the marker position
                                map.panTo(marker.getPosition());
                            });
                        })(counter, marker);

                        counter++;
                        if (counter < urlList.length) {
                            recFunction();// Run recursive function
                        }
                        else {
                            $('.hotDeals-link[data-index=0]').click();
                        }
                    }
                })
            }

            recFunction();// Run recursive function
        }
    });

    // Create google map
    function createMap(product) {
        var productPosition = {lat: product.locationLat, lng: product.locationLng};
        map = new google.maps.Map(document.getElementById('google-map'), {
            zoom: 15,
            center: productPosition
        });
        return map;
    }

    // Create a marker for google map
    function createMarker(product) {
        var productPosition = {lat: product.locationLat, lng: product.locationLng};
        marker = new google.maps.Marker({
            position: productPosition,
            map: map,
            title: product.fullPlaceAddress
        });

        // Bind an event handler
        google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                infowindow.close();
                infowindow.setContent(product.buildingType+': '+product.fullPlaceAddress);
                infowindow.open(map, marker);
                console.log(marker);
            }
        })(marker));
        return marker;
    }
});