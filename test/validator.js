class validator {
    suma(a,b){
        return a +b;
    }

    //Funciona para probar validacion de Email
    validarEmail(email){
        let re = /\S+@\S+\.\S+/;
        return re.test(email)
    }
}

module.exports = new validator();
