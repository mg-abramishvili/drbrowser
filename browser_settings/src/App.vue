<template>
    <div class="wrapper">
        <ul class="list-group">
            <li v-for="whitelistItem in configuration.whitelist" class="list-group-item">
                {{ whitelistItem }}
                <button @click="del(whitelistItem)">удалить</button>
            </li>
        </ul>

        <div>
            <input v-model="newWhitelistItem" type="text" class="form-control">
            <button @click="save()" class="btn btn-primary">save</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                configuration: '',
                
                newWhitelistItem: '',
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
            save() {
                if(this.newWhitelistItem.length == 0) {
                    return
                }

                axios.post('/domain', {
                    name: this.newWhitelistItem
                })
                .then(response => {
                    this.newWhitelistItem = ''

                    this.loadConfiguration()
                })
            },
            del(item) {
                axios.post('/domain-delete', {
                    name: item
                })
                .then(response => {
                    this.loadConfiguration()
                })
            }
        }
    }
</script>