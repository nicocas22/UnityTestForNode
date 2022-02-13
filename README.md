# UnityTestForNode
Estudios Para documentacion de UnityTest para NodeJS


#Mocha - Chai

Mocha: Es un framework de pruebas. Permite ejecutar las pruebas en Node y en el navegador. Permite la generación de reportes acerca del resultado de la ejecución.

Chai: Es una libreria que nos permite realizar aserciones con el fin de validar el resultado de nuestros tests. Ofrece diferentes formas de escribir las aserciones permitiendo que sean faciles de leer. Las formas son: expect,should y assert.

Instalación Mocha:

Podemos instalar mocha de forma global: npm i -g mocha.

o a nivel de proyecto: npm i mocha.

Instalación Chai:

npm i chai


Para importar su funcionalidad:
const assert = require('chai').assert; == enfocado mas en el estilo para Tdd.
const expect = require('chai').expect; == enfocado mas en el estilo para Bdd.
const should = require('chai').should(); == enfocado mas en el estilo para Bdd.
