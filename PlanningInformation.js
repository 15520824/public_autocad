var _ = absol._;
var $ = absol.$;

function PlanningInformation() {
    this.hash = [];
}

PlanningInformation.prototype.setContainer = function(parent) {
    this.parent = parent;
}

PlanningInformation.prototype.constructor = PlanningInformation;

PlanningInformation.prototype.setUpDxfFile = function(fileText, loadding) {
    var parser = new DxfParser();
    var dxf = null;
    try {
        dxf = parser.parseSync(fileText);
    } catch (err) {
        return console.error(err.stack);
    }

    var wkt = GeoJSON.parse(dxf);
    console.log(wkt);
    var center = new google.maps.LatLng(GeoJSON.header.$LATITUDE, GeoJSON.header.$LONGITUDE);
    window.dcel.extractLines();
    var faces = dcel.internalFaces();
    wkt = consoleWKT(faces);
    var lines = consoleWKTLine(window.dcel.checkHedges);
    if (lines !== -1)
        this.addLine(lines);
    if (this.isVisiableLine === true)
        this.showHideLine();
    this.isVisiableLine = true;
    var tempPolygon = this.addWKT(wkt);
    this.polygon = this.polygon.concat(tempPolygon);
    this.hash.polygon = tempPolygon;
    this.mapView.map.setCenter(center);
    this.mapView.map.setZoom(17);
    this.mapView.map.data.setStyle({
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
    });
    console.timeEnd("dcel cost");
    loadding.disable();
}

PlanningInformation.prototype.setUpDxfFileLine = function(fileText, loadding) {
    var parser = new DxfParser();
    var dxf = null;
    try {
        dxf = parser.parseSync(fileText);
    } catch (err) {
        return console.error(err.stack);
    }
    console.log(dxf)
    var wkt = GeoJSON.parse(dxf);
    var center = new google.maps.LatLng(GeoJSON.header.$LATITUDE, GeoJSON.header.$LONGITUDE);
    var lines = window.dcel.extractOnlyLines();
    lines = consoleWKTLine(lines);
    if (lines !== -1)
        this.addLine(lines, "#000000");
    this.mapView.map.setCenter(center);
    this.mapView.map.setZoom(17);
    this.mapView.map.data.setStyle({
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
    });
    console.timeEnd("dcel cost");
    loadding.disable();
}

PlanningInformation.prototype.showHideLine = function() {
    if (this.lines)
        if (this.isVisiableLine === true) {
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].setMap(null);
            }
            this.isVisiableLine = false
        } else {
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].setMap(this.mapView.map);
            }
            this.isVisiableLine = true;
        }
}

