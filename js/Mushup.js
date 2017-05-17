var image = {
    url: "http://publitell.com/system/fotos/43501/8087.png",
    scaledSize: new google.maps.Size(50, 65) // scaled size
};

var mapa = new Mapa(document.getElementById('map'), 41.870800, -87.650500, image);

mapa.initMap();

$(document).ready(function(){
    
    $("#housesButton").click(function(){
        
        var itemsC = document.getElementById("C");
        var itemsH = document.getElementById("H");
       
        itemsC.style.display = "none";
        itemsH.style.display = "block";
        
        document.getElementById("housesButton").classList.add("active");
        document.getElementById("climateButton").classList.remove("active");
        
        console.log("click");
        if(!mapa.markersList["casasMList"]){
            console.log("lista de casas no existe");
            var casas = new PaqueteDatosA("https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD", new Array());

            casas.cargarDatos(function (output){

                //var casasMList = new Array();
                mapa.markersList["casasMList"] = new Array();
                var image = {
                    url: "img/home-4-32.png",
                    scaledSize: new google.maps.Size(30, 30)
                };
                var zillow = new PaqueteDatosA(null, null);
                var t=10;
                $.each(output.data, function(d){
                    var address = output.data[d][12];
                    var streetAddress = address.split(" ").join("+");
                    var zipCode = output.data[d][13];
                    var latitud = parseFloat(output.data[d][19]);
                    var longitud = parseFloat(output.data[d][20]);
                    
                    //---------------ZILLOW----------------------
                    var zestimate = "";
                    if(t>=0){//avoid Zillow limit
                        t--;
                        zillow.url = "https://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1fqhic9egp7_376md&address="+streetAddress+"&citystatezip="+zipCode+"&rentzestimates=true";
                        zillow.headers = new Array();

                        zillow.cargarDatos(function(xml){
                            if($(xml).find('message').find('code').text() == 0){

                                var results = xml.getElementsByTagName("zestimate");

                                for(i=0; i<results.length; i++){
                                    var res = results[i]["childNodes"];
                                    zestimate = zestimate + "\nZestimate: " + res[0]['textContent'] + " USD";
                                    console.log("z: " +zestimate);
                                } 
                            }
                            var marker = new Marcador(latitud, longitud, mapa.map, address, zestimate, image);
                            marker.initMarker();                 mapa.markersList["casasMList"].push(marker);
                            
                        });
                    }
                    //-------------------------------------------
                
                });
            });  
        }
        
    });
    
    var temperature;
    var precipitation;
    var snow;
    
    $("#climateButton").click(function(){

        var itemsC = document.getElementById("C");
        var itemsH = document.getElementById("H");
        
        itemsC.style.display = "block";
        itemsH.style.display = "none";
        document.getElementById("climateButton").classList.add("active");
        document.getElementById("housesButton").classList.remove("active");
        
            if(temperature == null){

                temperature = new Grafica();

                var TMAX = [];


                var TMIN = [];

                var tMaxC = new PaqueteDatosA("https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:USC00111577&units=standard&startdate=2016-01-01&enddate=2016-12-31&limit=300&datatypeid=TMAX&datatypeid=TMIN", {token: "lXzUrUdoBXZdmpTAfKbCatuEaqBxTtJe"});

                tMaxC.cargarDatos(function (output){
                    console.log(output.results);
                    
                    $.each(output.results, function(d){
                        var dat = output.results[d].date;
                        if(output.results[d].datatype == "TMAX"){


                               TMAX.push(parseInt(output.results[d].value));

                        }else{

                               TMIN.push(parseInt(output.results[d].value));                   
                        }
                    });

                    temperature.addfunction("TMAX", TMAX);
                    temperature.addfunction("TMIN", TMIN);
                    temperature.makeChart("#tempChart");


            });
        }
        
        if(precipitation == null){

                precipitation = new Grafica();

                var PRCP = [];

                var prcpData = new PaqueteDatosA("https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:USC00111577&units=standard&startdate=2016-01-01&enddate=2016-12-31&limit=300&datatypeid=PRCP", {token: "lXzUrUdoBXZdmpTAfKbCatuEaqBxTtJe"});

                prcpData.cargarDatos(function (output){
                    //console.log(output.results);
                    
                    $.each(output.results, function(d){
                        var dat = output.results[d].date;


                           PRCP.push(parseFloat(output.results[d].value));

                        
                    });
                    //console.log(PRCP);

                    precipitation.addfunction("PRCP", PRCP);
                    precipitation.makeChart("#prcpChart");


            });
        }
        
        if(snow == null){

                snow = new Grafica();

                var SNOWList = [];

                var snowData = new PaqueteDatosA("https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:USC00111577&units=standard&startdate=2016-01-01&enddate=2016-12-31&limit=300&datatypeid=SNOW", {token: "lXzUrUdoBXZdmpTAfKbCatuEaqBxTtJe"});

                snowData.cargarDatos(function (output){
                    //console.log(output.results);
                   
                    $.each(output.results, function(d){
                        var dat = output.results[d].date;


                           SNOWList.push(parseFloat(output.results[d].value));

                        
                    });


                    snow.addfunction("SNOW", SNOWList);
                    snow.makeChart("#snowChart");


            });
        }
    });               
});




