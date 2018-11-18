var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.post('/users/auth/', function (req, res) {
    res.send({token: 'testToken'});
});

app.get('/users/bootstrap/', function (req, res) {
    res.send({
        user: {
            id: '8d84a449-e560-41a4-96cf-b799e59e1470',
            type: 'customer',
            phone_number: '+37125600001',
            first_name: 'Me',
            last_name: 'Meow',
            username: 'ride'
        },
        permissions: []
    });
});

app.get('/customers/orders/', function (req, res) {
    res.send([
        {
            id: 'da3a4db7-de5a-4d4d-89b6-88917183e6c4',
            type: 'importation',
            loading: 'directloading',
            customer: {
                id: '33cc5b44-3b63-4e19-8917-403ff21efc1d',
                name: 'GOL Truck'
            },
            locations: [
                {
                    id: 1,
                    type: 'customs',
                    date: '2018-07-24T20:00:00Z',
                    address: 'City, Street 1',
                    description: 'description1',
                    point: {
                        type: 'Point',
                        coordinates: [-123.0208, 44.0464]
                    }
                },
                {
                    id: 2,
                    type: 'customs',
                    date: '2018-07-24T20:00:00Z',
                    address: '',
                    description: 'description2',
                    point: {
                        type: 'Point',
                        coordinates: [-123.0208, 44.0464]
                    }
                }
            ],
            containers: [
                {
                    id: 3,
                    line: 1,
                    type: 1,
                    is_genset: null,
                    cargo_description: 'danger cargo',
                    cargo_weight: 20,
                    cargo_package: 'some package',
                    is_adr: false,
                    un_number: null,
                    trailer_type: 'long',
                    is_trailer_protected: false,
                    is_trailer_telescopic: false,
                    truck_axles: 2,
                    trailer_axles: 4
                }
            ]
        }
    ]);
});

app.get('/common/container/lines/', function (req, res) {
    res.send(
        [
            {
                "id": 1,
                "name": "ADMIRAL",
                "description": ""
            },
            {
                "id": 2,
                "name": "COSCO",
                "description": ""
            }
        ]
    );
});

app.get('/common/container/types/', function (req, res) {
    res.send(
        [
            {
                "id": 1,
                "name": "20’DV",
                "description": ""
            },
            {
                "id": 2,
                "name": "20’OT",
                "description": ""
            }
        ]
    );
});



app.get('/customers/orders/:id', function (req, res) {
    res.send(
        {
            "id": "da3a4db7-de5a-4d4d-89b6-88917183e6c4",
            "type": "importation",
            "loading": "directloading",
            "customer": {
                "id": "33cc5b44-3b63-4e19-8917-403ff21efc1d",
                "name": "GOL Truck",
            },
            "locations": [
                {
                    "id": 3,
                    "type": "loading",
                    "date": "2018-07-24T20:00:00Z",
                    "address": "City, Street 1",
                    "description": "description1",
                    "point": {
                        "type": "Point",
                        "coordinates": [
                            -123.0208,
                            44.0464
                        ]
                    }
                },
                {
                    "id": 2,
                    "type": "customs",
                    "date": "2018-07-24T20:00:00Z",
                    "address": "City, Street 1",
                    "description": "description2",
                    "point": {
                        "type": "Point",
                        "coordinates": [
                            -123.0208,
                            44.0464
                        ]
                    }
                },
                {
                    "id": 4,
                    "type": "unloading",
                    "date": "2018-07-24T20:00:00Z",
                    "address": "Paradise",
                    "description": "description2",
                    "point": {
                        "type": "Point",
                        "coordinates": [
                            -123.0208,
                            44.0464
                        ]
                    }
                }
            ],
            "containers": [
                {
                    "id": 3,
                    "line": 1,
                    "type": 1,
                    "is_genset": null,
                    "cargo_description": "danger cargo",
                    "cargo_weight": 20,
                    "cargo_package": "some package",
                    "is_adr": false,
                    "un_number": null,
                    "trailer_type": "long",
                    "is_trailer_protected": false,
                    "is_trailer_telescopic": false,
                    "truck_axles": 2,
                    "trailer_axles": 4
                },
                {
                    "id": 4,
                    "line": 2,
                    "type": 2,
                    "is_genset": null,
                    "cargo_description": "super danger cargo",
                    "cargo_weight": 30,
                    "cargo_package": "some package",
                    "is_adr": false,
                    "un_number": null,
                    "trailer_type": "long",
                    "is_trailer_protected": false,
                    "is_trailer_telescopic": false,
                    "truck_axles": 2,
                    "trailer_axles": 4
                }
            ]
        }
    );
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});
