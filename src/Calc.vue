<template>
    <b-container class="p-2">
        <b-row class="calc-header mb-4 ml-0 mr-2 py-2">
            <b-col cols="12" sm="6">
                <label>Артикул: <span class="sku">{{sku || '-'}}</span></label>
            </b-col>
            <b-col cols="12" sm="6" class="text-sm-right sticky-price">
                <h4>
                    Цена:
                    <span class="calc-price">{{price || '-'}}</span>
                    <span>&#8381;</span>
                </h4>
            </b-col>
        </b-row>

        <b-tabs pills fill v-model="tabIndex">
            <b-tab v-for="type in types" :key="type.code"
                    title-item-class="mr-2 mb-4"
                    :title="type.title"
            >
                <order-form :fields="formFields[type.code]" :form-type="type.code" v-model="orderData[type.code]" @cart="addToCart"></order-form>
            </b-tab>
        </b-tabs>

        <b-row class="px-2 pt-4">
            <b-button href="/cart_items" variant="primary" size="lg" block>Оформить заказ</b-button>
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

    export default {
        name: 'Calc',
        data() {
            return {
                tabIndex: 0,
                types: [
                    {code: 'gryadka', title: 'Грядка'},
                    {code: 'klumba', title: 'Клумба'},
                    {code: 'teplica', title: 'В теплицу'},
                ],
                formFields,
                orderData: {
                    gryadka: {},
                    klumba: {},
                    teplica: {},
                },
                allProducts: [],
            }
        },
        components: {
            OrderForm
        },
        created() {
            this.loadProducts();
        },
        methods: {
            addToCart() {
                let variant = this.getProductVariant(this.sku);
                let quantity = this.formData.quantity;
                let cartApi = window.Cart;

                if (variant && quantity && cartApi) {
                    let items = {};
                    items[variant.id] = quantity;
                    cartApi.add({
                        items: items
                    });
                }
            },

            async loadProducts() {
                let response = await axios.get('/collection/all.json');
                this.allProducts = response.data.products;
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
            }
        },
        computed: {
            formData() {
                return this.orderData[this.tabCode];
            },
            skuIndex() {
                return this.allProducts.reduce(function (skus, product) {
                    product.variants.map(function (variant) {
                        if (variant.sku) {
                            skus[variant.sku] = product.id;
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
                        if (formData['bort'] && formData['diameter']) {
                            extend = '' + formData['bort'] + formData['diameter'];
                        }
                        break;
                    case 'teplica':
                        if (formData['bort'] && formData['teplica']) {
                            let tepliceCode = formData['teplica'].replace("x", "");
                            extend = '' + formData['bort'] + tepliceCode;
                        }
                        break;
                }

                return extend;
            },
            sku() {
                if (this.skuBase && this.skuExtend) {
                    return  `${this.skuBase}-${this.skuExtend}`;
                }
                else {
                    return false;
                }
            },
            price() {
                let isProductsLoaded = this.allProducts.length > 0;
                if (!isProductsLoaded) {
                    return false;
                }

                let variant = this.getProductVariant(this.sku);
                let quantity = this.formData['quantity'];

                return variant ? variant.price * quantity: false;
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
    margin-bottom: 5rem!important;
  }

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

  .loadingForm {
    opacity: 0.3;
    pointer-events: none;
  }
</style>
