<template>
    <div :class="keyboardActClass"></div>
</template>

<script>
    import Keyboard from "simple-keyboard"
    import "simple-keyboard/build/css/index.css"
    import layout from "simple-keyboard-layouts/build/layouts/russian"

    export default {
        name: "SimpleKeyboard",
        props: {
            keyboardActClass: {
            default: "simple-keyboard-act",
            type: String
            },
            input: {
            type: String
            }
        },
        data: () => ({
            keyboardAct: null
        }),
        mounted() {
            this.keyboardAct = new Keyboard(this.keyboardActClass, {
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            //...layout,
            layout: {
                default: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "Q W E R T Y U I O P",
                    'A S D F G H J K L',
                    "Z X C V B N M - {bksp}"
                ]},
                display: {
                    '{bksp}': '←',
                    }
                })
            },
        methods: {
            onChange(input) {
                this.$emit("onChange", input)
            },
            onKeyPress(button) {
                this.$emit("onKeyPress", button)

                if (button === "{shift}" || button === "{lock}") this.handleShift()
            },
            handleShift() {
                let currentLayout = this.keyboardAct.options.layoutName;
                let shiftToggle = currentLayout === "default" ? "shift" : "default";
                this.keyboardAct.setOptions({
                    layoutName: shiftToggle
                })
            }
        },
        watch: {
            input(input) {
                this.keyboardAct.setInput(input)
            }
        }
    }
</script>