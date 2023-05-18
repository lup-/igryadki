<template>
    <b-container class="p-2">
        <b-row class="calc-header m-0 mb-4 p-2" no-gutters>
            <b-col cols="12" sm="6">
                <label>Артикул: <span class="sku">{{printSku || '-'}}</span></label><br>
                <label>Вес: <span class="sku">{{printWeight || '-'}}</span></label>
            </b-col>
            <b-col cols="12" sm="6" class="text-sm-right sticky-price">
                <h4>
                    Цена:
                    <span class="calc-price">{{printPrice || '-'}}</span>
                    <span>&#8381;</span>
                </h4>
            </b-col>
        </b-row>

        <b-tabs pills fill v-model="tabIndex">
            <b-tab v-for="(type, index) in types" :key="type.code"
                    :title-item-class="index === types.length - 1 ? 'mb-4' : 'mr-2 mb-4'"
                    :title="type.title"
            >
                <order-form
                        :fields="formFields(type.code)"
                        :form-type="type.code"
                        :is-loading="isLoading"
                        :loading-message="loadingMessage"
                        :cart-available="canAddToCart"
                        :sku-constructed="Boolean(printSku)"
                        :price-found="Boolean(printPrice)"
                        v-model="orderData[type.code]"
                        @cart="addToCart"
                        @customCart="addCustomTeplicaToCart"
                ></order-form>
            </b-tab>
        </b-tabs>

        <b-row class="px-2 pt-4" v-if="error">
            <b-col cols="12">
                <b-alert variant="danger" dismissible show @dismissed="error = false">{{error}}</b-alert>
            </b-col>
        </b-row>

        <b-row class="px-2">
            <b-col cols="12" class="p-0">
                <b-button href="/cart_items" variant="primary" size="lg" block>Оформить заказ</b-button>
            </b-col>
        </b-row>

        <b-row class="mt-4">
            <b-col cols="12">
                <b-button variant="link" block href="/collection/all">Если не получается выбрать, поищите в каталоге</b-button>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import axios from 'axios';

    import OrderForm from "./components/OrderForm";
    import formFields from "./fields";
    import colors from "./colors";

    function clone(obj) {
        return JSON.parse( JSON.stringify(obj) );
    }

    function cartApiEmulator(apiHost) {
        return {
            add({items, comments}) {
                let cartUrl = `${apiHost}/front_api/cart.json`;
                let cartData = new FormData();
                cartData.append('lang', '');
                cartData.append('_method', 'patch');

                for (const variantId in items) {
                    const variantCount = items[variantId];
                    const comment = comments && comments[variantId] ? comments[variantId] : false;

                    cartData.append(`variant_ids[${variantId}]`, variantCount);
                    if (comment) {
                        cartData.append(`order_line_comments[${variantId}]`, comment);
                    }
                }

                return axios.post(cartUrl, cartData);
            }
        }
    }

    export default {
        name: 'Calc',
        data() {
            return {
                tabIndex: 0,
                error: false,
                isLoading: false,
                loadingMessage: false,
                dpkVariants: [],
                types: [
                    {code: 'gryadka', title: 'Грядка'},
                    {code: 'klumba', title: 'Клумба'},
                    {code: 'teplica', title: 'В теплицу'},
                    //{code: 'dpk', title: 'Грядки из ДПК'},
                    //{code: 'board', title: 'Доска из ДПК'}
                ],
                rawFormFields: formFields,
                orderData: {
                    gryadka: {},
                    klumba: {},
                    teplica: {},
                    dpk: {},
                    //board: {},
                },
                allProducts: [],
                apiAuth: {
                    //username: '9743441fcdaa238439536e2f4c9ea9ba',
                    //password: 'eca58da341ccff33149e9add13e6161c'
                    username: 'igryadki@gmail.com',
                    password: 'HCZwa3al22023'
                },
                bortCount: 6,
            }
        },
        components: {
            OrderForm
        },
        created() {
            this.loadProducts();
        },
        errorCaptured(err) {
            this.error = err;
            console.error(err);
            return false;
        },
        methods: {
            addToCart() {
                let variant = this.getProductVariant(this.sku);
                let quantity = this.formData.quantity;
                let cartApi = window.Cart || cartApiEmulator(this.apiHostName);

                if (variant && quantity && cartApi) {
                    let items = {};
                    items[variant.id] = quantity;
                    cartApi.add({
                        items: items
                    });
                }
            },
            async addCustomTeplicaToCart(gryadkiSizes, supportCount, teplSizes, fields, teplicaDetails, svgImage) {
                this.isLoading = true;
                this.loadingMessage = 'Идет расчет и добавление в корзину...';
                let pngImageDataUrl = await this.svgToPngDataUrl(svgImage);
                let pngImage = pngImageDataUrl.replace('data:image/png;base64,', '');

                let sku = this.getCustomSku(fields);
                let filename = `${sku}-${(new Date).getTime()}.png`;
                let file = await this.uploadImage(filename, pngImage);
                let imageUrl = file['absolute_url'];

                let variant = await this.addNewTeplicaVariant(gryadkiSizes, supportCount, teplSizes, fields, imageUrl);
                await this.loadProducts(true);

                let cartApi = window.Cart || cartApiEmulator(this.apiHostName);
                if (variant && fields.quantity && cartApi) {
                    let items = {};
                    items[variant.id] = fields.quantity;

                    let comments = {};
                    comments[variant.id] = teplicaDetails + `\nСхема:\n${imageUrl}`;

                    console.log(comments);

                    cartApi.add({
                        items,
                        comments,
                    });
                }

                this.loadingMessage = false;
                this.isLoading = false;
            },
            getOptionValues(gryadkiSizes, supportCount, teplSizes, fields, imageUrl) {
                return [
                    {"option_name_id": 1521697, "value": fields.bort.toString()}, //Высота
                    {"option_name_id": 1521705, "value": fields.teplica}, //Размер теплицы
                    {"option_name_id": 1522016, "value": this.getColorTitle(fields.color)}, //Цвет
                    {"option_name_id": 1966495, "value": this.getTeplParams(gryadkiSizes, supportCount, teplSizes)}, //Параметры теплицы
                    {"option_name_id": 1974516, "value": imageUrl }, //Ссылка
                    {"option_name_id": 1535115, "value": fields.type === 'hard' ? "усиленный" : "стандартный"}, //Усиленные
                ];
            },
            getColorTitle(value) {
                if (!value) {
                    return 'Цинк';
                }

                let color = colors.find( color => color.code === value );
                return color ? color.title : 'Цинк';
            },
            sizeLabel(size) {
                return Math.floor(size);
            },
            getTeplParams(gryadkiSizes, supportCount, teplSizes) {
                let sizeStrings = gryadkiSizes.map((size, index) => {
                    let sizeString = `${this.sizeLabel(size.widthCm)}x${this.sizeLabel(size.lengthCm)}`;
                    if (index < 3) {
                        sizeString += `-${supportCount[index]}`;
                    }

                    return sizeString;
                });

                return `${teplSizes[0]}x${teplSizes[1]}|${sizeStrings.join('|')}`;
            },
            getTeplicaSizes(fields) {
                let [wT, hT] = fields.teplica.split('x');
                return {
                    width: parseInt(wT) * 100,
                    height: parseInt(hT) * 100,
                }
            },
            getCustomSku(fields) {
                if (!fields.teplica || !fields.form || !fields.bort) {
                    return false;
                }

                let skuBases = {
                    'П': '550000',
                    'Ш': '560000',
                    'II': '570000',
                    'IiI': '580000',
                }

                let {width, height} = this.getTeplicaSizes(fields);
                let skuBase = skuBases[ fields.form ];
                return `${skuBase}-${fields.bort}${width}${height}`;
            },
            getCustomPrice() {
                return Math.round(this.price * 1.3);
            },
            async getCostPrice() {
                let shortVariant = this.getProductVariant(this.sku);
                let getFullVariantUrl = `${this.apiHostName}/admin/products/${shortVariant.product_id}/variants.json`;
                let response = await axios.get(getFullVariantUrl, {auth: this.apiAuth});
                let variants = response.data;
                let fullVariant = variants.find( currentVariant => currentVariant.id === shortVariant.id );
                return fullVariant && fullVariant.cost_price ? fullVariant.cost_price : false;
            },
            svgToPngDataUrl(svgImage) {
                return new Promise(resolve => {
                    let canvas = document.createElement("canvas");
                    canvas.width = svgImage.width;
                    canvas.height = svgImage.height;

                    let ctx = canvas.getContext("2d");
                    let DOMURL = self.URL || self.webkitURL || self;
                    let img = new Image();
                    let svg = new Blob([svgImage.content], {type: "image/svg+xml;charset=utf-8"});
                    let url = DOMURL.createObjectURL(svg);
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                        let png = canvas.toDataURL("image/png");
                        DOMURL.revokeObjectURL(url);
                        resolve(png);
                    };
                    img.src = url;
                });
            },
            async uploadImage(name, base64Content) {
                let addFileUrl = `${this.apiHostName}/admin/files.json`;
                let data = {
                    file: {
                        filename: name,
                        attachment: base64Content
                    }
                }

                let response = await axios.post(addFileUrl, data, {auth: this.apiAuth});

                let newFile = response.data;
                return newFile;
            },
            async addNewTeplicaVariant(gryadkiSizes, supportCount, teplSizes, fields, imageUrl) {
                let productIds = {
                    'П': 201222310,
                    'Ш': 201223080,
                    'II': 201221504,
                    'IiI': 201220779,
                }

                let customProductId = productIds[ fields.form ];

                let addVariantUrl = `${this.apiHostName}/admin/products/${customProductId}/variants.json`;
                let options = this.getOptionValues(gryadkiSizes, supportCount, teplSizes, fields, imageUrl);
                let optionsForTitle = options.filter( option => option['option_name_id'] !== 1974516);
                let optionValues = optionsForTitle.map( option => option.value );
                let variantTitle = optionValues.join(' / ');

                let productVariant = {
                    "title": variantTitle,
                    "product_id": customProductId,
                    "sku": this.getCustomSku(fields),
                    "price": this.getCustomPrice(teplSizes, supportCount, fields),
                    "cost_price": await this.getCostPrice(),
                    "quantity": fields.quantity,
                    options
                }

                let response = await axios.post(addVariantUrl, {variant: productVariant}, {auth: this.apiAuth});

                return response.data;
            },

            async loadProducts(skipLoadingStatus) {
                this.isLoading = skipLoadingStatus ? this.isLoading : true;
                this.loadingMessage = skipLoadingStatus ? this.loadingMessage : 'Идет загрузка данных...';

                let loadNextPage = false;
                let pageNum = 1;
                let allProducts = [];
                let pageSize = 100;
                do {
                    let response = await axios.get(`${this.apiHostName}/collection/all.json?page=${pageNum}&page_size=${pageSize}`);
                    let loadedCount = response.data.products && response.data.products.length;
                    loadNextPage = loadedCount > 0;
                    if (loadedCount < pageSize) {
                        loadNextPage = false;
                    }
                    pageNum++;
                    allProducts = allProducts.concat(response.data.products);
                } while (loadNextPage)


                this.allProducts = allProducts;
                this.loadingMessage = skipLoadingStatus ? this.loadingMessage : false;
                this.isLoading = skipLoadingStatus ? this.isLoading : false;
            },

            getProductIdBySKU(sku) {
                return typeof(this.skuIndex[sku]) != 'undefined' && sku ? this.skuIndex[sku] : false;
            },

            getProductById(productId) {
                if (!productId) {
                    return false;
                }

                return this.allProducts.find(product => product.id === productId);
            },

            getProductVariant(sku) {
                let productId = this.getProductIdBySKU(sku);
                let product = this.getProductById(productId);
                if (!product) {
                    return false;
                }

                return product.variants.reduce(function (foundVariant, currentVariant) {
                    if (currentVariant.sku == sku) {
                        foundVariant = currentVariant;
                        foundVariant.product = product;
                    }

                    return foundVariant;
                }, false);
            },

            getColorNumberFromCode(code) {
                if (!code) {
                    return 0;
                }

                return parseInt(code.replace(/[a-z\- ]+/i,''));
            },

            getColorIdFromCode(code) {
                if (!code) {
                    return '000';
                }

                let color = colors.find( color => color.code === code );
                if (!color) {
                    return '000';
                }

                return color.id;
            },

            getVariantPropMultipliedByQuality(propName) {
                let isProductsLoaded = this.allProducts.length > 0;
                if (!isProductsLoaded) {
                    return false;
                }

                let variant = this.getProductVariant(this.sku);
                let quantity = this.formData['quantity'];

                return variant ? variant[propName] * quantity: false;
            },

            getDpkLengthCount() {
                if (this.formData.what !== 'dpk') {
                    return {count: false, length: false};
                }

                if (!this.formData.bortVariants) {
                    let dpkVariants = this.getDpkVariants();
                    if (dpkVariants && dpkVariants.length === 1) {
                        let variant = dpkVariants[0];
                        return variant.parsed;
                    }

                    return false;
                }

                return  {
                    count: this.formData.bortVariants.count,
                    length: this.formData.bortVariants.length
                }
            },

            getDpkSkuMask() {
                if (!this.formData) {
                    return false;
                }

                if (this.formData.what !== 'dpk') {
                    return false;
                }

                const DPK_COLOR = '9017';

                let {width, height, finishing, joints} = this.formData;
                let allParamsSet = width && height && finishing && joints;
                if (!allParamsSet) {
                    return false;
                }

                width = width < 100 ? '0'+width : width.toString();
                height = Math.floor(height);
                finishing = finishing === 'gloss' ? 'G' : 'W';
                joints = joints === 'metal' ? 'M' : 'P';
                let color = DPK_COLOR.replace('0', '');

                return `GK${height}${width}-:count::length:-${color}-${finishing}${joints}3`;
            },

            getDpkVariants() {
                //const LENGTH_PROPERTY_ID = 28384430;
                let skuMask = this.getDpkSkuMask();
                if (!skuMask) {
                    return [];
                }

                let skuRegex = new RegExp( skuMask.replace(':count::length:', '(\\d{2})(\\d+)'), 'i' );
                let targetLength = this.formData.length * 100;

                return this.allProducts.reduce( (variants, product) => {
                    let matchingVariants = product.variants
                        .filter(variant => skuRegex.test(variant.sku))
                        .map(variant => {
                            let [, count, length] = variant.sku.match(skuRegex);
                            let bortLength = Math.round( count * length / 2 );

                            variant.parsed = {count: parseInt(count), length, bortLength};
                            return variant;
                        })
                        .filter(variant => variant.parsed.bortLength === targetLength);

                    if (matchingVariants && matchingVariants.length > 0) {
                        variants = variants.concat(matchingVariants);
                    }

                    return variants;
                }, []);
            },
            formFields(typeCode) {
                if (!typeCode) {
                    return [];
                }

                if (typeCode === 'dpk') {
                    let dpkFields = clone(this.rawFormFields[typeCode]);
                    let dpkVariants = this.getDpkVariants();

                    let countFieldIndex = dpkFields.findIndex(field => field.code === 'bortVariants');
                    if (countFieldIndex !== -1) {
                        if (dpkVariants && dpkVariants.length > 1) {
                            dpkFields[countFieldIndex].values = dpkVariants.map(variant => ({value: variant.parsed, title: `${Math.round(variant.parsed.count / 2)}x${variant.parsed.length}`}));
                        }
                        else {
                            dpkFields.splice(countFieldIndex, 1);
                        }
                    }

                    return dpkFields;
                }

                return this.rawFormFields[typeCode];
            },
        },
        computed: {
            canAddToCart() {
                let variant = this.getProductVariant(this.sku);
                return Boolean(variant) && variant.available && variant.quantity !== 0;
            },
            formData() {
                return this.orderData[this.tabCode];
            },
            apiHostName() {
                let isDev = location.hostname === 'localhost';
                let isProd = location.hostname === 'igryadki.ru';
                let isStaging = !isDev && !isProd;

                if (isDev) {
                    return 'http://igryadki.humanistic.tech';
                }

                if (isStaging) {
                    return 'http://igryadki.humanistic.tech'
                }

                return 'https://igryadki.ru';
            },
            skuIndex() {
                return this.allProducts.reduce(function (skus, product) {
                    product.variants.map(function (variant) {
                        if (variant.sku) {
                            let sku = variant.sku
                                .replace('К', 'K') //рус/анг
                                .replace('М', 'M')
                                .replace('О', 'O')
                                .replace('Е', 'E')
                                .replace('Р', 'P')
                                .replace('С', 'C');

                            skus[sku] = product.id;
                        }
                    });

                    return skus;
                }, {});
            },
            skuBase() {
                let formData = this.formData;

                let baseSKUs = {
                    'gryadka': 10000,
                    'gryadkaHard': 20000,
                    'klumba': 300000,
                    'klumbaSquare': 400000,
                    'teplica': 500000
                };

                let teplicaCoeffs = {
                    'П': 10000,
                    'Ш': 20000,
                    'II': 30000,
                    'IiI': 40000
                }

                let whatForSKU = formData['what'];

                if (whatForSKU === 'gryadka' && formData['type'] === 'hard') {
                    whatForSKU = 'gryadkaHard';
                }

                if (whatForSKU === 'klumba' && formData['form'] === 'square') {
                    whatForSKU = 'klumbaSquare';
                }

                if (whatForSKU === 'klumba' && formData['legs'] === 1) {
                    let length = Math.round(formData['diameter'] / 2);
                    if (!length) {
                        return false;
                    }

                    if (!formData['bort']) {
                        return false;
                    }

                    if (formData['levels'] === 1) {
                        length = length < 100 ? '0' + length : length.toString();
                        return 'KM'+formData['bort']+length; //KM -- англ
                    }

                    if (formData['levels'] === 3) {
                        let bortCount = this.bortCount;
                        bortCount = bortCount < 10 ? '0' + bortCount : bortCount.toString();
                        return 'KM'+formData['levels']+bortCount+formData['bort'];
                    }

                    return false;
                }

                let sku = baseSKUs[whatForSKU];
                let colorNum = this.getColorNumberFromCode(formData['color']);
                let levelsCoeff = 0;

                switch (formData['what']) {
                    case 'gryadka':
                        sku += colorNum;
                        break;
                    case 'klumba':
                        levelsCoeff = formData['levels'] ? parseInt(formData['levels']) : 0;
                        sku += levelsCoeff * 10000;
                        sku += colorNum;
                        break;
                    case 'teplica':
                        sku = formData['form'] ? sku + teplicaCoeffs[ formData['form'] ] : false;
                        sku = sku ? sku + colorNum : false;
                        break;
                }

                return sku;
            },
            skuExtend() {
                let extend = false;
                let formData = this.formData;

                switch(formData['what']) {
                    case 'gryadka':
                        if (formData['bort'] && formData['width'] && formData['length']) {
                            extend = '' + formData['bort'] + formData['width'] + formData['length'];
                        }
                        break;
                    case 'klumba':
                        if (formData['legs'] === 1 && formData['form'] !== 'square') {
                            let length = Math.round(formData['diameter'] / 2);
                            let bortCount = this.bortCount;
                            let colorNum = this.getColorIdFromCode(formData['color']);
                            if (formData['levels'] > 1) {
                                let klumbaFields = this.formFields('klumba');
                                let diameterField = klumbaFields.find(field => field.code === 'diameter');
                                let diameterVariants = diameterField.values.filter(value => value.levels === formData['levels']);
                                let selectedValue = diameterVariants.find(variant => variant.value === formData['diameter']);
                                if (!selectedValue) {
                                    return false;
                                }

                                let levelDiameters = selectedValue.title.replace(' см', '').split('-');

                                let levelsSku = [];
                                for (let levelDiameter of levelDiameters) {
                                    levelDiameter = parseInt(levelDiameter);
                                    let diameterSku = levelDiameter < 100 ? '0' + levelDiameter : levelDiameter.toString();
                                    levelDiameter -= 60;
                                    levelsSku.push(diameterSku);
                                }

                                levelsSku.push(colorNum);
                                return levelsSku.join('-');
                            }
                            else {
                                if (length) {
                                    length = length < 100 ? '0' + length : length.toString();
                                    bortCount = bortCount < 10 ? '0' + bortCount : bortCount.toString();
                                    extend = bortCount + length + '-' + colorNum + '-N';
                                }
                            }
                        }
                        else if (formData['bort'] && formData['diameter']) {
                            extend = '' + formData['bort'] + formData['diameter'];
                        }
                        break;
                    case 'teplica':
                        if (formData['bort'] && formData['teplica']) {
                            let tepliceCode = formData['teplica'].replace("x", "");
                            extend = '' + formData['bort'] + tepliceCode;
                            if (formData['type'] === 'hard') {
                                extend += 'У';
                            }
                        }
                        break;
                }

                return extend;
            },
            dpkSku() {
                let {count, length} = this.getDpkLengthCount();
                if (!count) {
                    return false;
                }

                count = '0' + count;
                length = length < 100 ? '0'+length : length.toString();

                let sku = this.getDpkSkuMask();
                sku = sku.replace(':count:', count);
                sku = sku.replace(':length:', length);

                return sku;
            },
            sku() {
                if (this.formData.what === 'dpk') {
                    return this.dpkSku;
                }

                if (this.skuBase && this.skuExtend) {
                    return  `${this.skuBase}-${this.skuExtend}`;
                }
                else {
                    return false;
                }
            },
            printSku() {
                return this.formData.custom
                    ? this.getCustomSku(this.formData)
                    : this.sku;
            },
            price() {
                return this.getVariantPropMultipliedByQuality('price');
            },
            oldPrice() {
                return this.getVariantPropMultipliedByQuality('old_price');
            },
            weight() {
                return this.getVariantPropMultipliedByQuality('weight');
            },

            printPrice() {
                return this.formData.custom
                    ? this.getCustomPrice( this.formData.teplSizes, this.formData.supports, this.formData )
                    : this.price;
            },
            printWeight() {
                return this.weight ? this.weight + ' кг' : false;
            },

            tabCode() {
                return this.types[this.tabIndex].code;
            }
        }
    }
</script>

<style>
  .insales-container {
    margin-left: auto;
    margin-right: auto;
    max-width: 1220px;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .container {
    margin-bottom: 0rem!important;
  }

  .row.grid-12 {margin-left:15px;margin-right: 15px;}

  .btn-primary,
  .nav-pills .nav-link.active {
    background-color: #008736!important;
    color: white!important;
  }

  .btn-primary,
  .btn-outline-primary,
  .nav-pills .nav-link {
    border: 1px solid #4bb462!important;
  }

  .btn-outline-primary,
  .nav-pills .nav-link {
    color: #212529!important;
  }

  .btn-outline-primary:not(:disabled):not(.disabled).active,
  .btn-outline-primary:not(:disabled):not(.disabled):active,
  .show>.btn-outline-primary.dropdown-toggle,
  .btn-outline-primary:hover,
  .dropdown-item.active,
  .dropdown-item:active {
    color: #fff!important;
    background-color: #008736!important;
    border-color: #4bb462!important;
  }

  .calc-header {
    position: sticky;
    top: 0px;
    background: #eee;
    z-index: 100;
  }

  .nav-pills .nav-link {
    border-radius: .25rem;
    border: 1px solid #007bff;
  }

  label img {
    width: 100%;
  }

</style>
