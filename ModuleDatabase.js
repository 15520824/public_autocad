function ModuleDatabase() {
    this.hostDatabase = "https://lab.daithangminh.vn/home_co/pizo/php/template/";
    this.data = [];
}

ModuleDatabase.prototype.getModule = function(name, listFilePHP, isCreated = false) {
    if (isCreated == true || this.data[name] == undefined) {
        this.data[name] = new DataStructure(this.hostDatabase, name, listFilePHP);
        return this.data[name];
    } else
        return this.data[name];
}



function DataStructure(hostDatabase, name, listFilePHP = ["load.php", "add.php", "update.php", "delete.php"]) {
    this.phpLoader = hostDatabase + listFilePHP[0];
    this.phpAdder = hostDatabase + listFilePHP[1];
    this.phpUpdater = hostDatabase + listFilePHP[2];
    this.phpDeleter = hostDatabase + listFilePHP[3];
    this.name = name;
    this.Libary = [];
    this.sync = [];
    this.promisePart = [];
    this.isFirst = true;
}

DataStructure.prototype.generalOperator = function(data, WHERE) {
    var stringResult = this.operator(data, WHERE);
    return eval(stringResult);
}

// DataStructure.prototype.generalOrder = function(data,W)

DataStructure.prototype.operator = function(data, WHERE) {
    var stringResult = "(";
    for (var i = 0; i < WHERE.length; i++) {
        stringResult += this.equal(data, WHERE[i]);
    }
    return stringResult + ")";
}

DataStructure.prototype.equal = function(data, WHERE) {
    var stringResult = "";
    if (typeof WHERE === "string") {
        return WHERE;
    } else
    if (typeof WHERE === "object") {
        if (Array.isArray(WHERE)) {
            stringResult += this.operator(data, WHERE);
        } else {
            for (var param in WHERE) {
                if (typeof WHERE[param] === "object") {
                    if (eval(data[param] + WHERE[param].operator + WHERE[param].value))
                        stringResult += true;
                    else
                        stringResult += false;
                } else {
                    if (data[param] == WHERE[param])
                        stringResult += true;
                    else
                        stringResult += false;
                }
            }
        }
    }
    return stringResult;
}

DataStructure.prototype.load = function(data = [], isLoaded = false) {
    var self = this;
    if (data.WHERE == undefined) {
        if (isLoaded == false && self.promiseLoad !== undefined) {
            if (self.promiseLoad.status === "pending")
                return self.promiseLoad;
            else
                return Promise.resolve(self.data);
        }

    } else {
        if (isLoaded == false && self.promisePart[JSON.stringify(data.WHERE)] !== undefined) {
            if (self.promisePart[JSON.stringify(data.WHERE)].status === "pending")
                return self.promisePart[JSON.stringify(data.WHERE)];
            else
                return Promise.resolve(self.promisePart[JSON.stringify(data.WHERE)].data);
        }
    }

    var promiseLoad;

    if (this.isFirst === true && data.WHERE !== undefined) {
        data.isFirst = true;
        this.isFirst = false;
    }

    if (data.loaded === undefined) {
        data.loaded = {};
    }
    if (data.loaded[this.name] == undefined)
        data.loaded[this.name] = [];

    if (data.WHERE !== undefined)
        if (self.data !== undefined && self.data.length !== 0) {
            for (var i = 0; i < self.data.length; i++) {
                if (this.generalOperator(self.data[i], data.WHERE)) {
                    data.loaded[this.name].push(self.data[i]["id"]);
                }
            }
        } else
    if (self.data !== undefined && self.data.length !== 0) {
        for (var i = 0; i < self.data.length; i++) {
            data.loaded[this.name].push(self.data[i]["id"]);
        }
    }
    promiseLoad = new Promise(function(resolve, reject) {
        self.queryData(self.phpLoader, data).then(function(valueRecived) {
                var value = valueRecived["data"];
                var update = valueRecived["update"];
                var insert = valueRecived["add"];
                if (insert !== undefined) {
                    for (var i = 0; i < value.add.length; i++) {
                        for (var param in insert[i]) {
                            if (moduleDatabase.data[param] !== undefined) {
                                moduleDatabase.data[param].setFormatAdd(insert[i][param]);
                            }
                        }
                    }
                }
                if (update !== undefined) {
                    for (var i = 0; i < update.length; i++) {
                        for (var param in update[i]) {
                            if (moduleDatabase.data[param] !== undefined) {
                                moduleDatabase.data[param].setFormatUpdate(update[i][param]);
                            }
                        }
                    }
                }
                self.setFormatLoad(data, value, promiseLoad, valueRecived["count"]);
                // var loadedData = valueRecived["load"];
                // console.log(loadedData)
                // for(var param in loadedData)
                // {
                //     console.log(moduleDatabase[param])
                //     moduleDatabase.getModule(param).setFormatLoad({WHERE:data.WHERE},loadedData[param])
                // }
                resolve(value);
            })
            .catch(function(error) {
                promiseLoad.status = "reject";
                reject(error);
                console.error(error);
            })
    })
    promiseLoad.status = "pending";
    if (data.WHERE === undefined)
        self.promiseLoad = promiseLoad;
    else
        self.promisePart[JSON.stringify(data.WHERE)] = promiseLoad;

    return promiseLoad;
}