function chicagoParks() {

    if(document.getElementById('parks').checked){
        document.getElementById("pmilesid").disabled = false;
        
        console.log("click");
        if(!mapa.markersList["parquesMList"]){
            console.log("parquesMList no existe");
            var parks = new PaqueteDatosA("https://data.cityofchicago.org/api/views/eix4-gf83/rows.json?accessType=DOWNLOAD", new Array());

            parks.cargarDatos(function (output){

                var parquesMList = new Array();
                var image = {
                    url: "https://cdn1.iconfinder.com/data/icons/map-objects/154/map-object-tree-park-forest-point-place-512.png",
                    scaledSize: new google.maps.Size(40, 40), // scaled size
                };

                $.each(output.data, function(d){
                    var name = output.data[d][10];
                    var latitud = parseFloat(output.data[d][15]);
                    var longitud = parseFloat(output.data[d][14]);

                    var marker = new Marcador(latitud, longitud, mapa.map, name, null, image);
                    marker.initMarker();
                    parquesMList.push(marker);
                });

                mapa.addMList("parquesMList", parquesMList);


            });
            
        }
        
    }else{
        document.getElementById("pmilesid").value = "";
        document.getElementById("pmilesid").disabled = true;
        mapa.removeMList("parquesMList");
    }
}


function chicagoBikeR() {

    if(document.getElementById('bikeR').checked){
        document.getElementById("bmilesid").disabled = false;
        
        console.log("click");
        if(!mapa.markersList["bikeRMList"]){
            console.log("bikeRMList no existe");
            var bikeRacks = new PaqueteDatosA("https://data.cityofchicago.org/api/views/cbyb-69xx/rows.json?accessType=DOWNLOAD", new Array());

            bikeRacks.cargarDatos(function (output){

                var bikeRMList = new Array();
                var image = {
                    url: "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/simple-red-square-icons-transport-travel/129983-simple-red-square-icon-transport-travel-transportation-bicycle9-sc43.png",
                    scaledSize: new google.maps.Size(35, 35) // scaled size
                };

                $.each(output.data, function(d){
                    var racksNum = parseInt(output.data[d][13]);
                    var latitud = parseFloat(output.data[d][14]);
                    var longitud = parseFloat(output.data[d][15]);

                    var marker = new Marcador(latitud, longitud, mapa.map, 'Bike racks: '+racksNum, null, image);
                    marker.initMarker();
                    bikeRMList.push(marker);
                });

                mapa.addMList("bikeRMList", bikeRMList);

            });        
        
        }
        
    }else{
        document.getElementById("bmilesid").value = "";
        document.getElementById("bmilesid").disabled = true;
        mapa.removeMList("bikeRMList");
    }
}

function chicagoPolice() {

    if(document.getElementById('police').checked){
        document.getElementById("polmilesid").disabled = false;
        
        console.log("click");
        if(!mapa.markersList["policeMList"]){
            console.log("policeMList no existe");
            var policeSt = new PaqueteDatosA("https://data.cityofchicago.org/api/views/z8bn-74gv/rows.json?accessType=DOWNLOAD", new Array());

            policeSt.cargarDatos(function (output){

                var policeMList = new Array();
                var image = {
                    url: "https://localsguide.com/wp-content/uploads/2014/07/police_station_blue_round.png",
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };

                $.each(output.data, function(d){
                    var address = output.data[d][10];
                    var latitud = parseFloat(output.data[d][20]);
                    var longitud = parseFloat(output.data[d][21]);

                    var marker = new Marcador(latitud, longitud, mapa.map, address, null, image);
                    marker.initMarker();
                    policeMList.push(marker);
                });

                mapa.addMList("policeMList", policeMList);

            });   
        }
    }else{
        document.getElementById("polmilesid").value = "";
        document.getElementById("polmilesid").disabled = true;
        mapa.removeMList("policeMList");
    }
}

function cmiles(value){
    if(event.keyCode == 13) {
        mapa.showMList("casasMList", value);     
    }
}

function pmiles(value){
    if(event.keyCode == 13) {
        mapa.showMList("parquesMList", value);
    }
}

function bmiles(value){
    if(event.keyCode == 13) {
        mapa.showMList("bikeRMList", value);  
    }
}

function polmiles(value){
    if(event.keyCode == 13) {
        mapa.showMList("policeMList", value);  
    }
}

