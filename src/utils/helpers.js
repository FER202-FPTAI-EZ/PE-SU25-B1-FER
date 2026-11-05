// Các hàm nhỏ dùng lại ở mọi đề. Import: import { findById, toPercent } from "../utils/helpers";

// Tìm 1 phần tử theo id (so sánh dạng chuỗi để "1" và 1 vẫn khớp)
export const findById = (list, id) =>
    list.find((item) => String(item.id) === String(id));

// Lấy 1 trường của phần tử theo id. Ví dụ: getField(subjects, c.subjectId, "name")
export const getField = (list, id, field) => findById(list, id)?.[field] ?? "";

// Đếm số phần tử thỏa điều kiện. Ví dụ: countWhere(c.enrollments, (e) => e.status === "enrolled")
export const countWhere = (list = [], condition) => list.filter(condition).length;

// Tổng 1 trường. Ví dụ: sum(rooms, "price")
export const sum = (list = [], field) =>
    list.reduce((total, item) => total + Number(item[field] || 0), 0);

// Trung bình 1 trường (list rỗng -> 0)
export const average = (list = [], field) =>
    list.length === 0 ? 0 : sum(list, field) / list.length;

// 90 -> "90.0%"
export const toPercent = (value, digits = 1) => Number(value).toFixed(digits) + "%";

// 1500000 -> "1,500,000 VND"
export const toMoney = (value, unit = "VND") =>
    Number(value).toLocaleString("en-US") + " " + unit;

// "2026-01-06T00:00:00.000Z" -> "06/01/2026"
export const toDate = (value) => {
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
};

// Sort 3 trạng thái: "none" -> "asc" -> "desc" -> "none"
export const nextSort = (order) =>
    order === "none" ? "asc" : order === "asc" ? "desc" : "none";

export const sortIcon = (order) =>
    order === "asc" ? "↑" : order === "desc" ? "↓" : "↕";

// Sort theo 1 trường, trả về mảng MỚI (không sửa mảng gốc)
export const sortByField = (list, field, order) => {
    if (order === "none") return list;
    return [...list].sort((a, b) => {
        const x = a[field];
        const y = b[field];
        // Chữ thì so sánh chữ, số thì trừ
        const result = typeof x === "string" ? x.localeCompare(y) : x - y;
        return order === "asc" ? result : -result;
    });
};
