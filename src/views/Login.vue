<template>
    <div class="login-page space-y-12">
        <img src="../assets/logo.svg" alt="Logo" class="logo"/>
        <Card class="login-card space-y-2">
            <Button
                    :icon-src="require('../assets/icons/google.svg')"
                    @click="doSocialSignIn('google')"
                    class="w-full">
                Sign in with Google
            </Button>

            <Button
                    :icon-src="require('../assets/icons/github.svg')"
                    @click="doSocialSignIn('github')"
                    dark>
                Sign in with GitHub
            </Button>
        </Card>
    </div>
</template>

<script>
    import Card from "../components/Card";
    import Button from "../components/Button";
    export default {
        name: "Login",
        components: {Button, Card},
        methods: {
            doSocialSignIn(using) {
                this.$store.dispatch('doSocialSignIn', using).catch((e) => {
                    alert(e.message)
                })
            }
        }
    }
</script>

<style scoped>
    .login-page {
        @apply flex flex-col items-center;
    }

    .login-card {
        width: 20rem;
    }

    .logo {
        @apply h-24;
    }
</style>
