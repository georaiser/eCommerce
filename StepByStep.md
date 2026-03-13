**setup**
- npm init -y
- npm install express
- npm install -D nodemon

**structure**

```
src/

- app.js

- routes/userRoutes.js
- controllers/userControllers.js





```


MVC -> controlador comunica entre ruta y base de datos
usuario desde ruta pide vista, controlador la busca en base datos y la devuelve al controlador
ruta-controlador-base datos-controlador-ruta

router.get('/users', (req, res) => {
    res.send('add user')});
---->  router.get('/users', HERE-CONTROLLER);

