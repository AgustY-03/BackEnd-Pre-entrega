import { Router } from "express";
import fs from 'fs';

// Funciones
import { consultProducts, validateCode } from '../utils.js';

const router = Router();
const products = [];
const pathProducts = './src/files/productos.json';

router.get('/', async (req, res) => {

    if(fs.existsSync(pathProducts)){
        const productsList = await consultProducts(pathProducts);

        const limit = req.query.limit;
        if(limit){
            const productLimit = productsList.filter( (e) => e.id <= limit)
            res.send({productLimit});
            return;
        }
        res.send({productsList});
        return;
    }

    res.send({products});
});

router.get('/:pid', async (req, res) => {

    if(fs.existsSync(pathProducts)){
        const productsList = await consultProducts();

        const pid = +req.params.pid;
        let product = productsList.find( (e) => e.id === pid);

        if(!product){
            res.send({ error: 'El producto no fue encontrado'});
            return;
        }
        res.send({product});
        return;
    }

    res.send({products})
});

router.post('/', async (req, res) => {
    let productToAdd = req.body;

    if(!productToAdd.title || !productToAdd.description || !productToAdd.code || !productToAdd.price || !productToAdd.stock ||!productToAdd.category){
        res.send({error: 'Todos los campos son obligatorios'});
        return;
    }

    if(fs.existsSync(pathProducts)){
        const productFile = await consultProducts();

        const validatingCode = productFile.findIndex( (i) => i.code === productToAdd.code );
        if(validatingCode !== -1){
            res.send({ error: 'El codigo del producto ya existe'});
            return;
        }

        let idQuantity = 1;
        productFile.map( e => {
            idQuantity++;
        });

        const product = {
            id: idQuantity,
            title: productToAdd.title,
            description: productToAdd.description,
            code: productToAdd.code,
            price: productToAdd.price,
            status: true,
            stock: productToAdd.stock,
            category: productToAdd.category,
            thumbnails: productToAdd.thumbnails
        };

        productFile.push(product);

        await fs.promises.writeFile(pathProducts, JSON.stringify(productFile));
        res.send({ success: 'Producto creado correctamente' })
        return;
    }else{
        const product = {
            id: 1,
            title: productToAdd.title,
            description: productToAdd.description,
            code: productToAdd.code,
            price: productToAdd.price,
            status: true,
            stock: productToAdd.stock,
            category: productToAdd.category,
            thumbnails: productToAdd.thumbnails
        };
    
        products.push(product);
        await fs.promises.writeFile(pathProducts, JSON.stringify(products));
        res.send({ success: 'Producto agregado' })
    }
});

router.put('/:pid', async (req, res) => {
    let pid = +req.params.pid;
    let productToUpdate = req.body;
    const productFile = await consultProducts();

    const validatingCode = productFile.findIndex( (i) => i.code === productToUpdate.code );
    if(validatingCode !== -1){
        res.send({ error: 'El codigo del producto ya existe'});
        return;
    }

    const productIndex = productFile.findIndex((e) => e.id === pid);
    if (productIndex === -1) {
        res.send({ error: `ID ${pid} NOT FOUND`})
        return;
    }

    productFile[productIndex] = {
        ...productFile[productIndex],
        ...productToUpdate
    };

    await fs.promises.writeFile(pathProducts, JSON.stringify(productFile));
    res.send({ success: 'El producto fue actualizado' });

});

router.delete('/:pid', async (req, res) => {
    let pid = +req.params.pid
    const productFile = await consultProducts();

    const productIndex = productFile.findIndex((e) => e.id === pid);
    if (productIndex === -1) {
        res.send({ error: `ID ${pid} NOT FOUND`})
        return;
    }

    productFile.splice(productIndex, 1);
    productFile.map( (e) => {
        if(e.id > productIndex){
            e.id--;
        }
    });

    await fs.promises.writeFile(pathProducts, JSON.stringify(productFile));
    res.send({ success: 'El producto fue eliminado' });
});

export default router;
