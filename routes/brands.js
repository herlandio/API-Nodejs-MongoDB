var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Brand = require('../types/brandSchema');
const {success, fail} = require('../help/messages');

/**
 * Criação de marcas
 */
router.post('/create', function (req, res) {
    const { name } = req.body;
    const boxError = [];

    const brand = new Brand();
    brand._id = uuidv4();
    brand.name = name;

    brand.save(function (err) {
        if (err) {
            for(let field in err.errors) {
                boxError.push({field: err.errors[field].message});
            }

            /*
            * #swagger.responses[400]
            */
            fail(res, boxError, 400, 'bad request');
        } else {

            /*
            * #swagger.responses[201]
            */
            success(res, {
                name: name,
            }, 201, 'success', 'created');

        }
    });
});

/**
 * Edição de marcas
 */
router.put('/edit/:id', async function (req, res) {
    const { name } = req.body;
    const { id } = req.params;

    const UptBrand = await Brand.findById(id);
    UptBrand.name = name;
    await UptBrand.save().then(edited => {
        if (edited === UptBrand) {

            /*
            * #swagger.responses[200]
            */
            success(res, {
                name: name,
            }, 200, 'success', 'updated');
        }
    });
});

/**
 * Remoção de marcas
 */
router.delete('/delete/:id', function (req, res) {
    const { id } = req.params;

    Brand.findByIdAndDelete(id, function () {
        
        /*
        * #swagger.responses[200]
        */
        success(res, '', 200, 'success', 'deleted');
    });
});

/**
 * Listagem de marcas
 */
router.get('/list', async function(req, res) {
    
    /*
    * #swagger.responses[200]
    */
    success(res, await Brand.find(), 200, 'success', 'listed');
});

/**
 * Busca de marcas
 */
router.get('/list/:search', async function(req, res) {
    const { search } = req.params;

    let searchByText = { $text: { $search: search } };

    /*
    * #swagger.responses[200]
    */
    success(res, await Brand.find(searchByText), 200, 'success', 'listed');
});

module.exports = router;