PlanningInformation.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    var allinput = _({
        tag: "input",
        class: "pizo-list-realty-page-allinput-input",
        props: {
            placeholder: "Tìm theo địa chỉ"
        }
    });
    if (window.mobilecheck()) {
        allinput.placeholder = "Tìm theo địa chỉ"
    }

    var mapView = new MapView();
    // Set CSS for the control button
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#444';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = 'white';
    controlUI.style.height = '28px';
    controlUI.style.marginTop = '5px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center map on your location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control text
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '10px';
    controlText.style.color = 'white';
    controlText.style.paddingLeft = '10px';
    controlText.style.paddingRight = '10px';
    controlText.style.marginTop = '8px';
    controlText.innerHTML = 'Chọn để ẩn hiện nét đã bỏ';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to geolocate user
    google.maps.event.addDomListener(controlUI, 'click', this.showHideLine.bind(this));

    mapView.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

    this.searchControl = this.searchControlContent();

    var hiddenInput = _({
        tag: "input",
        class: "hiddenUI",
        on: {
            change: function(event) {
                if (this.files.length == 0)
                    return;
                var file = this.files[0];
                var reader = new FileReader();
                reader.readAsText(this.files[0]);
                reader.onload = function(e) {
                    console.time("dcel cost");
                    console.log(file)
                    var extension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
                    var fileText = e.target.result;
                    if (extension === "dxf") {
                        if (true) {
                            var loadding = new loaddingWheel();
                            setTimeout(function() {
                                self.setUpDxfFile(fileText, loadding);
                            }, 60)
                        } else {
                            var loadding = new loaddingWheel();
                            setTimeout(function() {
                                self.setUpDxfFile(fileText, loadding)
                            }, 60)
                        }
                    }
                }
            }
        },
        props: {
            id: "file-field",
            type: "file"
        }
    })
    var hiddenInput1 = _({
        tag: "input",
        class: "hiddenUI",
        on: {
            change: function(event) {
                if (this.files.length == 0)
                    return;
                var file = this.files[0];
                var reader = new FileReader();
                reader.readAsText(this.files[0]);
                reader.onload = function(e) {
                    console.time("dcel cost");
                    console.log(file)
                    var extension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
                    var fileText = e.target.result;
                    if (extension === "dxf") {
                        if (true) {
                            var loadding = new loaddingWheel();
                            setTimeout(function() {
                                self.setUpDxfFileLine(fileText, loadding)
                            }, 60)
                        } else {
                            var loadding = new loaddingWheel();
                            setTimeout(function() {
                                self.setUpDxfFile(fileText, loadding)
                            }, 60)
                        }
                    }
                }
            }
        },
        props: {
            id: "file-field",
            type: "file"
        }
    })

    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [{
            class: 'absol-single-page-header',
            style: {
                paddingRight: 0
            },
            child: [{
                    tag: "span",
                    class: "pizo-body-title-left",
                    props: {
                        innerHTML: "Thông tin quy hoạch"
                    }
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-button",
                    child: []
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-page-allinput",
                    style: {
                        paddingLeft: 0,
                        marginTop: "10px"
                    },
                    child: [{
                        tag: "div",
                        class: "pizo-list-realty-page-allinput-container",
                        style: {
                            width: "100%"
                        },
                        child: [
                            allinput,
                            {
                                tag: "button",
                                class: "pizo-list-realty-page-allinput-search",
                                child: [{
                                    tag: 'i',
                                    class: 'material-icons',
                                    props: {
                                        innerHTML: 'search'
                                    },
                                }, ]
                            },
                        ]
                    }, ]
                }
            ]
        }, ]
    });
    $("div.pizo-list-realty-button", this.$view).appendChild(_({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                hiddenInput.click()
            }
        },
        child: [
            '<span>' + "Thêm quy hoạch" + '</span>'
        ]
    }));

    $("div.pizo-list-realty-button", this.$view).appendChild(_({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                hiddenInput1.click()
            }
        },
        style: {
            marginLeft: "10px"
        },
        child: [
            '<span>' + "Thêm chú thích" + '</span>'
        ]
    }));

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-plan-main"],
        style: {
            flexDirection: "column"
        },
        child: [
            this.searchControl,
            {
                tag: "div",
                class: ["pizo-list-realty-main-result-control"],
                child: [
                    mapView
                ]
            }
        ]
    }));
    this.mapView = mapView;
    this.mapView.map.enableKeyDragZoom(this.selectPolygonFunction.bind(this));
    this.mapView.map.setTilt(45);
    var polyOptions = {
        strokeColor: "#eb4034",
        fillColor: "#c18986",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        editable: true,
        draggable: true
    };

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions: {
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        markerOptions: {
            draggable: true
        },
        polylineOptions: {},
        draggableCursor: 'crosshair',
        rectangleOptions: polyOptions,
        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        map: this.mapView.map
    });
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
        self.removeAllSelect();
        var polygon = e.overlay;
        self.polygon.push(polygon);
        self.addEventPolygon(polygon);
        if (self.editPolygon !== undefined) {
            self.editPolygon.toInActive(self);
        }
        polygon.toActive(self);
        polygon.setOptions({ editable: true, draggable: true });
        self.editPolygon = polygon;

    })

    this.mapView.map.setOptions({ maxZoom: 30 });
    this.drawingManager = drawingManager;
    this.polygon = [];
    this.selectPolygon = [];
    window.addEventListener("keydown", function(e) {
        if (e.keyCode == 46) {
            if (self.editPolygon !== undefined) {
                self.editPolygon.setMap(null);
                var index = self.polygon.indexOf(self.editPolygon);
                self.polygon.splice(index, 1);
            }
            for (var i = 0; i < self.selectPolygon.length; i++) {
                self.selectPolygon[i].setMap(null);
                google.maps.event.clearListeners(self.selectPolygon[i], 'click');
                var index = self.polygon.indexOf(self.selectPolygon[i]);
                self.polygon.splice(index, 1);
            }
            if (self.allPolygon !== undefined) {
                self.allPolygon.setMap(null);
                self.allPolygon = undefined;
            }
            self.selectPolygon = [];
        } else if (e.keyCode == 27) {
            self.removeAllSelect();
            if (self.editPolygon !== undefined) {
                self.editPolygon.toInActive(self);
            }
        }

    })
    this.allinput = allinput;
    var searchBox = new google.maps.places.SearchBox(allinput, {
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    });
    google.maps.event.addListener(this.mapView.map, 'bounds_changed', function() {
        var bounds = self.mapView.map.getBounds();
        searchBox.setBounds(bounds);
    });
    this.searchBox = searchBox;
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        // For each place, get the icon, place name, and location.
        var bounds = new google.maps.LatLngBounds();
        var place = null;
        for (var i = 0; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }
        self.mapView.map.setCenter(bounds.getCenter());
    });

    moduleDatabase.getModule("geometry_created").load(undefined, true).then(function(value) {
        self.filterTime.updateItem(value);
    })
    return this.$view;
}

