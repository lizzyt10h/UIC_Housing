class Marcador{
    constructor(lat, long, map, title, animation, image){
        this.lat = lat;
        this.long = long;
        this.map = map;
        this.title = title;
        this.animation = animation;
        this.image = image;
        this.marker = null;
        this.distance = null;
    }
    
    initMarker(){
        this.marker = new google.maps.Marker({ 
            position: {lat: this.lat, lng: this.long},
            title: this.title,
            animation: this.animation,
            icon: this.image
        });
        this.distanceFromUIC();
    }
    
    showMarker(){
        this.marker.setMap(this.map);
    }
    
    removeMarker(){
        this.marker.setMap(null);
    }
    
    distanceFromUIC() {
        var lat1 = 41.870800;
        var lon1 = -87.650500;
        var lat2 = this.lat;
        var lon2 = this.long;
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        //if (unit=="K") { dist = dist * 1.609344 }
        //if (unit=="N") { dist = dist * 0.8684 }
        this.distance = dist;
    }
}

