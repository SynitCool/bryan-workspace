<template>
    <div>
        <div class="form-container">
            <h2>Plan App</h2>
            <div class="form-wrapper">
                <!-- Add plan -->
                <form @submit.prevent="addPlan" class="form form1">
                    <h3>Add Plan</h3>
                    <div class="form-group">
                        <label>Your Title</label>
                        <input type="text" placeholder="Your Title" v-model="tempAddPlan.title" required />
                    </div>
                    <div class="form-group">
                        <label>Your Plan</label>
                        <textarea placeholder="Add Your Plan Here" v-model="tempAddPlan.plan" rows="4" required></textarea>
                    </div>
                    <button type="submit" @click="addPlan" class="button-form">Add your plan</button>
                </form>
                <!-- Add plan -->
                <!-- Edit plan -->
                <form v-if="editMode" @submit.prevent="updatePlan" class="form form2">
                    <div class="header">
                        <h3>Edit Plan</h3>
                        <div class="buttons">
                            <button class="close-button"@click="closeEditPlan()">❌</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Your Title</label>
                        <input type="text" placeholder="Your Title" required v-model="tempEditPlan.title" />
                    </div>
                    <div class="form-group">
                        <label>Your Plan</label>
                        <textarea placeholder="Add Your Plan Here" required v-model="tempEditPlan.plan" rows="4"></textarea>
                    </div>
                        <button type="submit" @click="updatePlan()" class="button-form">Update your plan</button>
                </form>
                <!-- Edit plan -->
            </div>
        </div>
        <hr>
        <!-- Sort plan -->
        <div>
            <button @click="sortPlan()">sort</button>
        </div>
        <!-- Sort plan -->
        <hr>
        <!-- Showing plan -->
        <div class="container-flex">
            <div class="container" v-for="data in dataPlan">
                <div class="header">
                    <h1 class="title">{{ data.title }}</h1>
                    <div class="buttons">
                        <button class="edit-button" @click="editPlan(data._id)">✏️</button>
                        <button class="close-button" @click="removePlan(data._id)">❌</button>
                    </div>
                </div>
                <p v-html="data.plan" class="plan"></p>
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
                this.readPlan()
                this.tempEditPlan = this.dataPlan.find(data => data._id === _id)
                this.tempEditPlan.plan = this.tempEditPlan.plan.replace(/<br>/g, "\n")

                this.editMode = true
                window.scrollTo(0, 0)
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
    .container {
        background-color: #1e1e1e; /* Dark background */
        color: #ffffff; /* White text */
        border-radius: 8px; /* Rounded corners */
        padding: 20px; /* Padding inside the container */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
        max-width: 400px; /* Max width of the container */
        margin: 20px auto; /* Center the container */
        transition: transform 0.2s; /* Smooth hover effect */
    }

    .container:hover {
        transform: scale(1.05); /* Slightly enlarge on hover */
    }

    .header {
        display: flex; /* Flexbox for header */
        justify-content: space-between; /* Space between title and buttons */
        align-items: center; /* Center items vertically */
    }

    .title {
        font-size: 24px; /* Title font size */
        margin: 0; /* Remove default margin */
    }

    .plan {
        font-size: 16px; /* Plan font size */
        line-height: 1.5; /* Line height for readability */
    }

    .buttons {
        display: flex; /* Flexbox for buttons */
        gap: 10px; /* Space between buttons */
    }

    .edit-button,
    .close-button {
        background: none; /* No background */
        border: 10px; /* No border */
        color: #ffffff; /* White text */
        font-size: 20px; /* Font size for buttons */
        cursor: pointer; /* Pointer cursor on hover */
        transition: color 0.2s; /* Smooth color transition */
    }

    .edit-button:hover,
    .close-button:hover {
        color: #ffcc00; /* Change color on hover */
        transform: scale(2);
    }

    .container-flex {
        display: flex; /* Use Flexbox */
        flex-wrap: wrap; /* Allow items to wrap to the next line */
        gap: 20px; /* Space between containers */
        justify-content: center; /* Center items horizontally */
    }

    .container-flex > * {
        flex: 1 1 200px; /* Grow and shrink, with a base size of 300px */
        max-width: 400px; /* Maximum width for each container */
    }

    .form-container {
        background-color: #2c2c2c;
        color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        max-width: 800px; /* Increased width for two forms */
        margin: auto;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .form-wrapper {
        display: flex; /* Use flexbox to arrange forms horizontally */
        justify-content: space-between; /* Space between forms */
    }

    .form {
        flex: 1; /* Allow forms to grow equally */
        margin: 0 10px; /* Add margin between forms */
        padding: 20px; /* Add padding for better spacing */
        border-radius: 8px; /* Rounded corners */
        background-color: #3c3c3c; /* Background color for forms */
    }

    .form1 {
        border: 1px solid; /* Border color for Form 1 */
    }

    .form2 {
        border: 1px solid; /* Border color for Form 2 */
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input,
    textarea {
        width: 99%;
        padding: 10px;
        border: 1px solid #444;
        border-radius: 4px;
        background-color: #3c3c3c;
        color: #ffffff;
    }

    input:focus,
    textarea:focus {
        border-color: #007bff;
        outline : none;
    }

    textarea {
        resize: vertical; /* Allow vertical resizing */
        min-height: 100px; /* Set a minimum height */
        max-height: 200px; /* Set a maximum height */
        overflow-y: auto; /* Add a scrollbar if necessary */
    }

    .button-form {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }

    .button-form:hover {
        background-color: #0056b3;
    }
</style>