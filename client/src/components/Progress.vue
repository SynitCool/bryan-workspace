<template>
    <div>
        <h1>Progress App</h1>
        <form>
            <div>
                <input type="text" placeholder="Your Title" required v-model="tempNoteProgress.title"/><br/><br/>
                <input type="number" placeholder="Number Progress" required v-model="tempNoteProgress.numProgress"/><br/>
                <div v-for="i in Range(1, numProgress+1)">
                    <input type="checkbox" v-model="tempNoteProgress.progress[i].isDone"/>
                    <input type="text" placeholder="Progress" required v-model="tempNoteProgress.progress[i].text"/><br/>
                </div>
                <button @click="addProgress(title, progress)">Add your progress</button>
            </div>
        </form>   
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tempNoteProgress: {
                    title: "",
                    numProgress: 0,
                    progress: [
                        {text: "", isDone: false},
                    ]
                },
                progressNote: [{
                    title: "TITLE 1",
                    numProgress: 1,
                    progress: [
                        {text: "lorem opsum", isDone: true},
                    ]
                }],
            }
        },
        methods: {
            addProgress() {
                this.progressNote.push(this.tempNoteProgress)
            },
        }
    }
</script>

<style scoped>

</style>