DataStructure.prototype.setFormatLoad = function(data, value, promiseLoad, count = -1) {
    var self = this;
    if (value === undefined)
        value = [];

    if (self.data === undefined)
        self.data = [];
    if (data.WHERE === undefined) {
        self.countRow = value.length;
    } else {
        if (promiseLoad == undefined) {
            self.promisePart[JSON.stringify(data.WHERE)] = Promise.resolve(value);
            self.promisePart[JSON.stringify(data.WHERE)].data = value;
        }

        if (data.isFirst === true) {
            if (count !== -1)
                self.countRow = parseInt(count);
        }
    }
    var libary = self.Libary["id"];
    if (libary === undefined) {
        self.data = [...value];
    } else {
        if (self.data.length === self.countRow) {
            if (self.promiseLoad === undefined)
                self.promiseLoad = Promise.resolve(self.data);
        }
        for (var i = 0; i < value.length; i++) {
            if (typeof value[i] == "string") {
                if (self.Libary["id"][value[i]] !== undefined) {
                    value[i] = self.Libary["id"][value[i]];
                }
            } else {
                self.setFormatAdd(value[i]);
            }
        }
    }

    if (self.Libary["id"] === undefined)
        self.getLibary();
    if (typeof promiseLoad == "object") {
        promiseLoad.status = "done";
        promiseLoad.data = value;
    }
}

DataStructure.prototype.getLibary = function(param, formatFunction, isArray = false, isLoaded = false) {
    if (formatFunction === undefined)
        formatFunction = function(data) {
            return data;
        }
    if (param !== undefined) {
        if (Array.isArray(param) === false) {
            param = [param];
        } else
            param = param;
        for (var j = 0; j < param.length; j++) {
            if (isLoaded === true || this.Libary[param] == undefined) {
                for (var i = 0; i < this.data.length; i++) {
                    this.setLibaryRow(this.data[i], param[j], formatFunction, isArray);
                }
            }
        }
        if (param.length == 1) {
            if (this.Libary[param[0]] == undefined)
                this.Libary[param[0]] = [];
            return this.Libary[param[0]];
        }
    } else {
        var isID = false;
        for (var param in this.Libary) {
            if (param === "id")
                isID = true;
            for (var i = 0; i < this.data.length; i++) {
                this.setLibaryRow(this.data[i], param, formatFunction, isArray);
            }
        }
        if (isID === false) {
            for (var i = 0; i < this.data.length; i++) {
                this.setLibaryRow(this.data[i], "id", formatFunction, isArray);
            }
        }
    }

    return this.Libary;
}

DataStructure.prototype.sync = function(element, functionSync) {
    this.sync.push(element, functionSync);
}

DataStructure.prototype.setLibaryRow = function(data, param, formatFunction, isArray) {
    var self = this;
    if (this.Libary[param] === undefined) {
        this.Libary[param] = [];
        this.Libary[param].isArray = isArray;
        this.Libary[param].check = [];
        this.Libary[param].formatFunction = function(data, param) {
            var result = formatFunction(data);
            result.getData = function() {
                return data;
            };
            if (this.check[data["id"]] !== undefined)
                return;
            this.check[data["id"]] = result;
            if (this[data[param]] == undefined || this[data[param]].index == 0) {
                if (this.isArray == true)
                    this[data[param]] = [result];
                else
                    this[data[param]] = result;
                this[data[param]].index = 1;
            } else {
                if (this[data[param]].index == 1 && this.isArray !== true) {
                    this[data[param]] = [this[data[param]]];
                }
                this[data[param]].push(result);
                this[data[param]].index++;
            }

        };
        this.Libary[param].deleteFunction = function(data, param) {
            if (this[data[param]].index == 1 && this.isArray !== true)
                delete this[data[param]];
            else
                for (var i = 0; i < this[data[param]].length; i++) {
                    if (this[data[param]][i].getData() === data) {
                        this[data[param]].splice(i, 1);
                    }
                }
            if (this[data[param]] !== undefined) {
                this[data[param]].index--;
                if (this[data[param]].index == 1 && this.isArray !== true)
                    this[data[param]] = this[data[param]][0];
            }
            if (this.check[data["id"]] !== undefined)
                this.check[data["id"]] = undefined;
        }
    }
    this.Libary[param].formatFunction(data, param);
    data.getList = function(name, value) {
        var text = "";
        for (var i = 0; i < name.length; i++) {
            if (data[name] === undefined)
                text += name[i];
            else
                text += data[name[i]];
        }

        var checkvalue = "";
        var isFirst = "";
        for (var i = 0; i < value.length; i++) {
            if (data[value[i]] === undefined)
                checkvalue += value[i];
            else
                checkvalue += isFirst + data[value[i]];
            isFirst = "_";
        }
        return { text: text, value: checkvalue };
    }
}

