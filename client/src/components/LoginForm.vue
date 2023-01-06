<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { reactive, ref } from "vue";
import BaseButton from "./base/BaseButton.vue";
import FormField from "./base/FormField.vue";
import axios, { isAxiosError } from "axios";
import { useUserStore } from "@/stores/useUserStore";

const loginForm = reactive({
    email: "",
    password: "",
});
const $externalResults = ref({});

const v = useVuelidate(
    {
        email: {
            required: helpers.withMessage("Email is required.", required),
            email: helpers.withMessage("Email is invalid.", email),
        },
        password: {
            required: helpers.withMessage("Password is required.", required),
        },
    },
    loginForm,
    { $externalResults }
);

const { login } = useUserStore();

async function submit(e: Event) {
    e.preventDefault();
    v.value.$clearExternalResults();
    const isFormValid = await v.value.$validate();
    if (!isFormValid) return;

    try {
        const res = await axios.post("/api/users/login", loginForm);
        if (res.status === 200) {
            alert("login successful");
            const { user } = res.data;
            login(user);
        }
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.status === 401)
                $externalResults.value = {
                    email: [error.response.data.error.error.message],
                };
        } else {
            alert("Unexpected error occurred.");
        }
    }
}
</script>
<template>
    <form @submit="submit">
        <div>
            <div class="grid grid-cols-1 gap-2">
                <FormField :field="v.email" label="Email" placeholder="Email" type="text" />
                <FormField :field="v.password" label="Password" placeholder="Password" type="password" />

                <BaseButton type="submit" class="mt-3">Submit</BaseButton>
            </div>
        </div>
    </form>
</template>
