import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const useFormStore = create(
    immer((set, get) => ({
        // Form đang thiết kế
        formConfig: {
            title: "Mẫu không có tiêu đề",
            description: "",
        },
        fields: [],

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

        // ==========================================
        // Phần runtime
        // ==========================================
        forms: [],
        form: null,
        answers: {},
        submitted: false,
        loading: false,
        error: null,

        fetchForms: async () => {
            set({ loading: true, error: null });
            try {
                const q = query(
                    collection(db, "forms"),
                    orderBy("createdAt",
                        "desc")
                );
                const snap = await getDocs(q);
                const list = snap.docs.map(
                    (d) => (
                        { id: d.id, ...d.data() }
                    )
                );
                set({ forms: list, loading: false });
            } catch (e) {
                set({ error: e?.message || "Không tải được danh sách", loading: false });
            }
        },

        fetchForm: async (id) => {
            set({ loading: true, error: null });
            try {
                const ref = doc(
                    db, "forms", id)
                ;
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    set({ error: "Form không tồn tại", form: null });
                } else {
                    set({ form: snap.data() });
                }
            } catch (e) {
                set({ error: e?.message || "Lỗi tải form" });
            } finally {
                set({ loading: false });
            }
        },

        setAnswer: (fieldId, value) =>
            set((state) => {
                state.answers[fieldId] = value;
            }),

        submitForm: () => set({ submitted: true }),
        resetForm: () => set({ answers: {}, submitted: false }),
    }))
);

export { useFormStore };
