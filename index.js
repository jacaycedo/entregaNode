const axios = require('axios').default
const fs = require('fs')
var http = require('http');

http.createServer(function (req, res) {

    function modTabla(json, cliente)
    {
        fs.readFile("./index.html", 'utf8', (err,data) =>
        {
            var inicioCabezaTabla = data.substring(0,data.indexOf('<tr>') +'<tr>'.length )
            var idsTabla = "<th>ID</th> <th>Nombre</th> <th>Contacto</th>"
            var cabezaConte = data.substring(data.indexOf('</tr>') -'</tr>'.length, data.indexOf("<tbody>") + "<tbody>".length)

            var contenidoTabla = ""
            for (let i in json)
            {
                var id = cliente? 'idCliente' : 'idproveedor'
                var compa = cliente? 'NombreCompania' : 'nombrecompania'
                var nombre = cliente? 'NombreContacto' : 'nombrecontacto'
                var temp=  "<tr> " + "<td>"  + json[i][id] + "</td>"  + "<td>"  + json[i][compa] + "</td>" + "<td>"  + json[i][nombre] + "</td>"  + "</tr> \n" 
                contenidoTabla += temp
                
            } 
            var finDoc = data.substring(data.indexOf('</tbody>'))

            var y = inicioCabezaTabla.concat(idsTabla).concat(cabezaConte).concat(contenidoTabla).concat(finDoc)
        
            fs.writeFile("./index.html", y, (err) =>
            {
                if(err)
                    console.warn(err)
                else
                {
                    console.log("File written successfully\n"); 
                    fs.readFile(__dirname + '/index.html', (err,data) =>
                    {
                        res.writeHead(200, {'Content-Type':'text/html'});
                        res.write(data);
                        res.end();
                    });
                }
            } ); 
                    
        })        
    }
    var path = req.url;

    var fsCallback = function(error, data) 
    {
        if(error) throw error;
        res.writeHead(200);
        res.write("Ingresa URL VALIDA");
        res.end();
    }

    switch(path) {
        case '/api/proveedores':
            axios.get("https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json")
            .then((resp) => 
            {
                modTabla(resp.data, false)      
            }, (error) => {
                console.log(error);
              });
        break;
        case '/api/clientes':
            axios.get("https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json")
            .then((resp) => 
            {
                modTabla(resp.data, true)            
            }, (error) => {
                console.log(error);
              });
        break;
        default:
            doc = fs.readFile(__dirname + '/index.html', fsCallback);
        break;
    }

}).listen(8081); 