DataStructure.prototype.getList = function(param, value, skip) {
    var result = [];
    if (skip == undefined)
        skip = function() {};
    if (Array.isArray(param) != true) {
        param = [param];
    }
    if (Array.isArray(value) != true) {
        value = [value];
    }
    for (var i = 0; i < this.data.length; i++) {
        if (skip(this.data[i]))
            continue;
        result.push(this.data[i].getList(param, value));
    }
    return result;
}

DataStructure.prototype.add = function(data, needChange = false) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.queryData(self.phpAdder, data).then(function(value) {
            if (!Array.isArray(value.data))
                Object.assign(data, value.data);
            if (needChange === true) {
                data.add = Object.assign({}, value.add);
                data.update = Object.assign({}, value.update);
                data.delete = Object.assign({}, value.delete);
            }
            self.setFormatAdd(data);
            var update = value["update"];
            var insert = value["add"];
            var deleteValue = value["delete"];
            if (insert !== undefined) {
                for (var i = 0; i < value.add.length; i++) {
                    for (var param in insert[i]) {
                        if (moduleDatabase.data[param] !== undefined) {
                            moduleDatabase.data[param].setFormatAdd(insert[i][param]);
                        }
                    }
                }
            }
            if (update !== undefined) {
                for (var i = 0; i < update.length; i++) {
                    for (var param in update[i]) {
                        if (moduleDatabase.data[param] !== undefined) {
                            moduleDatabase.data[param].setFormatUpdate(update[i][param]);
                        }
                    }
                }
            }
            if (deleteValue !== undefined) {
                for (var i = 0; i < deleteValue.length; i++) {
                    for (var param in deleteValue[i]) {
                        if (moduleDatabase.data[param] !== undefined) {
                            moduleDatabase.data[param].setFormatDelete(deleteValue[i][param]);
                        }
                    }
                }
            }

            resolve(data);
        }).catch(function(err) {
            reject(err);
            console.error(err)
        })
    })
}

DataStructure.prototype.setFormatAdd = function(data) {
    var self = this;
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            self.setFormatAdd(data[i]);
        }
        return;
    }
    if (self.Libary["id"] !== undefined && self.Libary["id"][data.id] !== undefined)
        return;
    for (var param in self.Libary) {
        if (typeof self.Libary[param] != "function")
            self.Libary[param].formatFunction(data, param);
    }
    data.getList = function(name, value) {
        var text = "";
        for (var i = 0; i < name.length; i++) {
            if (data[name] === undefined)
                text += name[i];
            else
                text += data[name[i]];
        }

        var checkvalue = "";
        var isFirst = "";
        for (var i = 0; i < value.length; i++) {
            if (data[value[i]] === undefined)
                checkvalue += value[i];
            else
                checkvalue += isFirst + data[value[i]];
            isFirst = "_";
        }
        return { text: text, value: checkvalue };
    }
    if (self.data == undefined) {
        self.data = [];
        self.countRow = 0;
    }
    self.data.push(data);
    self.countRow++;
}

DataStructure.prototype.update = function(data, needChange = false) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.queryData(self.phpUpdater, data).then(function(value) {
            if (data.id !== undefined) {
                if (needChange === true) {
                    data.add = Object.assign({}, value.add);
                    data.update = Object.assign({}, value.update);
                    data.delete = Object.assign({}, value.delete);
                }
                self.setFormatUpdate(value.data);
                Object.assign(data, value.data);
                var update = value["update"];
                var insert = value["add"];
                var deleteValue = value["delete"];
                if (insert !== undefined) {
                    for (var i = 0; i < value.add.length; i++) {
                        for (var param in insert[i]) {
                            if (moduleDatabase.data[param] !== undefined) {
                                moduleDatabase.data[param].setFormatAdd(insert[i][param]);
                            }
                        }
                    }
                }
                if (update !== undefined) {
                    for (var i = 0; i < update.length; i++) {
                        for (var param in update[i]) {
                            if (moduleDatabase.data[param] !== undefined) {
                                moduleDatabase.data[param].setFormatUpdate(update[i][param]);
                            }
                        }
                    }
                }
                if (deleteValue !== undefined) {
                    for (var i = 0; i < deleteValue.length; i++) {
                        for (var param in deleteValue[i]) {
                            if (moduleDatabase.data[param] !== undefined) {
                                moduleDatabase.data[param].setFormatDelete(deleteValue[i][param]);
                            }
                        }
                    }
                }
            }
            resolve(data);
        }).catch(function(err) {
            reject(err);
            console.error(err)
        })
    })
}

