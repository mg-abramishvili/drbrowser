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
    const fs = window.require('fs')

    export default {
        data() {
            return {
                newWhitelistItem: '',

                configuration: '',
            }
        },
        mounted() {
            this.configuration = JSON.parse(fs.readFileSync('configuration.json'))
        },
        methods: {
            save() {
                if(this.newWhitelistItem.length == 0) {
                    return this.$swal('Пусто')
                }

                this.configuration.whitelist.push(this.newWhitelistItem)

                fs.writeFileSync('configuration.json', JSON.stringify(this.configuration))
    
                this.newWhitelistItem = ''
            }
        }
    }
</script>