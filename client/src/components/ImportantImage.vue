<template>
    <!-- App title -->
    <h1>Important Image App</h1>
    <!-- App title -->
    <div class="form-container-outer">
        <div class="form-container-inner">
            <div class="form-header">
                <h2>Add Image</h2>
            </div>
            <form @submit.prevent="addImportantImage">
                <div class="form-group">
                    <label>Your title</label>
                    <input type="text" placeholder="Your Title" required v-model="tempAddImportantImage.title" />
                </div>
                <div class="form-group">
                    <label>Your description</label>
                    <input type="text" placeholder="Your Description" required v-model="tempAddImportantImage.description" />
                </div>
                <div class="form-group">
                    <label>Upload Image:</label>
                    <input type="file"  ref="addimportantImageSelected" accept="image/*" required @change="importantImageSelected" />
                </div>
                <button type="submit">Add important image</button>
            </form>
            <div v-if="this.tempAddImportantImage.image" class="image-preview">
                <h3>Image Preview:</h3>
                <img :src="this.tempAddImportantImage.imageUrl" alt="Uploaded Image" />
            </div>
        </div>
        <div v-if="editMode" class="form-container-inner">
            <div class="form-header">
                <h2>Update important image</h2>
                <button class="close-button" @click="closeEdit">✖</button>
            </div>
            <form @submit.prevent="updateImportantImage">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" placeholder="Your Title" v-model="tempEditImportantImage.title" />
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <input type="text" placeholder="Your Description" v-model="tempEditImportantImage.description" required />
                </div>
                <div class="form-group">
                    <label>Upload Image:</label>
                    <input type="file" ref="editimportantImageSelected" @change="editImportantImageSelected" accept="image/*" />
                </div>
                <button type="submit">Submit</button>
            </form>
            <div v-if="this.tempEditImportantImage.image" class="image-preview">
                <h3>Image Preview:</h3>
                <img :src="this.tempEditImportantImage.imageUrl" alt="Uploaded Image" />
            </div>
        </div>
    </div>
    <hr/>
    <!-- Sort plan -->
    <div>
        <button @click="sortPlan()">sort</button>
    </div>
    <!-- Sort plan -->
    <hr/>
    <!-- Showing important images -->
    <div class="card-container">
        <div class="card" v-for="image in dataImportantImage">
            <div class="card-image-container">
                <img
                    :src="`${SERVER_URL}/` + image.image"
                    alt="Card image"
                    class="card-image"
                    @click="openModal(image._id)"
                />
            </div>
            <div class="card-content">
                <h2 class="card-title">{{ image.title }}</h2>
                <p class="card-description">{{ image.description }}</p>
                <div class="button-group">
                    <button class="btn" @click="editImportantImage(image._id)">
                        <!-- <i class="fas fa-edit"></i> -->
                        ✏️
                    </button>
                    <button class="btn" @click="deleteImportantImage(image._id)">
                        <!-- <i class="fas fa-times"></i> -->
                        ❌
                    </button>
                </div>
            </div>
            <div v-if="image.zoomed" class="modal" @click="closeModal(image._id)">
                <img :src="`${SERVER_URL}/` + image.image" alt="Zoomed image" class="modal-image" />
            </div>
        </div>
    </div>
    <!-- Showing important images -->
</template>

<script>
    import axios, { formToJSON } from 'axios'

    export default {
        data() {
            return {
                isModalOpen: false,
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
            this.readImportantImage()
        },
        methods: {
            sortPlan() {
                this.dataImportantImage = this.dataImportantImage.reverse()
            },
            readImportantImage() {
                axios.get(`${this.SERVER_URL}/important_image`)
                    .then(response => {
                        this.dataImportantImage = response.data
                        for (let i = 0; i < this.dataImportantImage.length; i++) {
                            this.dataImportantImage[i].zoomed = false
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            openModal(_id) {
                this.dataImportantImage.find(image => image._id === _id).zoomed = true
            },
            closeModal(_id) {
                this.dataImportantImage.find(image => image._id === _id).zoomed = false
            },
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
                        this.readImportantImage()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            importantImageSelected(event) {
                this.tempAddImportantImage.image = event.target.files[0]
                this.tempAddImportantImage.imageUrl = URL.createObjectURL(event.target.files[0])
            },
            editImportantImageSelected(event) {
                this.tempEditImportantImage.image = event.target.files[0]
                this.tempEditImportantImage.imageUrl = URL.createObjectURL(event.target.files[0])
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

                        this.readImportantImage()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            deleteImportantImage(_id) {
                axios.delete(`${this.SERVER_URL}/important_image/delete/` + _id)
                    .then(() => {
                        this.readImportantImage()
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
                this.tempEditImportantImage.imageUrl = `${this.SERVER_URL}/` + fromBackdataImportantImage.image

                window.scrollTo(0, 0)
            },
            closeEdit() {
                this.editMode = false
            }
        },
    }
</script>

<style scoped>
    .card {
        background-color: #1e1e1e;
        color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
    }

    .card-image-container {
        display: flex;
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically */
    }

    .card-image {
        width: 50%;
        height: auto;
        cursor: pointer;
    }

    .card-content {
        padding: 16px;
    }

    .card-image:hover {
        transform: scale(1.1);  
    }

    .card-title {
        font-size: 1.5em;
        margin: 0;
    }

    .card-description {
        font-size: 1em;
        margin: 8px 0 0;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .btn {
        background: none;
        border: none;
        color: #ffffff;
        cursor: pointer;
        font-size: 1.5em;
    }

    .btn:hover {
        transform: scale(1.5);
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-image {
        max-width: 90%;
        max-height: 90%;
    }

    .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .form-container-outer {
        display: flex;
        justify-content: center; /* Center the forms horizontally */
        gap: 20px; /* Space between the forms */
        flex-wrap: wrap; /* Allow forms to wrap on smaller screens */
    }

    .form-container-inner {
        background-color: #333;
        color: #fff;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        width: 100%; /* Make the form container responsive */
        max-width: 300px; /* Set a maximum width for the forms */
        display: flex;
        flex-direction: column; /* Stack elements vertically */
    }

    .form-group {
        margin-bottom: 15px;
    }

    input[type="text"],
    input[type="file"] {
        width: 95%;
        padding: 10px;
        border: none;
        border-radius: 4px;
        background-color: #444;
        color: #fff;
    }

    button {
        padding: 10px 15px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    .image-preview {
        margin-top: 20px;
        text-align: center; /* Center the image preview */
    }

    .image-preview img {
        max-width: 50%; /* Make the image responsive */
        max-height: 50%; /* Maintain aspect ratio */
        height: auto;
        border-radius: 8px;
    }

    .close-button {
        background: none;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
    }

    .form-header {
        display: flex;
        justify-content: space-between; /* Space between title and close button */
        align-items: center; /* Center items vertically */
    }
</style>