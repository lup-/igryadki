<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <button type="button" class="btn btn-primary btn-minus" @click="decrease" :disabled="typeof(min) === 'number' && newValue === min">&mdash;</button>
        </div>
        <input type="text" class="form-control text-center" v-model="newValue" @change="updateValue">
        <div class="input-group-append">
            <button type="button" class="btn btn-primary btn-plus" @click="increase" :disabled="typeof(max) === 'number' && newValue === max">&plus;</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "IntInput",
        props: ['value', 'min', 'max'],
        data() {
            return {
                newValue: this.value,
            }
        },
        watch: {
            value() {
                this.newValue = this.value;
            },
            min() {
                this.updateValue();
            },
            max() {
                this.updateValue();
            }
        },
        methods: {
            increase() {
                this.newValue++;
                this.updateValue();
            },
            decrease() {
                this.newValue = this.newValue > 0 ? this.newValue - 1 : 0;
                this.updateValue();
            },
            updateValue() {
                if (typeof (this.min) === 'number' && this.newValue < this.min) {
                    this.newValue = this.min;
                }

                if (typeof (this.max) === 'number' && this.newValue > this.max) {
                    this.newValue = this.max;
                }

                this.$emit( 'input', this.newValue );
            }
        }
    }
</script>

<style scoped>
    .input-group {
        width: 10rem;
    }
</style>