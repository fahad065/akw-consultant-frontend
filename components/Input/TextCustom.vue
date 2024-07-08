<template lang="">
  <div class="simple__input_wrap">
    <p v-if="label.length" class="text-[#000]">{{ label }}</p>
    <InputText
      :readonly="readonly"
      v-slot:disabled
      :required="required"
      :class="{ 'error': errors[name],'bg-gray-200':readonly }"
      :type="type"
      variant="outlined"
      :placeholder="placeholder"
      :name="name"
      :min="min"
      :step="step"
      v-model="value"
      class="!h-10 !border-xl"
    />
    <i :class="iconClasses" class="blue"> </i>
    <small :id="`${name}-help`" class="p-error">
      {{ errors[name] && `${label} is required` }}
    </small>
  </div>
</template>
<script>
export default {
  name: 'TextInput',
  props: {
    label: {
      default: '',
      type: String
    },
    required: {
      default: false,
      type: Boolean
    },
    placeholder: {
      default: 'Enter your text',
      type: String
    },
    modelValue: {
      default: ''
    },
    type: {
      default: 'text',
      type: String
    },
    errors: {
      default: {},
      type: Object
    },
    min: {
      required: false
    },
    step: {
      required: false
    },

    name: {
      default: '',
      type: String
    },

    textAsIcon: {
      default: '',
      type: String
    },

    icon: {
      default: '',
      type: String
    },
    readonly: {
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    iconClasses() {
      return {
        [this.icon]: !!this.icon
      };
    }
  }
};
</script>
<style>
.simple__input_wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px;
}

.simple__input_wrap i,
.simple__input_wrap .text {
  position: absolute;
  right: 15px;
  top: 30px;
  padding: 9px 8px;
  transition: 0.3s;
}

.simple__input_wrap p {
  font-size: 0.85rem;
  font-weight: 300;
  padding-bottom: 0.4rem;
  position: relative;
}

.simple__input_wrap .p-inputtext {
  font-size: 0.9rem;
  padding: 0.5rem;
  background: transparent;
  width: 100%;
}

.p-multiselect .p-multiselect-label {
  font-size: 0.9rem;
  padding: 0.5rem;
  background: transparent;
  width: 100%;
}

.blue {
  color: #4263EB;
  font-size: 20px;
}
</style>
