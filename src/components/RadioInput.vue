<template>
    <div class="d-flex flex-wrap">
        <div class="btn-group radio-group" role="group">
            <label class="btn" v-for="variant in values" :key="variant.code"
                    :class="{
                        'btn-outline-primary': !isSelected(variant),
                        'btn-primary': isSelected(variant),
                        'btn-disabled': variant.disabled,
                        'disabled': variant.disabled
                    }"
            >
                <span v-if="variant.title">{{variant.title}}</span>
                <img v-if="variant.image" :src="variant.image">
                <input type="radio" :value="variant.value" v-model="selected" @change="emitValue" :disabled="variant.disabled">
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
            },
            values() {
                this.triggerPreSelected();
            }
        },
        created() {
            this.triggerPreSelected();
        },
        methods: {
            triggerPreSelected() {
                if (!this.values) {
                    return;
                }

                for (let variant of this.values) {
                    if (variant && variant.selected) {
                        this.selected = variant.value;
                        return this.emitValue();
                    }
                }
            },
            isSelected(variant) {
                let isObject = typeof (this.selected) === 'object' && this.selected !== null;

                return isObject
                    ? JSON.stringify(this.selected) === JSON.stringify(variant.value)
                    : this.selected === variant.value;
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

    .btn-disabled, .btn-disabled:hover, .btn-disabled:active {
        background-color: #eaeaea!important;
        color: #21252980!important;
        border-color: #cccccc!important;
    }

</style>