DataStructure.prototype.setFormatUpdate = function(data) {
    var self = this;
    var temp = self.Libary["id"][data.id];
    for (var param in data) {
        if (self.Libary[param] !== undefined && typeof self.Libary[param] != "function") {
            if (temp[param] == data[param])
                continue;
            self.Libary[param].deleteFunction(temp, param);
            temp[param] = data[param];
            self.Libary[param].formatFunction(temp, param);

        } else
            temp[param] = data[param];
    }
    for (var param in this.promisePart) {
        if (this.generalOperator(temp, JSON.parse(param)) === true) {
            if (this.promisePart[param].data.indexOf(temp) === -1) {
                this.promisePart[param].data.push(temp);
            }
        } else {
            var index = this.promisePart[param].data.indexOf(temp);
            if (index !== -1)
                this.promisePart[param].data.splice(index, 1);
        }
    }
}

DataStructure.prototype.setFormatDelete = function(data) {
    var self = this;
    if (data.id !== undefined) {
        var temp = self.Libary["id"][data.id];
        for (var param in self.Libary) {
            if (typeof self.Libary[param] != "function")
                self.Libary[param].deleteFunction(temp, param);
        }
        self.data.splice(self.data.indexOf(temp), 1);
        self.countRow--;
    }
}

DataStructure.prototype.delete = function(data) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.queryData(self.phpDeleter, data).then(function(value) {
            self.setFormatDelete(data);
            var update = value["update"];
            var insert = value["add"];
            var deleteValue = value["delete"];
            if (insert !== undefined) {
                for (var i = 0; i < value.add.length; i++) {
                    for (var param in insert[i]) {
                        if (moduleDatabase.data[param] !== undefined) {
                            moduleDatabase.data[param].setFormatAdd(insert[i][param]);
                        }
                    }
                }
            }
            if (update !== undefined) {
                for (var i = 0; i < update.length; i++) {
                    for (var param in update[i]) {
                        if (moduleDatabase.data[param] !== undefined) {
                            moduleDatabase.data[param].setFormatUpdate(update[i][param]);
                        }
                    }
                }
            }
            if (deleteValue !== undefined) {
                for (var i = 0; i < deleteValue.length; i++) {
                    for (var param in deleteValue[i]) {
                        if (moduleDatabase.data[param] !== undefined) {
                            moduleDatabase.data[param].setFormatDelete(deleteValue[i][param]);
                        }
                    }
                }
            }
            resolve();
        }).catch(function(err) {
            reject(err);
            console.error(err)
        })
    })
}

DataStructure.prototype.queryData = function(phpFile, data, name = "") {
    var self = this;
    var result = {};

    if (self.name !== undefined) {
        name = self.name;
    }
    if (this.hostDatabase !== undefined)
        phpFile = this.hostDatabase + phpFile;
    for (var param in data) {
        if (typeof data[param] == "function")
            continue;
        result[param] = data[param];
    }
    return new Promise(function(resolve, reject) {
        FormClass.api_call({
            url: phpFile,
            params: [{ name: "name", value: name },
                { name: "data", value: EncodingClass.string.fromVariable(result) }
            ],
            func: function(success, message) {
                if (success) {
                    if (message.substr(0, 2) == "ok") {
                        var st = EncodingClass.string.toVariable(message.substr(2));
                        resolve(st);
                    } else {
                        reject(message);
                    }
                }
            }
        });
    })
};

ModuleDatabase.prototype.queryData = DataStructure.prototype.queryData;

var moduleDatabase = new ModuleDatabase();
moduleDatabase.getModule("activehouses", ["loadActiveHouses.php", "addActiveHouse.php", "updateActiveHouse.php", "deleteActivehouse.php"]);
moduleDatabase.getModule("modification_requests", ["loadModificationRequests.php", "addModificationRequests.php", "updateModificationRequests.php", "deleteModificationRequests.php"])
moduleDatabase.getModule("inactivehouses", ["loadActiveHouses.php", "addActiveHouse.php", "updateActiveHouse.php", "deleteActivehouse.php"]);
moduleDatabase.getModule("contacts", ["load.php", "add.php", "update.php", "deleteContact.php"]);
moduleDatabase.getModule("users", ["load.php", "addUser.php", "updateUser.php", "deleteUser.php"]);
moduleDatabase.getModule("polygon", ["loadPolygon.php", "addPolygon.php", "updatePolygon.php", "deletePolygon.php"]);
moduleDatabase.getModule("geometry", ["loadMap.php", "addMap.php", "updateMap.php", "deleteMap.php"]);
moduleDatabase.getModule("geometry_created", ["loadCreatedMap.php"]);