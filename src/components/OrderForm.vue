<template>
    <b-form class="mt-4">
        <b-form-row v-for="(field, index) in fields" :key="field.code+index"
                class="mb-2"
        >
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
                <color-input v-else-if="field.type === 'color'" v-model="values[field.code]"></color-input>
                <int-input v-else-if="field.type === 'int'" v-model="values[field.code]"></int-input>

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
                                <int-input v-model="teplSizes['Ш'][1]" :min="minHeight" :max="teplicaSize.height - foundationDelta"></int-input>
                                <b-form-text>от {{ minHeight }} до {{ teplicaSize.height - foundationDelta }} см</b-form-text>
                            </div>
                        </b-col>
                    </b-form-row>
                    <b-form-row class="mb-2">
                        <b-col cols="12" sm="2"></b-col>
                        <b-col cols="12" sm="10">
                            <teplica-sh
                                    v-model="customSize"

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
            </b-col>
        </b-form-row>
        <b-form-row class="my-4">
            <b-button variant="primary" size="lg" block :disabled="!formIsFilled" @click="$emit('cart', values)">В корзину</b-button>
        </b-form-row>
    </b-form>
</template>

<script>
    import ColorInput from "./ColorInput";
    import RadioInput from "./RadioInput";
    import IntInput from "./IntInput";

    import TeplicaSh from "./Teplica/Sh";

    export default {
        name: "OrderForm",
        props: ['fields', 'formType'],
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
                showCustomSize: false,
                customSize: false,
                teplSizes: {'Ш': [290, 390]},
                values,
                minWidth: 230,
                minHeight: 180,
                foundationCode: 'soil',
                supports: [0, 0, 0],
                foundationType: [
                    {value: 'soil', title: 'На земле', deltaCm: 10},
                    {value: 'foundation', title: 'На фундаменте', deltaCm: 20},
                ]
            }
        },
        watch: {
            values: {
                deep: true,
                handler() {
                    this.$emit('input', this.values);
                }
            },
            'values.teplica': {
                handler() {
                    this.updateTeplSizes();
                }
            },
            foundationCode() {
                this.updateTeplSizes();
            }

        },
        methods: {
            toggleCustomSize() {
                this.showCustomSize = !this.showCustomSize;
                if (!this.values.teplica) {
                    this.$set(this.values, 'teplica', '3x4');
                }
            },
            updateTeplSizes() {
                this.$set( this.teplSizes, 'Ш', [
                    this.teplicaSize.width - this.foundationDelta,
                    this.teplicaSize.height - this.foundationDelta,
                ]);
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
            }
        },
        computed: {
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
                if (!this.customSize) {
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

                let [wM, hM] = this.values.teplica.split('x');
                let width = parseInt(wM) * 100;
                let height = parseInt(hM) * 100;

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
</style>