PlanningInformation.prototype.removeAllSelect = function() {
    var self = this;
    if (self.allPolygon !== undefined) {
        for (var i = 0; i < self.selectPolygon.length; i++) {
            self.selectPolygon[i].setMap(self.mapView.map);
            if (self.allPolygon !== undefined && self.allPolygon.deltaDrag !== undefined && (self.allPolygon.deltaDrag.lat !== 0 || self.allPolygon.deltaDrag.lng !== 0)) {
                var center = self.selectPolygon[i].getBounds().getCenter().toJSON();
                center.lat += self.allPolygon.deltaDrag.lat;
                center.lng += self.allPolygon.deltaDrag.lng;
                self.selectPolygon[i].moveTo(new google.maps.LatLng(center.lat, center.lng));
            }
        }

        self.allPolygon.setMap(null);
        self.allPolygon = undefined;
        self.selectPolygon = [];
    }
}

PlanningInformation.prototype.createHash = function(arr) {
    var data = [];
    for (var i = 0; i < arr.length; i++) {
        this.createHashRow(arr[i], data);
    }
    return data;
}

PlanningInformation.prototype.createHashRow = function(data, hash) {
    var intLat, intLng, cellLat, cellLng, created;
    var center = data.getBounds().getCenter().toJSON();
    intLng = parseInt(center.lng / 1);
    cellLng = Math.ceil(center.lng % 1 / (1 / 1110)) - 1;
    intLat = parseInt(center.lat / 1);
    cellLat = Math.ceil(center.lat % 1 / (1 / 1110)) - 1;
    cellLng = intLng * 10000 + cellLng;
    cellLat = intLat * 10000 + cellLat;
    if (data.created !== undefined) {
        created = data.created;
        if (hash[created] === undefined)
            hash[created] = [];
        if (hash[created][cellLat] == undefined)
            hash[created][cellLat] = [];
        if (hash[created][cellLat][cellLng] == undefined)
            hash[created][cellLat][cellLng] = [];
        hash[created][cellLat][cellLng].push(data.ToWKT());
    } else {
        if (hash[cellLat] == undefined)
            hash[cellLat] = [];
        if (hash[cellLat][cellLng] == undefined)
            hash[cellLat][cellLng] = [];
        hash[cellLat][cellLng].push(data);
    }

}

