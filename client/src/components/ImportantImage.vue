<template>
    <!-- App title -->
    <h1>Important Image App</h1>
    <!-- App title -->
    <div class="container">
        <!-- Form add important image-->
        <div class="box_form">  
            <h1>Add Important Image</h1>
            <form @submit.prevent="addImportantImage">
                <input type="text" placeholder="Your Title" required v-model="tempAddImportantImage.title"/><br/><br/>
                <input type="text" placeholder="Your Description" required v-model="tempAddImportantImage.description"/><br/><br/>
                <input type="file" ref="addimportantImageSelected" accept="image/*" required @change="importantImageSelected"/><br/><br/>
                <button type="submit">Add important images</button>
            </form>
        </div>
        <!-- Form add important image-->
        <!-- Form edit important image-->
        <div v-if="editMode" class="box_form">
            <h1>Edit Important Image</h1>
            <form @submit.prevent="updateImportantImage">
                <button @click="closeEdit">Close</button><br/><br/>
                <input type="text" placeholder="Your Title" v-model="tempEditImportantImage.title"/><br/><br/>
                <input type="text" placeholder="Your Description" v-model="tempEditImportantImage.description"/><br/><br/>
                <input type="file" accept="image/*" ref="editimportantImageSelected" @change="editImportantImageSelected"/><br/><br/>
                <button type="submit">Update important images</button>
            </form>
        </div>
        <!-- Form edit important image -->
    </div>
    <hr/>
    <!-- Showing important image -->
    <div class="container">
        <div v-for="image in dataImportantImage" :key="image._id" class="box">
            <h3>{{ image.title }}</h3>
            <p>{{ image.description }}</p>
            <img :src="`${SERVER_URL}/` + image.image" alt="image" style="width: 200px; height: 200px;"/>
            <br/>
            <span class="image_button_control">
                <button @click="deleteImportantImage(image._id)">Delete</button>
                <button @click="editImportantImage(image._id)">Edit</button>
            </span>
        </div>
    </div>
    <!-- Showing important image -->
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                SERVER_URL: import.meta.env.VITE_SERVER_URL,
                tempAddImportantImage: {
                    title: "",
                    description: "",
                    image: null,
                },
                dataImportantImage: [],
                editMode: false,
                tempEditImportantImage: {
                    _id: "",
                    title: "",
                    description: "",
                    image: null,
                }
            }
        },
        created() {
            axios.get(`${this.SERVER_URL}/important_image`)
                    .then(response => {
                        this.dataImportantImage = response.data
                    })
                    .catch(error => {
                        console.log(error)
                    })
        },
        methods: {
            updateImportantImage() {
                const formData = new FormData()
                formData.append('title', this.tempEditImportantImage.title)
                formData.append('description', this.tempEditImportantImage.description)
                formData.append('image', this.tempEditImportantImage.image)

                axios.put(`${this.SERVER_URL}/important_image/update/` + this.tempEditImportantImage._id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log(response.data)
                        this.editMode = false
                        axios.get(`${this.SERVER_URL}/important_image`)
                            .then(response => {
                                this.dataImportantImage = response.data
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            importantImageSelected(event) {
                this.tempAddImportantImage.image = event.target.files[0]
            },
            editImportantImageSelected(event) {
                this.tempEditImportantImage.image = event.target.files[0]
            },
            addImportantImage() {
                if (!this.tempAddImportantImage.title || !this.tempAddImportantImage.description || !this.tempAddImportantImage.image) {
                    alert('Please fill all the fields of add important image')
                    return
                }

                const formData = new FormData()
                formData.append('title', this.tempAddImportantImage.title)
                formData.append('description', this.tempAddImportantImage.description)
                formData.append('image', this.tempAddImportantImage.image)

                axios.post(`${this.SERVER_URL}/important_image/add`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                        console.log(response.data)
                        this.tempAddImportantImage.title = ""
                        this.tempAddImportantImage.description = ""
                        this.tempAddImportantImage.image = null
                        this.$refs.addimportantImageSelected.value = null

                        axios.get(`${this.SERVER_URL}/important_image`)
                            .then(response => {
                                this.dataImportantImage = response.data
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            deleteImportantImage(_id) {
                axios.delete(`${this.SERVER_URL}/important_image/delete/` + _id)
                    .then(() => {
                        axios.get(`${this.SERVER_URL}/important_image`)
                        .then(response => {
                            this.dataImportantImage = response.data
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            editImportantImage(_id) {
                this.editMode = true

                let fromBackdataImportantImage = this.dataImportantImage.find(image => image._id === _id)
                this.tempEditImportantImage._id = fromBackdataImportantImage._id
                this.tempEditImportantImage.title = fromBackdataImportantImage.title
                this.tempEditImportantImage.description = fromBackdataImportantImage.description
                this.tempEditImportantImage.image = fromBackdataImportantImage.image
            },
            closeEdit() {
                this.editMode = false
            }
        },
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
    .image_button_control {
        display: flex;
        gap: 10px; /* Adjust the value as needed */
        justify-content: center; /* Center the buttons horizontally */
        align-items: center; /* Center the buttons vertically */
    }
</style>