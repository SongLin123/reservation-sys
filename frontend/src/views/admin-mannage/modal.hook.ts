import { FormInst, FormRules } from "naive-ui";

export const useModal = <T extends object>(initData:T,formRules:FormRules) => {
    const showModal = ref(false);
    const formRef = ref<FormInst | null>(null);
    const resData = reactive({...initData});
    const rules = formRules;
    

    const cancel = async () => {
        showModal.value = false;

        formRef.value?.restoreValidation();
        Object.assign(resData,{...initData})

    };

    const handlePost = async () => {
        return formRef.value?.validate((async (errors) => {
            if (errors) {
                console.log(errors);
            }
        }))
    };

    return {
        rules,
        showModal,
        formRef,
        resData,
        cancel,
        handlePost
    }
}