class PaqueteDatosA{
    constructor(url, headers){
        this.url = url;
        this.headers = headers;
    }
    
    cargarDatos(handleData){
        $.ajax({
            type: "GET",
            url: this.url,
            headers: this.headers,           
            success: function(data) {
                handleData(data);
            }
        });
        
    }
}