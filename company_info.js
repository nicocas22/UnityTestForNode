"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var encrypt = require("../commons/encrypt.js");
var decrypt = require("../commons/decrypt.js");
var responseToService = require("../connection/connection.js");
let Configuracion = require("../helper/configuracionHelper");
const configuraciones = Configuracion.getInstancia().configuraciones;
const { metodoObtenerDetalleComercio } = require("../metods/companyInfoMetod");

/**
 * Servicio RestFul para obtener datos de la empresa
 * @method companyInfoRoute
 */
function companyInfoRoute() {
  var companyInfo = new express.Router();
  companyInfo.use(cors());
  companyInfo.use(bodyParser());

  companyInfo.post("/obtenerDetalleComercio", function (req, res) {
    var params = req.body ? req.body : null;
    console.log(params);
    if (params == null) {
      res.json({ msg: "Error obtenerDetalleComercio" });
    }
    const rs = "razonSocial";
    console.log("llega aqui");
    const metodo = metodoObtenerDetalleComercio(params, res);
    console.log(metodo);
    metodoObtenerDetalleComercio(params, rs)
      .then((response) => {
        var commerceData = {
          statusMsg:
            response.obtenerDetalleComercioResponse.cuerpo
              .estadoRespuestaDetalle,
          commerce:
            response.obtenerDetalleComercioResponse.cuerpo.listaComercios
              .comercio,
        };
        res.json(commerceData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

  companyInfo.post("/obtenerCuentasPorLocal", function (req, res) {
    const params = req.body ? req.body : null;

    if (params == null) {
      res.json({ msg: "No Data obtenerCuentasPorLocal" });
    }

    const codigoLocal = params.codigoLocal;
    const estado = "01";

    const servicesGetAccountByStore = async () => {
      const data = {
        codigoLocal: codigoLocal,
        estado: estado,
      };

      const newData = await encrypt.encrypt(data, "legacy");

      const options = {
        method: configuraciones.metodoGET,
        url:
          configuraciones.urlTBKCOM +
          configuraciones.rutaObtenerCuentasPorLocal,
        qs: {
          idf: newData,
        },
        qsStringifyOptions: {
          encode: false,
        },
        headers: {
          "cache-control": configuraciones.cacheControl,
          "tbk-token-id": configuraciones.tbkTokenID,
          "tbk-token-alias": configuraciones.tbkTokenAlias,
          idTransaccionMDW:
            configuraciones.obtenerCuentasPorLocalIdTransaccionMDW,
          idTransaccionCanal:
            configuraciones.obtenerCuentasPorLocalIdTransaccionCanal,
          operacion: configuraciones.operacionObtenerCuentasPorLocal,
          servicio: configuraciones.servicioComercio,
          espacioNombre: configuraciones.espacioComercio,
          "content-type": configuraciones.contentType,
          accept: configuraciones.accepteTBK,
        },
        strictSSL: false,
      };
      console.log(options);

      const response = await responseToService.connection(options);
      // delete debugmock
      // let response = {
      //     body: mockResponseObtenerCuentasPorLocal
      // };
      console.log(JSON.stringify(response));
      try {
        return await decrypt.decrypt(response.body, "legacy");
      } catch (error) {
        throw response.body;
      }
    };

    servicesGetAccountByStore()
      .then((response) => {
        const accountData = {
          statusMsg:
            response.obtenerCuentasPorLocalResponse.cuerpo
              .estadoRespuestaDetalle,
          accounts:
            response.obtenerCuentasPorLocalResponse.cuerpo.listaCuenta.cuenta,
        };

        res.json(accountData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

  return companyInfo;
}

module.exports = companyInfoRoute;
