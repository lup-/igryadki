module.exports = {
    "pages": {
        "calc": {
            "entry": "src/calc.js",
            "template": "templates/calc.html",
            "filename": "calc.html",
            "title": "Калькулятор АЙГРЯДКИ!"
        },
        "calc.liquid": {
            "entry": "src/calc.js",
            "template": "templates/page.calc.liquid",
            "filename": "page.calc.liquid",
            "title": "Калькулятор АЙГРЯДКИ!"
        },
    },
    "configureWebpack": {
        "devtool": 'eval-source-map',
        "optimization": {
            "splitChunks": false
        }
    }
}