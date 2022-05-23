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
                        <button @click="delWhitelistItem(item)" class="btn btn-sm btn-outline-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                        </button>
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
    .btn,
    .form-control {
        height: 40px;
        line-height: 40px;
        padding: 0 12px;
    }
    .btn-sm {
        height: 30px;
        line-height: 30px;
        padding: 0 6px;
    }
    .btn-sm svg {
        display: block;
        width: 16px;
        height: 16px;
    }
</style>