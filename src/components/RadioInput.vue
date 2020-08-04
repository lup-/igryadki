<template>
    <div class="d-flex flex-wrap">
        <div class="btn-group radio-group" role="group">
            <label class="btn" v-for="variant in values" :key="variant.code"
                    :class="{'btn-outline-primary': !isSelected(variant), 'btn-primary': isSelected(variant)}"
            >
                <span v-if="variant.title">{{variant.title}}</span>
                <img v-if="variant.image" :src="variant.image">
                <input type="radio" :value="variant.value" v-model="selected" @change="emitValue">
            </label>
        </div>
        <slot name="append"></slot>
    </div>
</template>

<script>
    export default {
        name: "RadioInput",
        props: ['values', 'value'],
        data() {
            return {
                selected: this.value
            }
        },
        watch: {
            value() {
                this.selected = this.value;
            }
        },
        methods: {
            isSelected(variant) {
                return this.selected === variant.value;
            },
            emitValue() {
                this.$emit('input', this.selected);
            }
        }
    }
</script>

<style scoped>
    .btn-group {
        max-width: 100%;
    }

    .radio-group label {
        overflow: hidden;
    }
    .radio-group input {
        height: 1px;
        width: 1px;
        position: absolute;
        top: -20px;
    }

</style>