PlanningInformation.prototype.saveCurrentDataMap = function() {
    var data = this.createHash(this.polygon);
    var gmt = getGMT();
    for (var param in data) {
        if (param === "polygon")
            continue;
        if (isNaN(param / 1) === true) {
            name = data[param].name;
            for (var cellLat in data[param]) {
                if (cellLat === "polygon")
                    continue;
                var dataLat = data[param][cellLat];
                for (var cellLng in dataLat) {
                    if (this.hash[param] === undefined || this.hash[param][cellLat] === undefined || this.hash[param][cellLat][cellLng] === undefined) {
                        var arr = dataLat[cellLng];
                        var wkt = new Wkt.Wkt();
                        for (var i = 0; i < arr.length; i++) {
                            if (i === 0)
                                wkt.read(arr[i]);
                            else
                                wkt.merge(new Wkt.Wkt(arr[i]));
                        }

                        moduleDatabase.getModule("geometry").add({
                            cellLat: cellLat,
                            cellLng: cellLng,
                            name: input.value,
                            created: param,
                            map: wkt.toString()
                        })

                    } else {
                        var arr = dataLat[cellLng];
                        var wkt = new Wkt.Wkt();
                        for (var i = 0; i < arr.length; i++) {
                            if (i === 0)
                                wkt.read(arr[i]);
                            else
                                wkt.merge(new Wkt.Wkt(arr[i]));
                        }

                        var arr = this.hash[param][cellLat][cellLng];
                        var wkt2 = new Wkt.Wkt();
                        for (var i = 0; i < arr.length; i++) {
                            if (i === 0)
                                wkt2.read(arr[i]);
                            else
                                wkt2.merge(new Wkt.Wkt(arr[i]));
                        }

                        if (wkt.toString() !== wkt2.toString()) {
                            moduleDatabase.getModule("geometry").update({
                                cellLat: cellLat,
                                cellLng: cellLng,
                                created: param,
                                map: wkt.toString()
                            });
                        }
                        delete this.hash[param][cellLat][cellLng];
                    }
                }
            }
        } else {
            var promiseAll = [];
            for (var child in data[param]) {
                var arr = data[param][child];
                var wkt = new Wkt.Wkt();
                for (var i = 0; i < arr.length; i++) {
                    var stringWKT = arr[i].ToWKT();
                    if (i === 0)
                        wkt.read(stringWKT)
                    else
                        wkt.merge(new Wkt.Wkt(stringWKT));
                    arr[i].created = gmt;
                    arr[i] = stringWKT;
                }
                promiseAll.push(moduleDatabase.getModule("geometry").add({
                    cellLat: param,
                    cellLng: child,
                    name: this.commitComment,
                    created: gmt,
                    map: wkt.toString()
                }))
            }
            var x = data[param];
            var polygon = this.hash.polygon;
            delete data[param];
            delete data.polygon;
            if (data[gmt] === undefined)
                data[gmt] = [];
            data[gmt][param] = x;
            if (polygon)
                data[gmt].polygon = polygon;
            var date = formatDate(gmt, true, true, true, true, true);
            if (this.filterTime.values.indexOf(gmt) == -1) {
                this.filterTime.items.push({ text: this.commitComment + " (" + date + ")", value: gmt });
                this.filterTime.items = this.filterTime.items;
                this.filterTime.values.push(gmt);
                this.filterTime.values = this.filterTime.values;
            }

        }

    }
    var promiseAllDelete = [];
    for (var param in this.hash) {
        if (param === "polygon")
            continue;
        if (this.filterTime.values.indexOf(param) == -1)
            continue;
        if (isNaN(param / 1)) {
            for (var ortherLat in this.hash[param]) {
                if (ortherLat === "polygon")
                    continue;
                for (var ortherLng in this.hash[param][ortherLat])
                    promiseAllDelete.push(moduleDatabase.getModule("geometry").delete({
                        cellLat: ortherLat,
                        cellLng: ortherLng,
                        created: param
                    }))
            }
        }
        if (data[param] === undefined) {
            for (var i = 0; i < this.filterTime.values.length; i++) {
                if (this.filterTime.values[i] == param) {
                    this.filterTime.values.splice(i, 1);
                    this.filterTime.values = this.filterTime.values;
                    break;
                }
            }
            for (var i = 0; i < this.filterTime.items.length; i++) {
                if (this.filterTime.items[i].value == param) {
                    this.filterTime.items.splice(i, 1);
                    this.filterTime.items = this.filterTime.items;
                    break;
                }
            }
        }
    }
    Promise.all(promiseAllDelete).then(function(values) {

    })
    this.commitComment = undefined;
    this.hash = data;
}

