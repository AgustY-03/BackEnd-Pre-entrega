import Express from "express";

// Router
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la pagina de Inicio!');
})

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

app.listen(8080, () => {
    console.log('Server ON');
})