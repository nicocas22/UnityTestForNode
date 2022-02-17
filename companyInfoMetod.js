"use strict";
const async = require("asyncawait/async");
var encrypt = require("../commons/encrypt.js");
var decrypt = require("../commons/decrypt.js");
let Configuracion = require("../helper/configuracionHelper");
var responseToService = require("../connection/connection.js");
const configuraciones = Configuracion.getInstancia().configuraciones;

const metodoObtenerDetalleComercio = async (params, razonSocial) => {
  console.log("llega aca");
  console.log(params);
  if (params == null) {
    res.json({ msg: "Error obtenerDetalleComercio" });
  }

  var rut = params.rut.toUpperCase();
  var dv = params.dv.toUpperCase();
  const rs = razonSocial;

  var data = {
    rut: rut,
    dv: dv,
    razonSocial: rs,
  };

  var newData = await encrypt.encrypt(data, "legacy");

  var options = {
    method: configuraciones.metodoGET,
    url: configuraciones.urlTBKCOM + configuraciones.rutaObtenerDetalleComercio,
    qs: {
      idf: newData,
    },
    qsStringifyOptions: {
      encode: false,
    },
    headers: {
      "Cache-Control": configuraciones.cacheControl,
      "tbk-token-id": configuraciones.tbkTokenID,
      "tbk-token-alias": configuraciones.tbkTokenAlias,
      idTransaccionMDW: configuraciones.obtenerDetalleComercioIdTransaccionMDW,
      idTransaccionCanal:
        configuraciones.obtenerDetalleComercioIdTransaccionCanal,
      operacion: configuraciones.operacionObtenerDetalleComercio,
      servicio: configuraciones.servicioComercio,
      espacioNombre: configuraciones.espacioComercio,
      "Content-Type": configuraciones.contentType,
      Accept: configuraciones.accepteTBK,
    },
    json: true,
    strictSSL: false,
  };

  var response = await responseToService.connection(options);
  console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  console.log(response);
  try {
    var body = await decrypt.decrypt(response.body, "legacy");
    console.log("bodyyyyyyyyyyyyyyyyy");
    console.log(body);
    return body;
  } catch (error) {
    console.log(
      "responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.....................bodyyyyyyyyyyyyyyyyy"
    );
    console.log(response.body);
    throw response.body;
  }
};

module.exports = {
  metodoObtenerDetalleComercio,
};