PlanningInformation.prototype.addEventPolygon = function(polygon) {
    var self = this;
    google.maps.event.addListener(polygon, 'click', function(event) {
        if (moduleDatabase.checkPermission[0].indexOf(31) == -1)
            return;
        if (self.editPolygon === this) {
            this.toInActive(self);
        } else {
            if (self.editPolygon !== undefined) {
                self.editPolygon.toInActive(self);
                this.toActive(self);
                this.setOptions({ editable: true, draggable: true });
            } else {
                if (self.allPolygon !== undefined) {
                    if (self.selectPolygon.indexOf(this) === -1) {
                        self.allPolygon.setMap(null);
                        var path = [];
                        var tempPath;
                        for (var i = 0; i < self.selectPolygon.length; i++) {
                            if (self.allPolygon !== undefined && self.allPolygon.deltaDrag !== undefined && (self.allPolygon.deltaDrag.lat !== 0 || self.allPolygon.deltaDrag.lng !== 0)) {
                                var center = self.selectPolygon[i].getBounds().getCenter().toJSON();
                                center.lat += self.allPolygon.deltaDrag.lat;
                                center.lng += self.allPolygon.deltaDrag.lng;
                                self.selectPolygon[i].moveTo(new google.maps.LatLng(center.lat, center.lng));
                            }
                            tempPath = [];
                            for (var j = 0; j < self.selectPolygon[i].getPath().getLength(); j++) {
                                tempPath.push(self.selectPolygon[i].getPath().getAt(j).toJSON())
                            }
                            self.selectPolygon[i].setMap(null);
                            path.push(tempPath)
                        }
                        tempPath = [];
                        for (var j = 0; j < this.getPath().getLength(); j++) {
                            tempPath.push(this.getPath().getAt(j).toJSON())
                        }
                        path.push(tempPath)
                        this.setMap(null);
                        self.selectPolygon.push(this);
                        if (this.isVisiableLine === true)
                            this.showHideLine();
                        self.createAllPolygon(path);

                    }
                } else {
                    this.toActive(self);
                    this.setOptions({ editable: true, draggable: true });
                }

            }
        }
    });
}

PlanningInformation.prototype.selectPolygonFunction = function(bns) {
    this.removeAllSelect();
    if (this.isVisiableLine === true)
        this.showHideLine();
    if (this.editPolygon !== undefined)
        this.editPolygon.toInActive(this);
    var path = [];
    var tempPath;
    if (this.a == undefined || this.b == undefined) {
        for (var param in bns) {
            if (!(this.a == undefined || this.b == undefined))
                break;
            if (bns[param].i > 50) {
                this.a = param;
            } else if (bns[param].i < 50) {
                this.b = param;
            }
        }
    }
    var minX, maxX, minY, maxY;
    minX = bns[this.b].i;
    maxX = bns[this.b].j;
    minY = bns[this.a].i;
    maxY = bns[this.a].j;
    while (0 > maxY)
        maxY += 180;
    maxY += 180;
    for (var i = 0; i < this.polygon.length; i++) {
        tempPath = [];
        var boundary = this.polygon[i].boundary();
        if (minX < boundary.min.lat && boundary.max.lat < maxX &&
            minY < boundary.min.lng && boundary.max.lng < maxY) {
            for (var j = 0; j < this.polygon[i].getPath().getLength(); j++) {
                tempPath.push(this.polygon[i].getPath().getAt(j).toJSON())
            }
            this.polygon[i].setMap(null);
            this.selectPolygon.push(this.polygon[i]);
        }
        path.push(tempPath)
    }
    for (var i = 0; i < this.linesSelect.length; i++) {
        tempPath = [];
        var boundary = this.linesSelect[i].getBounds();
        console.log(boundary)
        if (minX < boundary.min.lat && boundary.max.lat < maxX &&
            minY < boundary.min.lng && boundary.max.lng < maxY) {
            for (var j = 0; j < this.linesSelect[i].getPath().getLength(); j++) {
                tempPath.push(this.linesSelect[i].getPath().getAt(j).toJSON())
            }
            this.linesSelect[i].setMap(null);
            this.selectPolygon.push(this.linesSelect[i]);
        }
        path.push(tempPath)
    }
    this.createAllPolygon(path)
}

PlanningInformation.prototype.createAllPolygon = function(path) {
    var polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: "#eb4034",
        fillColor: "#c18986",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        draggable: true,
        geodesic: true
    })
    google.maps.event.addListener(polygon, 'dragstart', function(e) {
        if (this.dragStart == undefined)
            this.dragStart = polygon.getBounds().getCenter().toJSON();
    });
    google.maps.event.addListener(polygon, 'dragend', function(e) {
        var center = polygon.getBounds().getCenter().toJSON();
        this.deltaDrag = { lat: center.lat - this.dragStart.lat, lng: center.lng - this.dragStart.lng }
    });
    polygon.setMap(this.mapView.map);
    this.allPolygon = polygon;
    return polygon;
}

