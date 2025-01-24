<template>
    <div>
        <h1>This is Home Components</h1>
    </div>
    <hr>
    <div>
        <div v-for="tabRecent in dataHome">
            <h1>{{ tabRecent.tab }}</h1>
            <p>{{ tabRecent.desc }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataHome: [
                {tab: "plan", desc: "plan 1"},
                {tab: "calendar", desc: "calendar 1"},
                {tab: "plan", desc: "plan 2"}
            ]
        }
    }
}
</script>

<style scoped>

</style>