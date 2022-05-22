<template>
    <div id="app">
        <ul>
            <li v-for="whitelistItem in configuration.whitelist">
                {{ whitelistItem }}
            </li>
        </ul>
        <input v-model="newWhitelistItem" type="text">
        <button @click="save()">save</button>
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
            }
        }
    }
</script>