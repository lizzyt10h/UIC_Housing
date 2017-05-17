class Mapa{
    constructor(div, lat, long, image){
        this.div = div;
        this.lat = lat;
        this.long = long;
        this.image = image;
        this.map = null;
        this.iMarker= null;
        this.markersList = new Array();
    }
    initMap(){
        this.map = new google.maps.Map(this.div, {
            center: {lat: this.lat, lng: this.long}, //This is UIC's Location
            zoom: 12});
        
        this.iMarker = new Marcador(this.lat, this.long, this.map, 'Department of Electrical & Computer Engineering', google.maps.Animation.DROP, this.image);
        
        this.iMarker.initMarker();
        this.iMarker.marker.setMap(this.map);
        
    }
    
    addMList(name, mList){
        this.markersList[name] = mList;
    }
    
    showMList(name, dist){
        for(var i=0; i<this.markersList[name].length; i++){
            this.markersList[name][i].removeMarker();
            if(this.markersList[name][i].distance <= dist){
                this.markersList[name][i].showMarker();
            }
        }
    }
    
    removeMList(name){
        for(var i=0; i<this.markersList[name].length; i++){
            this.markersList[name][i].removeMarker();

        }
    }
    
    

}
