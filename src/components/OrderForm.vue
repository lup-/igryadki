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
                    <template v-slot:append v-if="formType === 'teplica' && field.code === 'teplica'">
                        <label
                                class="btn btn-outline-primary ml-4"
                                :class="{'active': customSize}"
                                @click="customSize = true"
                        >Свой размер</label>
                    </template>
                </radio-input>
                <color-input v-else-if="field.type === 'color'" v-model="values[field.code]"></color-input>
                <int-input v-else-if="field.type === 'int'" v-model="values[field.code]"></int-input>

                <div v-if="formType === 'teplica' && field.code === 'form' && customSize">
                    <label>Внутренние размеры для грядок (Д x Ш)</label>
                    <b-form-input v-model="teplSizes['Ш'][0]" class="inline-input" number></b-form-input> x
                    <b-form-input v-model="teplSizes['Ш'][1]" class="inline-input" number></b-form-input>
                    <teplica-sh :base-width="teplSizes['Ш'][0]" :base-height="teplSizes['Ш'][1]"></teplica-sh>
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
                customSize: false,
                teplSizes: {'Ш': [290, 390]},
                values
            }
        },
        watch: {
            values: {
                deep: true,
                handler() {
                    this.$emit('input', this.values);
                }
            }
        },
        methods: {
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