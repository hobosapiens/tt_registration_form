<template>
  <div class="w-[400px] p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form @submit.prevent="submitForm" class="space-y-6">
      <h5 class="text-xl font-medium text-center text-gray-900 dark:text-white">Registration</h5>
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white">Name</label>
        <input
          v-model="formData.name"
          type="name"
          name="name"
          id="name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Your name"
        >
        <div v-if="v$.name.$errors">
          <p
            v-for="error in v$.name.$errors"
            :key="error"
            class="mt-2 text-sm text-red-600 dark:text-red-500"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white">Email</label>
        <input
          v-model="formData.email"
          type="email"
          name="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name@company.com"
        >
        <div v-if="v$.email.$errors">
          <p
            v-for="error in v$.email.$errors"
            :key="error"
            class="mt-2 text-sm text-red-600 dark:text-red-500"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>
      <div class="relative">
        <label for="location" class="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white">Location</label>
        <input
          v-model="formData.location"
          @input="getLocalesWithDebounce(formData.location)"
          type="text"
          name="location"
          id="location"
          placeholder="Country, city"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
        <div
          v-if="locationsSelect.length"
          class="block absolute z-50 w-full max-w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <ul class="space-y-3">
            <li
              v-for="location in locationsSelect"
              :key="location"
              @click="addLocationToInput(location)"
              class="text-left cursor-pointer"
            >
              {{ location }}
            </li>
          </ul>
        </div>
        <div v-if="v$.location.$errors">
          <p
            v-for="error in v$.location.$errors"
            :key="error"
            class="mt-2 text-sm text-red-600 dark:text-red-500"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>
      <div class="relative">
        <label for="password" class="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white">Password</label>
        <input
          v-model="formData.password"
          :type="isPasswordShown ? 'password' : 'text'"
          name="password"
          id="password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-12"
        >
        <div
          @click="togglePasswordVisability"
          class="absolute w-7 right-3 top-9 cursor-pointer"
        >
          <img :src="eyeIcon" alt="Icon" />
        </div>
        <div v-if="v$.password.$errors">
          <p
            v-for="error in v$.password.$errors"
            :key="error"
            class="mt-2 text-sm text-red-600 dark:text-red-500"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>
      <BaseButton>
        Registrate your account
      </BaseButton>
    </form>
    <BaseModal
      :isOpen="isModalShown"
      :content="formData"
      @toggle="toggleModalVisability"
    />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import { GEO_DB_URL } from '@/constants';
import {
  debounce,
  isStringContainsNumber,
  isStringContainsCapitalLetter,
  isStringContainsSmallLetter
} from '@/utils';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';

const isPasswordShown = ref(true);
const isModalShown = ref(false);
const locationsSelect = ref([]);

const formData = reactive({
  name: '',
  email: '',
  location: '',
  password: '',
});

const eyeIcon = computed(() => {
  return require(`@/assets/eye-${isPasswordShown.value ? 'open' : 'close'}.svg`);
})

const rules = computed(() => {
  return {
    name: {
      required
    },
    email: {
      required,
      email,
    },
    location: {
      required
    },
    password: {
      required,
      isStringContainsNumber: helpers.withMessage(
        'The password must contain at least one number',
        isStringContainsNumber,
      ),
      isStringContainsCapitalLetter: helpers.withMessage(
        'The password must contain at least one capital letter',
        isStringContainsCapitalLetter,
      ),
      isStringContainsSmallLetter: helpers.withMessage(
        'The password must contain at least one small letter',
        isStringContainsSmallLetter,
      ),
    },
  }
})

const v$ = useVuelidate(rules, formData);

const togglePasswordVisability = () => {
  isPasswordShown.value = !isPasswordShown.value;
}

const toggleModalVisability = () => {
  isModalShown.value = !isModalShown.value;
}

const addLocationToInput = (location) => {
  formData.location = location;
  locationsSelect.value = [];
}

const submitForm = async () => {
  const result = await v$.value.$validate();
  if (result) {
    toggleModalVisability();
  } else {
    console.log('Something goes wrong!');
  }
}

const getLocales = async (query) => {
  try {
    const response = await fetch(GEO_DB_URL + query);
    const { data } = await response.json();
    const locationData = data.map(city => `${city.name}, ${city.country}`);
    locationsSelect.value = locationData;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

const getLocalesWithDebounce = debounce(getLocales, 400);
</script>

<style lang="scss" scoped>
</style>
