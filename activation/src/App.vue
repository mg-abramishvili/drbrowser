<template>
    <div id="app">
        <div class="container mt-4 mb-4">
            <h1 class="mt-0 mb-4">Активация ПО</h1>

            <div v-if="views.success" class="alert alert-success mb-4" role="alert">
                Активация прошла успешно!
            </div>
            
            <div class="mb-4">
                <div class="row">
                    <div class="col-8">
                        <input v-model="input" type="text" class="form-control" placeholder="Введите ключ активации">
                    </div>
                    <div class="col-4">
                        <button @click="checkKey()" class="btn btn-primary w-100">Активировать</button>
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

                views: {
                    success: false,
                }
            }
        },
        methods: {
            onChange(input) {
                this.input = input
            },
            checkKey() {
                if(!this.input) {
                    return
                }

                axios.get(`http://touchlab.su/api/key/view/${this.input}`)
                .then(response => {
                    if(response.data && response.data.status == 'waiting') {
                        this.activate()
                    }
                })
            },
            activate() {
                axios.post(`http://touchlab.su/api/key/activate/${this.input}`, {status: 'active'})
                .then(response => {
                    this.views.success = true

                    setTimeout(() => {
                        this.saveConfig()
                    }, 1000)
                })
            },
            saveConfig() {
                axios.post(`http://127.0.0.1:3000/activation`, {
                    key: this.input
                })
                .then(response => {
                    //
                })
            },
        },
        components: {
            SimpleKeyboard
        },
    }
</script>