PlanningInformation.prototype.searchControlContent = function() {
    var self = this;
    var filterTime = _({
        tag: "selectbox",
        props: {
            enableSearch: true,
        },
        on: {
            click: function(event) {
                if (this.disableClick === true)
                    return;
                else {
                    var element = event.target;
                    while (!(element.classList.contains("absol-selectbox-item-close") || element.classList.contains("absol-selectbox-item") || element.classList.contains("absol-selectbox")))
                        element = element.parentNode;
                    if (element.data) {
                        self.removeAllSelect();
                        if (self.isVisiableLine === true)
                            self.showHideLine();
                        if (self.editPolygon !== undefined)
                            self.editPolygon.toInActive(this);
                        var path = [];
                        var tempPath;
                        console.log(self.hash, element.data.value)
                        var listPolygon = self.getCurrentWKT(element.data.value);
                        if (listPolygon) {
                            for (var i = 0; i < listPolygon.length; i++) {
                                tempPath = [];
                                for (var j = 0; j < listPolygon[i].getPath().getLength(); j++) {
                                    tempPath.push(listPolygon[i].getPath().getAt(j).toJSON())
                                }
                                listPolygon[i].setMap(null);
                                self.selectPolygon.push(listPolygon[i]);
                                path.push(tempPath)
                            }
                            self.createAllPolygon(path);
                        }
                    }
                }
            },
            add: function(event) {
                var elementThis = this;
                if (self.hash[event.value] === undefined) {
                    elementThis.disableClick = true;
                    moduleDatabase.getModule("geometry").load({ WHERE: [{ created: "'" + event.value + "'" }] }).then(function(value) {
                        var result = [];
                        for (var i = 0; i < value.length; i++) {
                            result = result.concat(self.addWKT(value[i]))
                        }
                        self.polygon = self.polygon.concat(result);
                        self.hash[event.value].polygon = result;
                        var center = value[value.length - 1];
                        self.mapView.map.setCenter(new google.maps.LatLng(parseInt(center.cellLat / 10000) + (center.cellLat % 10000 - 1) * (1 / 1110), parseInt(center.cellLng / 10000) + (center.cellLng % 10000 - 1) * (1 / 1110)));
                        self.mapView.map.setZoom(17);
                        elementThis.disableClick = false;
                    })
                } else {
                    self.polygon = self.polygon.concat(self.addCurrentWKT(event.value));
                }

            },
            remove: function(event) {
                self.removeAllSelect();
                for (var i = self.polygon.length - 1; i >= 0; i--) {
                    if (self.polygon[i].created === event.value) {
                        self.polygon[i].setMap(null);
                        self.polygon.splice(i, 1);
                    }
                }
            }
        }
    });

    filterTime.updateItem = function(value) {
        var list = [];
        for (var i = 0; i < value.length; i++) {
            list.push({ text: value[i].name + " (" + (formatDate(value[i].created, true, true, true, true, true, true)) + ")", value: value[i].created });
        }
        this.items = list;
    }

    var content = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control-container",
        on: {
            click: function(event) {
                event.stopPropagation();
            }
        },
        child: [{
            tag: "div",
            class: "pizo-list-realty-main-search-control-container-scroller",
            child: [{
                tag: "div",
                class: "pizo-list-plan-main-search-control-row",
                child: [{
                        tag: "div",
                        class: "pizo-list-plan-main-search-control-row-selectbox-plan",
                        child: [{
                            tag: "span",
                            class: "pizo-list-plan-main-search-control-row-selectbox-plan-label",
                            props: {
                                innerHTML: "Lần commit"
                            }
                        }]

                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-main-search-control-row-selectbox-plan-input",
                        child: [
                            filterTime
                        ]
                    }
                ]
            }]
        }]
    });
    var temp = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control",
        on: {
            click: function(event) {
                this.hide();
            }
        },
        child: [
            content
        ]
    })

    this.filterTime = filterTime;


    temp.show = function() {
        if (!temp.classList.contains("showTranslate"))
            temp.classList.add("showTranslate");
    }
    temp.hide = function() {
        if (!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function() {
            if (temp.classList.contains("showTranslate"))
                temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd", eventEnd);
            content.removeEventListener("transitionend", eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function() {

    }
    temp.reset = function() {
        content.lowprice.value = "";
        content.highprice.value = "";
        content.phone.value = "";
        content.MS.value = "";
        content.SN.value = "";
        content.TD.value = "";
        content.PX.value = "";
        content.QH.value = "";
        content.TT.value = "";
        content.HT.value = 0;
    }


    return temp;
}

PlanningInformation.prototype.addWKT = function(multipolygonWKT) {
    if (this.hash === undefined)
        this.hash = [];
    var created, name;
    if (typeof multipolygonWKT == "object") {
        created = multipolygonWKT["created"];
        name = multipolygonWKT["name"]
        multipolygonWKT = multipolygonWKT["AsText(`map`)"];
    }
    var wkt = new Wkt.Wkt();
    wkt.read(multipolygonWKT);
    var toReturn = [];
    var components = wkt.components;
    for (var k = 0; k < components.length; k++) {
        var line = components[k];
        var polygon = new google.maps.Polygon({
            paths: line,
            strokeColor: "#000000",
            fillColor: "#adaeaf",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            map: this.mapView.map,
            geodesic: true
        })
        this.addEventPolygon(polygon);
        if (created !== undefined) {
            polygon.created = created;
            polygon.name = name;
        }
        toReturn.push(polygon);
        this.createHashRow(polygon, this.hash);
    }
    return toReturn;
}

PlanningInformation.prototype.addLine = function(lines, color = "#FF0000") {
    var wkt = new Wkt.Wkt();
    wkt.read(lines);
    var toReturn = [];
    var components = wkt.components;
    for (var k = 0; k < components.length; k++) {
        var line = components[k];
        var polyline = new google.maps.Polyline({
            path: line,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 2,
        })
        polyline.setMap(this.mapView.map);
        toReturn.push(polyline);
    }
    if (color !== "#FF0000")
        this.linesSelect = toReturn;
    return toReturn;
}

PlanningInformation.prototype.addCurrentWKT = function(created) {
    var toReturn = [];
    var cellLatTemp;
    var cellLngTemp;
    for (var cellLat in this.hash[created]) {
        for (var cellLng in this.hash[created][cellLat]) {
            if (cellLatTemp === undefined)
                cellLatTemp = cellLat;
            if (cellLngTemp === undefined)
                cellLngTemp = cellLng;
            var arr = this.hash[created][cellLat][cellLng];
            for (var i = 0; i < arr.length; i++) {
                var wkt = new Wkt.Wkt();
                wkt.read(arr[i]);
                var components = wkt.components;
                var polygon = new google.maps.Polygon({
                    paths: components,
                    strokeColor: "#000000",
                    fillColor: "#adaeaf",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    map: this.mapView.map,
                    geodesic: true
                })
                this.addEventPolygon(polygon);
                if (created !== undefined)
                    polygon.created = created;
                toReturn.push(polygon);
            }
        }
    }
    this.mapView.map.setCenter(new google.maps.LatLng(parseInt(cellLatTemp / 10000) + (cellLatTemp % 10000 - 1) * (1 / 1110), parseInt(cellLngTemp / 10000) + (cellLngTemp % 10000 - 1) * (1 / 1110)));
    this.mapView.map.setZoom(17);
    this.hash[created].polygon = toReturn;
    return toReturn;
}

PlanningInformation.prototype.getCurrentWKT = function(created) {
    return this.hash[created].polygon;
}


PlanningInformation.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

PlanningInformation.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

PlanningInformation.prototype.flushDataToView = function() {
    if (this.dataFlushed) return;
    this.dataFlushed = true;
    //TODO: remove older view
    if (!this.data) return;
    this.$content.clearChild();
    if (this.data && this.$view) {
        this.rootComponent = this.build(this.data);
        this.$content.addChild(this.rootComponent.view);
        this.rootComponent.onAttach();
        this.$widthIp.value = this.rootComponent.getStyle('width', 'px');
        this.$heightIp.value = this.rootComponent.getStyle('height', 'px');
    }
};

PlanningInformation.prototype.start = function() {

}

window.PlanningInformation = PlanningInformation;