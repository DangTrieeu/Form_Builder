import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useFormStore = create(
    immer((set, get) => (
        {
            formConfig:{
                title:"Mẫu không có tiêu đề",
                description:"",
            },
            fields:[],

            addField: (type) =>
                set((state) => {
                    state.fields.push({
                        id: Date.now(),
                        type,
                        label: "Câu hỏi mới",
                        required: false,
                        options: [],
                    });
                }),
            updateField: (id, updates) =>
                set((state) => {
                    const field = state.fields.find((f) => f.id === id);
                    if (field) Object.assign(field, updates);
                }),
            removeField: (id) =>
                set((state) => {
                    state.fields = state.fields.filter((f) => f.id !== id);
                }),
            updateFormConfig: (updates) =>
                set((state) => {
                    Object.assign(state.formConfig, updates);
                }),
        }
    ))
);

export { useFormStore };
