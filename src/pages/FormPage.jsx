import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { instance } from "../lib/axios";
import { useAppContext } from "../provider/AppProvider";

// MẪU FORM THÊM / SỬA (dùng chung 1 file)
//   /classes/new      -> không có id -> THÊM (POST)
//   /classes/:id/edit -> có id       -> SỬA  (PUT)
const FormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { subjects } = useAppContext();

    // ---------- 1. STATE ----------
    // Giá trị các ô (ĐỔI: field theo đề)
    const [form, setForm] = useState({
        className: "",
        subjectId: "",
        lecturerName: "",
        status: "OPEN",
    });
    const [errors, setErrors] = useState({});  // lỗi của từng ô
    const [original, setOriginal] = useState(null);

    // Sửa: tải dữ liệu cũ đổ vào form
    useEffect(() => {
        if (!isEdit) return;
        instance.get(`/classes/${id}`).then((res) => {
            setOriginal(res.data);
            setForm(res.data);
        });
    }, [id, isEdit]);

    // 1 hàm cho mọi ô: dựa vào thuộc tính name của ô
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ---------- 2. KIỂM TRA DỮ LIỆU — ĐỔI: luật theo đề ----------
    const validate = () => {
        const err = {};
        if (!form.className.trim()) err.className = "Class name is required";
        if (!form.subjectId) err.subjectId = "Please choose a subject";
        if (!form.lecturerName.trim()) err.lecturerName = "Lecturer is required";
        // Ví dụ khác:
        // if (Number(form.price) <= 0) err.price = "Price must be > 0";
        // if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
        // if (new Date(form.date) > new Date()) err.date = "Date cannot be in the future";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // ---------- 3. LƯU ----------
    const handleSubmit = async (e) => {
        e.preventDefault();               // không cho trang reload
        if (!validate()) return;

        if (isEdit) {
            // Giữ lại các field form không có (ví dụ enrollments)
            await instance.put(`/classes/${id}`, { ...original, ...form });
        } else {
            await instance.post(`/classes`, { ...form, enrollments: [] });
        }
        alert(isEdit ? "Updated!" : "Created!");
        navigate(`/classes`);
    };

    // ---------- 4. RENDER ----------
    return (
        <div style={{ maxWidth: 560 }}>
            <Button variant="link" style={{ color: "#c2410c", padding: 0, marginBottom: 12, textDecoration: "none", fontWeight: 600 }} onClick={() => navigate(`/classes`)}>
                ← Back
            </Button>
            <h3 style={{ color: "#7c2d12", fontWeight: 700 }}>{isEdit ? "Edit Class" : "Add Class"}</h3>

            <Form style={{ background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }} onSubmit={handleSubmit} noValidate>
                {/* Ô chữ */}
                <Form.Group style={{ marginBottom: 16 }}>
                    <Form.Label>Class Name</Form.Label>
                    <Form.Control name="className" value={form.className}
                        onChange={handleChange} isInvalid={!!errors.className} />
                    <Form.Control.Feedback type="invalid">{errors.className}</Form.Control.Feedback>
                </Form.Group>

                {/* Select lấy từ API */}
                <Form.Group style={{ marginBottom: 16 }}>
                    <Form.Label>Subject</Form.Label>
                    <Form.Select name="subjectId" value={form.subjectId}
                        onChange={handleChange} isInvalid={!!errors.subjectId}>
                        <option value="">-- Choose subject --</option>
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.subjectId}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group style={{ marginBottom: 16 }}>
                    <Form.Label>Lecturer</Form.Label>
                    <Form.Control name="lecturerName" value={form.lecturerName}
                        onChange={handleChange} isInvalid={!!errors.lecturerName} />
                    <Form.Control.Feedback type="invalid">{errors.lecturerName}</Form.Control.Feedback>
                </Form.Group>

                {/* Radio */}
                <Form.Group style={{ marginBottom: 16 }}>
                    <Form.Label style={{ display: "block" }}>Status</Form.Label>
                    {["OPEN", "CLOSED"].map((v) => (
                        <Form.Check key={v} inline type="radio" name="status" id={`form-${v}`}
                            label={v} value={v} checked={form.status === v} onChange={handleChange} />
                    ))}
                </Form.Group>

                {/* Mẫu thêm khi đề cần:
                <Form.Control type="number" name="price" ... />
                <Form.Control type="date"   name="date"  ... />
                <Form.Control type="email"  name="email" ... />
                <Form.Check type="checkbox" name="active" checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Nhớ: ô number gửi lên dạng chuỗi -> Number(form.price) trước khi POST */}

                <Button type="submit" style={{ background: "#c2410c", borderColor: "#c2410c" }}>{isEdit ? "Update" : "Create"}</Button>
            </Form>
        </div>
    );
};

export default FormPage;
