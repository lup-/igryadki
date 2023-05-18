<template>
    <b-form class="mt-4" :class="{'loadingForm': isLoading}">
        <div v-for="(field, index) in fields" :key="field.code+index">
            <b-form-row class="mb-2">
                <b-col cols="12" sm="2">
                    <label class="col-form-label">{{getFieldTitle(field)}}</label>
                </b-col>
                <b-col cols="12" sm="10">
                    <radio-input v-if="field.type === 'radio'" :values="getFieldValues(field)" v-model="values[field.code]">
                        <template v-slot:append v-if="formType === 'teplica' && field.code === 'teplica' && values.form === 'Ш'">
                            <label
                                    class="btn btn-outline-primary ml-md-4"
                                    :class="{'active': showCustomSize}"
                                    @click="toggleCustomSize"
                            >Свой размер</label>
                        </template>
                    </radio-input>
                    <color-input v-else-if="field.type === 'color'" v-model="values[field.code]" :filter="values[field.code].filter || null"></color-input>
                    <int-input v-else-if="field.type === 'int'" v-model="values[field.code]"></int-input>
                </b-col>
            </b-form-row>

            <div v-if="formType === 'teplica' && field.code === 'teplica' && showCustomSize" class="mt-2">
                <b-form-row class="mb-2">
                    <b-col cols="12" sm="2">Установка</b-col>
                    <b-col cols="12" sm="10">
                        <radio-input :values="foundationType" v-model="foundationCode"></radio-input>
                    </b-col>
                </b-form-row>
                <b-form-row class="mb-2">
                    <b-col cols="12" sm="2"><label class="col-form-label">Ширина</label></b-col>
                    <b-col cols="12" sm="10">
                        <div role="group">
                            <int-input v-model="teplSizes['Ш'][0]" :min="minWidth" :max="teplicaSize.width - foundationDelta"></int-input>
                            <b-form-text>от {{ minWidth }} до {{ teplicaSize.width - foundationDelta }} см</b-form-text>
                        </div>
                    </b-col>
                </b-form-row>
                <b-form-row class="mb-2">
                    <b-col cols="12" sm="2"><label class="col-form-label">Длина</label></b-col>
                    <b-col cols="12" sm="10">
                        <div role="group">
                            <int-input v-model="teplSizes['Ш'][1]" :min="minHeight" :max="1000 - foundationDelta"></int-input>
                            <b-form-text>от {{ minHeight }} до {{ teplicaSize.height - foundationDelta }} см</b-form-text>
                        </div>
                    </b-col>
                </b-form-row>
                <b-form-row class="mb-2">
                    <b-col cols="12" sm="2"></b-col>
                    <b-col cols="12" sm="10">
                        <teplica-sh
                                v-model="calcData"

                                :base-width="teplicaSize.baseWidth"
                                :base-height="teplicaSize.baseHeight"
                                :full-width="teplicaSize.width"
                                :full-height="teplicaSize.height"
                                :supports="supports"
                        ></teplica-sh>
                    </b-col>
                </b-form-row>
                <b-form-row class="">
                    <b-col cols="12" sm="2">Дополнительные стяжки</b-col>
                    <b-col cols="12" sm="3">
                        <div role="group" class="mr-2">
                            <int-input v-model="supports[0]" :min="0" :max="maxSupports[0]"></int-input>
                            <b-form-text>максимально: {{maxSupports[0]}}</b-form-text>
                        </div>
                    </b-col>
                    <b-col cols="12" sm="3" class="mr-2">
                        <div role="group">
                            <int-input v-model="supports[1]" :min="0" :max="maxSupports[1]"></int-input>
                            <b-form-text>максимально: {{maxSupports[1]}}</b-form-text>
                        </div>
                    </b-col>
                    <b-col cols="12" sm="3">
                        <div role="group">
                            <int-input v-model="supports[2]" :min="0" :max="maxSupports[2]"></int-input>
                            <b-form-text>максимально: {{maxSupports[2]}}</b-form-text>
                        </div>
                    </b-col>
                </b-form-row>
            </div>
        </div>
        <b-form-row class="my-4">
            <b-col cols="12">
                <b-alert variant="danger" show v-if="skuConstructed && (!priceFound || !canAddToCart)">Нет в наличии</b-alert>
                <b-alert variant="info" show v-if="!skuConstructed">Выберите все параметры</b-alert>
            </b-col>
        </b-form-row>

        <b-form-row class="my-4">
            <b-button class="btn-cart" variant="primary" size="lg" block :disabled="!canAddToCart" @click="addToCart">
                {{isLoading && loadingMessage ? loadingMessage : 'В корзину'}}
                <div class="loader" v-if="isLoading"></div>
            </b-button>
        </b-form-row>

        <b-modal id="confirm-modal" title="Добавление в корзину" v-model="showConfirm" @close="confirmResult = false">
            <p class="my-4">Пожалуйста проверьте, верно ли указаны размеры?</p>
            <template v-slot:modal-footer>
                <b-button variant="outline-secondary" size="sm" @click="confirmResult = false" class="mr-2">Посмотрю еще раз</b-button>
                <b-button variant="primary" @click="confirmResult = true">Да, все верно</b-button>
            </template>
        </b-modal>
    </b-form>
