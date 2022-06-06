<template>
    <div id="app">
        <div class="container mt-4 mb-4">
            <h1 class="mt-0 mb-4">Активация ПО</h1>
            
            <div class="mb-4">
                <div class="row">
                    <div class="col-8">
                        <input v-model="input" type="text" class="form-control" placeholder="Введите ключ активации">
                    </div>
                    <div class="col-4">
                        <button class="btn btn-primary w-100">Активировать</button>
                    </div>
                </div>
            </div>

            <SimpleKeyboard @onChange="onChange" :input="input"/>

        </div>
    </div>
</template>

<script>
    import SimpleKeyboard from './SimpleKeyboard.vue';

    export default {
        data() {
            return {
                input: '',
            }
        },
        methods: {
            onChange(input) {
                this.input = input
            },
        },
        components: {
            SimpleKeyboard
        },
    }
</script>