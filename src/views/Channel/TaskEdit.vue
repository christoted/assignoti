<template>
    <div class="text-center space-y-2">
        <h3 v-if="!taskKey">New Task</h3>
        <h3 v-else>Edit Task</h3>
        <div class="text-left flex flex-col items-center px-4 lg:px-0">
            <Card class="w-full md:w-3/6 xl:w-2/6">
                <form @submit.prevent="handleSubmit()" class="flex flex-col space-y-4">
                    <div>
                        <label for="task-name">Task name:</label>
                        <Input v-model="form.name" name="task-name" id="task-name" type="text" placeholder="Cook an egg fried rice" :required="true" maxlength="48"/>
                    </div>
                    <div>
                        <label for="task-deadline">Deadline:</label>
                        <date-picker :min-date='new Date()' v-model="form.deadline">
                            <Input :value="form.deadline | dateFormat" name="task-deadline" id="task-deadline" type="text" placeholder="Task deadline" :required="true" maxlength="32"/>
                        </date-picker>
                    </div>
                    <div>
                        <label>Description:</label>
                        <editor ref="descriptionEditor" initialEditType="wysiwyg"/>
                    </div>
                    <div>
                        <label for="attachment">Attachment:</label>

                    </div>
                    <Button class="pt-4" primary>
                        <span class="text-center w-full" v-if="!this.taskKey">Add Task</span>
                        <span class="text-center w-full" v-else>Update Task</span>
                    </Button>
                </form>
            </Card>
            <div class="pt-4" v-if="taskKey">
                <button @click="deleteTask()"><span class="text-red-600">Delete task</span></button>
            </div>
        </div>
    </div>
</template>

<script>
    import Input from "../../components/Input";
    import Card from "../../components/Card";
    import Button from "../../components/Button";
    import DatePicker from 'v-calendar/lib/components/date-picker.umd'
    import '@/assets/css/codemirror.css';
    import '@/assets/css/toastui-editor.css';
    import { Editor } from '@toast-ui/vue-editor';
    import moment from 'moment'
    export default {
        name: "TaskEdit",
        components: {Button, Card, Input, DatePicker, Editor},
        data() {
            return {
                form: {
                    name: '',
                    deadline: new Date(),
                },
                channel: {},
                channelId: 0,
                taskKey: null,
                firebaseTaskData: null
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            },
        },
        methods: {
            bindChannel(channelId) {
                const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

                this.$rtdbBind('channel', dbQuery).catch(e => {
                    console.log(e.message)
                })
            },
            bindTask(channelKey, taskKey) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${channelKey}/tasks/${taskKey}`)
                this.$rtdbBind('firebaseTaskData', dbRef)
            },
            handleSubmit() {
                if (this.taskKey) this.updateTask()
                else this.addTask()
            },
            updateTask() {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${this.channelKey}/tasks/${this.taskKey}`)

                const pushData = {
                    name: this.form.name,
                    deadlineDate: this.form.deadline.toISOString(),
                    description: this.getEditorMarkdown()
                }

                dbRef.update(pushData).then(() => {
                    this.$router.push(`/channels/${this.channelId}/task/${this.taskKey}`)
                }).catch(e => {
                    alert('error')
                    console.log(e.message)
                })
            },
            addTask() {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${this.channelKey}/tasks`)

                const pushData = {
                    name: this.form.name,
                    deadlineDate: this.form.deadline.toISOString(),
                    author: this.$firebase.auth().currentUser.uid,
                    description: this.getEditorMarkdown()
                }

                dbRef.push(pushData).then(() => {
                    this.$router.push(`/channels/${this.channelId}`)
                }).catch(e => {
                    alert('error')
                    console.log(e.message)
                })
            },
            deleteTask() {
                if (confirm('Really delete this task?')) {
                    const db = this.$firebase.database()
                    const dbRef = db.ref(`channels/${this.channelKey}/tasks/${this.taskKey}`)

                    dbRef.remove().then(() => {
                        this.$router.push(`/channels/${this.channelId}`)
                    }).catch(e => {
                        alert('error')
                        console.log(e.message)
                    })
                }
            },
            getEditorMarkdown() {
                return this.$refs.descriptionEditor.invoke('getMarkdown');
            }
        },
        filters: {
            dateFormat(date) {
                return moment(date).format("MMM Do YYYY")
            }
        },
        mounted() {
            if (!parseInt(this.$route.params.id)) {
                this.$router.push('/')
            } else {
                this.channelId = parseInt(this.$route.params.id)
            }

            // get task key from url if present
            if (this.$route.params.taskKey) {
                this.taskKey = this.$route.params.taskKey
            }
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
            channel() {
                if (this.taskKey) this.bindTask(this.channelKey, this.taskKey)
            },
            form() {
                console.log(this.form.deadline)
            },
            firebaseTaskData(val) {
                // update form data with firebase data
                this.form.name = val.name
                this.form.deadline = new Date(val.deadlineDate)
                this.$refs.descriptionEditor.invoke('setMarkdown', val.description);
            }
        }
    }
</script>

<style scoped>

</style>
