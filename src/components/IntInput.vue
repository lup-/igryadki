<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <button type="button" class="btn btn-primary btn-minus" @click="decrease">&mdash;</button>
        </div>
        <input type="text" class="form-control text-center" v-model="newValue" @change="updateValue">
        <div class="input-group-append">
            <button type="button" class="btn btn-primary btn-plus" @click="increase">&plus;</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "IntInput",
        props: ['value'],
        data() {
            return {
                newValue: this.value,
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