</template>

<script>
    import ColorInput from "./ColorInput";
    import RadioInput from "./RadioInput";
    import IntInput from "./IntInput";

    import TeplicaSh from "./Teplica/Sh";

    function clone(obj) {
        return JSON.parse( JSON.stringify(obj) );
    }

    export default {
        name: "OrderForm",
        props: ['fields', 'formType', 'isLoading', 'loadingMessage', 'cartAvailable', 'skuConstructed', 'priceFound'],
        components: {ColorInput, RadioInput, IntInput, TeplicaSh},
        data() {
            let values = this.fields.reduce( (aggr, fieldData) => {
                if (typeof (fieldData.default) !== 'undefined') {
                    aggr[fieldData.code] = fieldData.default;
                }
                return aggr;
            }, {});

            values['what'] = this.formType;

            return {
                showConfirm: false,
                confirmResult: null,
                showCustomSize: false,
                customSize: false,
                customDetails: false,
                customSvgImage: false,
                calcData: false,
                skipTeplSizeUpdate: false,
                teplSizes: {'Ш': [290, 390]},
                values,
                minWidth: 230,
                minHeight: 180,
                foundationCode: 'soil',
                supports: [0, 0, 0],
                foundationType: [
                    {value: 'soil', title: 'На земле', deltaCm: 10},
                    {value: 'foundation', title: 'На фундаменте', deltaCm: 20},
                ],
                lastBortValuesFieldShown: null
            }
        },
        watch: {
            fields() {
                if (this.isBortValuesFieldShown !== this.lastBortValuesFieldShown) {
                    this.sendDataChanges();
                    this.lastBortValuesFieldShown = this.isBortValuesFieldShown;
                }
            },
            values: {
                deep: true,
                handler() {
                    this.sendDataChanges();
                }
            },
            supports: {
                deep: true,
                handler() {
                    this.sendDataChanges();
                }
            },
            'values.teplica': {
                handler() {
                    this.updateTeplSizes();
                }
            },
            teplSizes: {
                deep: true,
                handler() {
                    let maxHeight = this.teplicaSize.height - this.foundationDelta;
                    let enteredHeight = this.teplSizes['Ш'][1];
                    if ( enteredHeight > maxHeight ) {
                        let teplicaField = this.fields.find( field => field.code === 'teplica' );
                        if (teplicaField) {
                            let nextSize = teplicaField.values.find(value => {
                                let {height} = this.getTeplicaWidhtHeightByCode(value.value);
                                return height - this.foundationDelta >= enteredHeight;
                            });

                            if (nextSize) {
                                this.skipTeplSizeUpdate = true;
                                this.$set(this.values, 'teplica', nextSize.value);
                            }
                        }
                    }

                    this.updateSupportCount();
                    this.sendDataChanges();
                }
            },
            calcData: {
                deep: true,
                handler() {
                    this.customSize = this.calcData.size;
                    this.customDetails = this.calcData.details;
                    this.customSvgImage = this.calcData.svgImage;
                }
            },
            foundationCode() {
                this.updateTeplSizes();
                this.sendDataChanges();
            },
            showCustomSize() {
                this.sendDataChanges();
            }
        },
        methods: {
            sendDataChanges() {
                let sendValues = clone(this.values);

                if (!this.isBortValuesFieldShown) {
                    sendValues['bortVariants'] = null;
                }

                if (this.showCustomSize) {
                    let teplSizes = this.teplSizes[ sendValues.form ];

                    sendValues = Object.assign(sendValues, {
                        custom: true,
                        customSize: this.customSize,
                        supports: this.supports,
                        teplSizes
                    });
                }

                this.$emit('input', sendValues);
            },
            toggleCustomSize() {
                this.showCustomSize = !this.showCustomSize;
                if (!this.values.teplica) {
                    this.$set(this.values, 'teplica', '3x4');
                }
                this.$nextTick(() => {
                    this.updateSupportCount();
                });
            },
            updateSupportCount() {
                this.supports = this.supports.map( (currentSupports, grIndex) => {
                    let maxSupports = this.maxSupports[grIndex];
                    if (currentSupports > 0) {
                        return currentSupports;
                    }

                    return maxSupports > 0 ? 1 : 0;
                });
            },
            updateTeplSizes() {
                if (!this.skipTeplSizeUpdate) {
                    this.$set(this.teplSizes, 'Ш', [
                        this.teplicaSize.width - this.foundationDelta,
                        this.teplicaSize.height - this.foundationDelta,
                    ]);
                }
                this.skipTeplSizeUpdate = false;

                this.updateSupportCount();
            },
            isSelected(field, variant) {
                return this.values[field.code] === variant.value;
            },
            getFieldTitle(field) {
                if (field.getTitle) {
                    return field.getTitle( this.values );
                }
                else {
                    return field.title;
                }
            },
            getFieldValues(field) {
                if (field.filter) {
                    return field.values.filter( field.filter.bind(this) );
                }
                else {
                    return field.values;
                }
            },
            getTeplicaWidhtHeightByCode(code) {
                let [wM, hM] = code.split('x');
                let width = parseInt(wM) * 100;
                let height = parseInt(hM) * 100;
                return {width, height};
            },
            confirm() {
                this.showConfirm = true;
                return new Promise( resolve => {
                    let intervalId;
                    intervalId = setInterval(() => {
                        if (this.confirmResult !== null) {
                            let isConfirmed = this.confirmResult;

                            clearInterval(intervalId);
                            this.showConfirm = false;
                            this.confirmResult = null;
                            resolve(isConfirmed);
                        }
                    }, 1);
                });
            },
            async addToCart() {
                if (this.showCustomSize) {
                    let teplSizes = this.teplSizes[ this.values.form ];
                    let isConfirmed = await this.confirm();
                    if (isConfirmed) {
                        this.$emit('customCart', this.customSize, this.supports, teplSizes, this.values, this.customDetails, this.customSvgImage);
                    }
                }
                else {
                    this.$emit('cart', this.values);
                }
            }
        },
        computed: {
            canAddToCart() {
                return this.formIsFilled && !this.isLoading && (this.showCustomSize || this.cartAvailable);
            },
            isBortValuesFieldShown() {
                let bortField = this.fields.find(field => field.code === 'bortVariants');
                return Boolean(bortField);
            },
            formIsFilled() {
                let allFieldCodes = this.fields.map( field => field.code );
                let filledFieldCodes = Object.keys(this.values);

                let emptyFieldCodes = allFieldCodes.filter( fieldCode => filledFieldCodes.indexOf(fieldCode) === -1);
                let allFieldsFilled = emptyFieldCodes.length === 0;

                return allFieldsFilled;
            },
            foundationDelta() {
                let foundation = this.foundationType.find( item => item.value === this.foundationCode );
                return foundation ? foundation.deltaCm : 0;
            },
            maxSupports() {
                if (!this.customSize || !this.customSize.map) {
                    return [0, 0, 0];
                }

                return this.customSize.map( gryadka => {
                    let minSupportSpaceCm = 100;
                    return Math.floor(gryadka.lengthCm / minSupportSpaceCm)-1;
                });
            },
            fieldStates() {
                return [
                    this.teplSizes['Ш'][0] >= this.minWidth && this.teplSizes['Ш'][0] <= (this.teplicaSize.width - this.foundationDelta),
                    this.teplSizes['Ш'][1] >= this.minHeight && this.teplSizes['Ш'][1] <= (this.teplicaSize.height - this.foundationDelta),
                ];
            },
            teplicaSize() {
                if (!this.values.teplica) {
                    return {width: 300, height: 400, baseWidth: 300, baseHeight: 400};
                }

                let {width, height} = this.getTeplicaWidhtHeightByCode(this.values.teplica);

                let [baseWidth, baseHeight] = this.teplSizes['Ш'];
                if (baseWidth < this.minWidth) {
                    baseWidth = this.minWidth;
                }

                if (baseWidth > width - this.foundationDelta) {
                    baseWidth = width - this.foundationDelta;
                }

                if (baseHeight < this.minHeight) {
                    baseHeight = this.minHeight;
                }

                if (baseHeight > height - this.foundationDelta) {
                    baseHeight = height - this.foundationDelta;
                }

                return {width, height, baseWidth, baseHeight};
            }
        }
    }
