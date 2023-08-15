import { Router } from "express";
import { consultProducts, consultCart } from "../utils.js";
import fs from 'fs';


const router = Router();

const cart = []
const pathCart = './src/files/carrito.json';
const pathProduct = './src/files/productos.json';

router.post('/', async (req, res) => {
    if(fs.existsSync(pathProduct)){
        const productFile = await consultProducts();
        let productId = req.body;
        let idQuantity = 1;

        const productIndex = productFile.findIndex((e) => e.id === productId.id);
        if(productIndex === -1){
            res.send({ error: 'El producto buscado no existe' });
            return;
        };

        if(fs.existsSync(pathCart)){
            const cartList = await consultCart();
            cartList.map( e => {
                idQuantity++;
            });

            const productCart = {
                id: idQuantity,
                products: [
                    {
                        id: productIndex + 1,
                        quantity: 1
                    }
                ]
            }

            cartList.push(productCart);
            await fs.promises.writeFile(pathCart, JSON.stringify(cartList));
            res.send({ success: 'El producto se añadio al carrito correctamente' });
            return;
        };

        const productCart = {
            id: idQuantity,
            products: [
                {
                    id: productIndex + 1,
                    quantity: 1
                }
            ]
        };
        
        cart.push(productCart);
        await fs.promises.writeFile(pathCart, JSON.stringify(cart));
        res.send({ success: 'El producto se añadio al carrito correctamente' });
        return;
    }
    res.send({ error: 'No hay productos para agregar al carrito todavia' });
});

router.get('/:cid', async (req, res) => {
    if(fs.existsSync(pathCart)){
        const cid = +req.params.cid;
        const cartList = await consultCart();
        const cartChoosen = cartList.find( (e) => e.id === cid);
        res.send({ cartChoosen });
        return;
    }
    res.send({cart});
    return;
});

router.post('/:cid/product/:pid', async (req, res) => {
    if(fs.existsSync(pathCart)){
        const cid = +req.params.cid;
        const pid = +req.params.pid;
        const cartToUpdate = await consultCart();

        const cartChoosen = cartToUpdate.find( (e) => e.id === cid);
        const cartProducts = cartChoosen.products;
        const productIndex = cartProducts.findIndex( (e) => e.id === pid );
        if(productIndex === -1){
            const product = {
                id: pid,
                quantity: 1
            }

            cartProducts.push(product);
        }else{
            cartProducts[productIndex] = {
                ...cartProducts[productIndex],
                quantity: cartProducts[productIndex].quantity + 1
            }
        }

        await fs.promises.writeFile(pathCart, JSON.stringify(cartToUpdate));
        res.send({ success: 'El producto fue añadido correctamente' });
        return;
    }
    res.send({ cart });
    return;
});

export default router;