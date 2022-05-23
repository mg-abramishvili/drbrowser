<template>
    <div class="wrapper">
        <div class="bg-primary py-3 mb-4">
            <div class="container">
                <h1 class="m-0 text-white">Настройки браузера</h1>
            </div>
        </div>

        <div class="container">
            <div v-if="views.success" class="alert alert-success mb-4">
                Настройки сохранены
            </div>

            <div class="bg-light px-4 py-4 border mb-4">
                <h5 class="mt-0 mb-3">Домашняя страница</h5>
                <input v-model="configuration.homepage" type="text" class="form-control">
            </div>

            <div class="bg-light px-4 py-4 border mb-4">
                <h5 class="mt-0 mb-3">Разрешенные адреса</h5>
                <ul class="list-group mb-1">
                    <li v-for="item in configuration.whitelist" class="list-group-item d-flex align-items-center justify-content-between">
                        {{ item }}
                        <button @click="delWhitelistItem(item)" class="btn btn-sm btn-outline-danger">&times;</button>
                    </li>
                </ul>
                
                <div class="row">
                    <div class="col-10">
                        <input v-model="whitelistItem" type="text" placeholder="добавление нового адреса..." class="form-control">
                    </div>
                    <div class="col-2">
                        <button @click="addWhitelistItem()" class="btn btn-outline-primary w-100">OK</button>
                    </div>
                </div>
            </div>

            <button @click="save()" class="btn btn-primary mb-4">Сохранить настройки</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                configuration: '',
                
                whitelistItem: '',

                views: {
                    success: false,
                }
            }
        },
        created() {
            this.loadConfiguration()
        },
        methods: {
            loadConfiguration() {
                axios.get('/configuration')
                .then(response => {
                    this.configuration = response.data
                })
            },
            addWhitelistItem() {
                if(this.whitelistItem.length == 0) {
                    return
                }

                this.configuration.whitelist.push(this.whitelistItem)
                
                this.whitelistItem = ''
            },
            delWhitelistItem(item) {
                let delIndex = this.configuration.whitelist.indexOf(item)
                if (delIndex !== -1) {
                    this.configuration.whitelist.splice(delIndex, 1)
                }
            },
            save() {
                axios.post('/settings', {
                    configuration: this.configuration
                })
                .then(response => {
                    this.loadConfiguration()

                    window.scrollTo(0, 0)

                    this.views.success = true

                    setTimeout(() => {
                        this.views.success = false
                    }, 2000)
                })
            },
        }
    }
</script>

<style>
    .bg-light {
        border-radius: 6px;
    }
    h1 {
        font-size: 22px;
        text-transform: uppercase;
        line-height: 1;
    }
    h5 {
        text-transform: uppercase;
        color: #454545;
        font-size: 16px;
    }
</style>