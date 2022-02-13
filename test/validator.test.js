const {it, describe} = require("mocha")
const expect = require('chai').expect;
let archivoValidador = require('./validator.js')

describe("Prueba de Suma", () => {
    it("El restulado de la suma debe de ser => 6", () => {
        const result = archivoValidador.suma(3, 3);
        expect(result).to.be.equal(6)
    }) 
})

describe("Prueba 2 validacion Email", () => {
    it("Probando Validacion Email " ,() => {
        const result = archivoValidador.validarEmail("nicogym17+sgmail.com");
        expect(result).to.be.equal(true)
    })
})