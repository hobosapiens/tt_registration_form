<template>
  <div
    v-if="isOpen"
    class="root"
  >
    <teleport to="body">
      <div class="modal overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              @click="$emit('toggle')"
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
            <div class="p-6 md:p-8 text-center mb-5">
              <h2 class="mb-5 mt-5 text-2xl font-normal text-center text-gray-500 dark:text-gray-400">
                Submitted user data:
              </h2>
              <dl class="max-w-md text-gray-900 dark:text-white divide-y divide-gray-200 dark:divide-gray-400">
                  <div
                    v-for="field in FORM_FIELDS"
                    :key="field"
                    class="flex py-3"
                  >
                      <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400 mr-4">{{ capitalizeFirstLetter(field) }}:</dt>
                      <dd class="text-lg font-semibold text-left">{{ props.content[field] }}</dd>
                  </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

defineEmits('toggle');
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  }
});

const FORM_FIELDS = [
  'name',
  'email',
  'location',
  'password',
]

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped>
.root {
  position: relative;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .85);
  width: 100%;
  height: 100%;
}
</style>
