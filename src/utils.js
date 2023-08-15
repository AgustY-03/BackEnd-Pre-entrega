import fs from 'fs';

const pathProducts = './src/files/productos.json'
const pathCart = './src/files/carrito.json'

const consultProducts = async () => {

    if(fs.existsSync(pathProducts)){

        const data =  await fs.promises.readFile(pathProducts, 'utf-8');
        const products = JSON.parse(data);
        return products;

    }
    
}

const validateCode = async (code) => {

    if(fs.existsSync(pathProducts)){
        console.log(code);
        const data = await consultProducts()
        const validatingCode = data.findIndex( (i) => i.code === code );
        return validatingCode;
    }
    
    return 1;
}

const consultCart = async () => {

    if(fs.existsSync(pathCart)){

        const data =  await fs.promises.readFile(pathCart, 'utf-8');
        const products = JSON.parse(data);
        return products;

    }
    
}

export { consultProducts, validateCode, consultCart };

