import translator from 'translate-js'
var translators = new translator(dict);
let result = translators.translate("greeting", { lang: "ar" });
console.log(result)