</script>

<style scoped>
    .inline-input {
        display: inline-block;
        width: auto;
    }

    .loader,
    .loader:before,
    .loader:after {
        border-radius: 50%;
    }

    .loadingForm .btn-cart {
        position: relative;
    }

    .loader {
        color: #ffffff;
        font-size: 11px;
        text-indent: -99999em;
        margin: -1em auto;
        position: relative;
        width: 2em;
        height: 2em;
        box-shadow: inset 0 0 0 0.3em;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);

        position: absolute;
        z-index: 10000;
        margin-right: 5em;
        margin-top: -2.2em;
    }
    .loader:before,
    .loader:after {
        position: absolute;
        content: '';
    }
    .loader:before {
        width: 1.2em;
        height: 2.2em;
        background: #008736;
        border-radius: 2.2em 0 0 2.2em;
        top: -0.1em;
        left: -0.1em;
        -webkit-transform-origin: 1.2em 1.1em;
        transform-origin: 1.2em 1.1em;
        -webkit-animation: load2 2s infinite ease 1.5s;
        animation: load2 2s infinite ease 1.5s;
    }

    .loader:after {
        width: 1.2em;
        height: 2.2em;
        background: #008736;
        border-radius: 0 2.2em 2.2em 0;
        top: -0.1em;
        left: 1.1em;
        -webkit-transform-origin: 0px 1.1em;
        transform-origin: 0px 1.1em;
        -webkit-animation: load2 2s infinite ease;
        animation: load2 2s infinite ease;
    }
    @-webkit-keyframes load2 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load2 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>