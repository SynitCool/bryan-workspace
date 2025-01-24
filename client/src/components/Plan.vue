<template>
    <div>
        <!-- Title App -->
        <div>
            <h1>Plan App</h1>
        </div>
        <!-- Title App -->
        <div class="container">
            <!-- Form add plan -->
            <div class="box_form">
                <form @submit.prevent="addPlan">
                    <h1>Add Plan</h1>
                    <div>
                        <input type="text" placeholder="Your Title" required v-model="tempAddPlan.title"/><br/><br/>
                        <textarea placeholder="Add Your Plan Here" required v-model="tempAddPlan.plan"></textarea><br/>
                        <button type="submit" @click="addPlan">Add your plan</button>
                    </div>
                </form>
            </div>
            <!-- Form add plan -->
            <!-- Form editing plan -->
            <div v-if="editMode" class="box_form">
                <h1>Edit Plan</h1>
                <form @submit.prevent="updatePlan">
                    <div>
                        <button @click="closeEditPlan()">Close</button>
                        <input type="text" placeholder="Your Title" required v-model="tempEditPlan.title"/><br/><br/>
                        <textarea placeholder="Add Your Plan Here" required v-model="tempEditPlan.plan"></textarea><br/>
                        <button type="submit" @click="updatePlan()">Update your plan</button>
                    </div>
                </form>
            </div>
            <!-- Form editing plan -->
        </div>
        <hr>
        <!-- Sort plan -->
        <div>
            <button @click="sortPlan()">sort</button>
        </div>
        <!-- Sort plan -->
        <hr>
        <!-- Showing plan -->
        <div class="container">
            <div class="box" v-for="data in dataPlan">
                <h1>{{ data.title }}</h1>
                <p v-html="data.plan"></p>
                <div>
                    <button @click="removePlan(data._id)">Remove</button>
                    <button @click="editPlan(data._id)">Edit</button>
                </div>
            </div>
        </div>
        <!-- Showing plan -->
    </div>
</template>

<script>
    import axios from 'axios'
    
    export default {
        data() {
            return {
                SERVER_URL: import.meta.env.VITE_SERVER_URL,
                tempAddPlan: {
                    title: "",
                    plan: "",
                },
                dataPlan: [],
                tempEditPlan: {
                    _id: "",
                    title: "",
                    plan: "",
                },
                editMode: false
            }
        },
        created() {
            this.readPlan()
        },
        methods: {
            readPlan() {
                axios.get(`${this.SERVER_URL}/plan`).then(res => {
                    this.dataPlan = res.data
                }).catch(err => {
                    console.log(err)
                })
            },
            addPlan() {
                this.tempAddPlan.plan = this.tempAddPlan.plan.replace(/\n/g, "<br>")
                axios.post(`${this.SERVER_URL}/plan/add`, this.tempAddPlan).then(res => {
                    this.readPlan()
                }).catch(err => {
                    console.log(err)
                })
                this.tempAddPlan = {title: "", plan: ""}
            },
            removePlan(_id) {
                axios.delete(`${this.SERVER_URL}/plan/delete/${_id}`).then(res => {
                    this.dataPlan = this.dataPlan.filter(data => data._id !== _id)
                }).catch(err => {
                    console.log(err)
                })
            },
            editPlan(_id) {
                this.tempEditPlan = this.dataPlan.find(data => data._id === _id)

                this.editMode = true
            },
            updatePlan() {
                this.tempEditPlan.plan = this.tempEditPlan.plan.replace(/\n/g, "<br>")
                axios.put(`${this.SERVER_URL}/plan/update/${this.tempEditPlan._id}`, this.tempEditPlan).then(res => {
                    this.dataPlan = this.dataPlan.map(data => {
                        if(data._id === this.tempEditPlan._id) {
                            return this.tempEditPlan
                        }
                        return data
                    })
                    this.editMode = false
                }).catch(err => {
                    console.log(err)
                })
            },
            sortPlan() {
                this.dataPlan = this.dataPlan.reverse()
            },
            closeEditPlan() {
                this.editMode = false
                this.readPlan()
            }
        }
    }
</script>

<style scoped>
    div {
        text-align: center;
    }
    .container {
      display: flex;
      flex-wrap: wrap; /* Allow boxes to wrap */
      gap: 10px; /* Space between boxes */
    }
    .box {
      flex: 1 1 auto; /* Auto-resize based on content */
      padding: 20px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      text-align: center;
    }
    .box_form {
      flex: 1 1 auto; /* Auto-resize based on content */
      padding: 20px;
      border: 1px solid #ccc;
      text-align: center;
    }
</style>