# DEVBOX-ROUTER

Controlador de rotas NodeJs

  - Criar rotas para aplicação
  - Expor rotas no controller para faciltar manutençao

# Instalação

```sh
$ npm devbox-router --save
```

# Configuração

#### Middleware
```javascript
const router = require('devbox-router');
router.init(app, {
    prefix: '/api', // Prefixo utilizado em todas rotas
    folder: 'src/core', //Pasta onde ficaram os controller
    filename: 'controller.js', // encontra todos arquivos dentro de folder que termina com controller.js
    actionFilter: (action, options) => { 
        // Ja vem como default
        // Sobrepor caso faça validações antes de chamar controller
        // Middleware reponsavel por receber todas requisições 
        // e chamar o controller.
        return async (req, res, next) => {
                try {
                    await action(req, res, next);
                } catch (error) {
                    console.log('Erro: ', ex.message);
                    res.status(500).json({ message: ex.message});
                }
                next();
            }
    }
});
```
#### Controllers
```javascript
const router = require('devbox-router');

// Cria instancia de rota para este controller
// Define base da rota
// Ex: http://localhost:3000/api/usuario
const $router = router.controller('usuario', {
    /* Opções para todas rotas definadas no controller */
});
//OU
//Usa o nome do arquivo.js para as rotas
const $router = router.controller(__filename);
//__________________

// POST - /api/usuario
$router.post(async (req, res) => {
    //Codigo
    res.status(200).end();
});

// GET - /api/usuario/:id
$router.get(':id', async (req, res) => {
    //Codigo
    res.status(200).end();
});

// PUT - /api/usuario/:id
$router.put(':id', async (req, res) => {
    //Codigo
    res.status(200).end();
});

// DELETE - /api/usuario/:id
$router.delete(':id', async (req, res) => {
    //Codigo
    res.status(200).end();
});

// GET - /api/semprefixo/:id
$router.get('semprefixo/:id', false, async (req, res) => {
    //Codigo
    res.status(200).end();
});

// Passar objeto para 'actionFilter'
// GET - /api/usuario/:id/telefones
$router.get('usuario/:id/telefones', { public: true }, async (req, res) => {
    //Codigo
    res.status(200).end();
});
```