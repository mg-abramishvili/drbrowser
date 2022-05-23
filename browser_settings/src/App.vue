<template>
    <div class="container">
        <div class="mb-3">
            <input v-model="configuration.homepage" type="text" class="form-control">
        </div>
        <ul class="list-group">
            <li v-for="item in configuration.whitelist" class="list-group-item">
                {{ item }}
                <button @click="delWhitelistItem(item)" class="btn btn-sm btn-outline-danger">&times;</button>
            </li>
        </ul>

        <div>
            <input v-model="whitelistItem" type="text" class="form-control">
            <button @click="addWhitelistItem()" class="btn btn-primary">OK</button>
        </div>

        <button @click="save()" class="btn btn-lg btn-primary">Сохранить настройки</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                configuration: '',
                
                whitelistItem: '',
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
                })
            },
        }
    }
</script>