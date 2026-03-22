**setup**
- npm init -y
- npm install express
- npm install -D nodemon


app.js -> routes -> controller -> model(db) -> view

MVC -> controlador comunica entre ruta y base de datos
usuario desde ruta pide vista, controlador la busca en base datos y la devuelve al controlador
ruta-controlador-base datos-controlador-ruta

router.get('/users', (req, res) => {
    res.send('add user')});
---->  router.get('/users', HERE-CONTROLLER);


mkdir routes models views controllers config public sql 
mkdir middleware services utils 


index, ruta, controlador, modelo, base datos, 

