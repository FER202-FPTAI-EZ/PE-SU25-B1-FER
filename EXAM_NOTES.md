# Exam Notes — Base FER202

## 1. Chạy (2 terminal)
```bash
npx json-server --watch database.json --port 9999
```
```bash
npm start
```
API: http://localhost:9999 · App: http://localhost:3000

## 2. Checklist "0 điểm"
- [ ] JSON Server chạy cổng **9999**
- [ ] App chạy cổng **3000**
- [ ] Route trong `src/App.js` **copy-paste** từ đề, không tự gõ
- [ ] Không hard-code tên: luôn tra theo id
- [ ] Gọi đúng API đề ghi ở mục "Fetch data from"
- [ ] Trước khi nộp: **xóa `node_modules`**

## 3. 10 phút đầu giờ thi
1. Chép `database.json` của đề vào thư mục, chạy 2 terminal.
2. Mở `http://localhost:9999/<tên bảng>` để xem tên các field.
3. `src/provider/AppProvider.jsx`: bỏ comment, đổi thành các bảng tra cứu của đề (bảng chỉ để lấy tên).
4. `src/App.js`: sửa tên app, link header, bỏ comment **route mẫu** và copy-paste URL từ đề.
5. Mỗi câu hỏi: tạo 1 file trong `src/pages/` từ **khung trang** bên dưới.
6. So từng Figure trong đề.

## 4. Các file
| File | Dùng cho |
|---|---|
| `src/App.js` | Header + route mẫu. Thêm trang = import + thêm 1 `<Route>` |
| `src/provider/AppProvider.jsx` | Mẫu bảng tra cứu dùng chung + `reload()` |
| `src/utils/helpers.js` | `findById`, `getField`, `countWhere`, `sum`, `average`, `toPercent`, `toMoney`, `toDate`, `nextSort`, `sortIcon`, `sortByField` |
| `src/lib/axios.js` | `instance` với baseURL `http://localhost:9999/` |

Mọi trang theo cùng thứ tự: **1 data → 2 state → 3 helper → 4 lọc/sort → 5 render**.

**Khung trang** (tạo `src/pages/ListPage.jsx` rồi điền vào):
```jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { instance } from "../lib/axios";
import { useAppContext } from "../provider/AppProvider";
import { countWhere, getField, toPercent } from "../utils/helpers";

const ListPage = () => {
    const navigate = useNavigate();

    // 1. DATA
    const [items, setItems] = useState([]);
    useEffect(() => {
        instance.get("/classes").then((res) => setItems(res.data));
    }, []);

    // 2. STATE (bộ lọc, sort, checkbox...)
    const [keyword, setKeyword] = useState("");

    // 3. HELPER

    // 4. LỌC / SORT
    const rows = items.filter((item) => item.className.includes(keyword));

    // 5. RENDER
    return (
        <div>
            <h3 style={{ color: "#7c2d12", fontWeight: 700 }}>Title</h3>
            <Table hover style={{ verticalAlign: "middle" }}>
                <thead>
                    <tr style={{ "--bs-table-bg": "#7c2d12", "--bs-table-color": "#fff" }}>
                        {["No", "Name", "Action"].map((h) => <th key={h}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.className}</td>
                            <td>
                                <Button size="sm" onClick={() => navigate(`/classes/${item.id}`)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ListPage;
```
Xóa các import không dùng tới để hết cảnh báo.

## 5. Code mẫu copy-paste

**Lấy bảng dùng chung**
```jsx
const { subjects, students, reload } = useAppContext();
```

**Fetch bảng chính của trang**
```jsx
const [items, setItems] = useState([]);
useEffect(() => {
  instance.get("/items").then((res) => setItems(res.data));
}, []);
// có điều kiện: instance.get("/items", { params: { classId: id } })
```

**Tra tên theo id**
```jsx
getField(subjects, item.subjectId, "name")
```

**Lọc trên URL (`?status=OPEN`)**
```jsx
const [searchParams, setSearchParams] = useSearchParams();
const status = searchParams.get("status") || "ALL";
setSearchParams({ status: "OPEN" });   // hoặc setSearchParams({}) cho All
```

**id trên URL / chuyển trang**
```jsx
const { id } = useParams();
const navigate = useNavigate();
navigate(`/classes/${item.id}/attendance-summary`);
```

**Sort 3 trạng thái**
```jsx
const [sortOrder, setSortOrder] = useState("none");
const rows = sortByField(list, "price", sortOrder);
<th onClick={() => setSortOrder(nextSort(sortOrder))}>Price {sortIcon(sortOrder)}</th>
```

**Đếm / trung bình / %**
```jsx
countWhere(c.enrollments, (e) => e.status === "enrolled");
average(list, "attendanceRate");
toPercent(73.333)   // "73.3%"
```

**Badge / tô màu dòng**
```jsx
<Badge bg={ok ? "success" : "danger"}>{ok ? "OK" : "Warning"}</Badge>
<tr style={{ "--bs-table-bg": warning ? "#FFF5F5" : undefined }}>   // tô nền cả dòng
```

**Thêm / sửa / xóa**
```jsx
await instance.post("/items", newItem);
await instance.put(`/items/${id}`, { ...oldItem, ...form });
await instance.delete(`/items/${id}`);
reload();   // nếu bảng vừa sửa nằm trong AppProvider
```

**Icon** (bootstrap-icons): `<i className="bi bi-pencil"></i>` · `bi-trash` · `bi-plus-lg` · `bi-arrow-left`

## 6. Đề bắt dùng useReducer (ví dụ đề Hotel)
```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case "SET":    return action.payload;
    case "ADD":    return [...state, action.payload];
    case "UPDATE": return state.map((x) => (x.id === action.payload.id ? action.payload : x));
    case "DELETE": return state.filter((x) => x.id !== action.payload);
    default:       return state;
  }
};
const [rooms, dispatch] = useReducer(reducer, []);
dispatch({ type: "SET", payload: res.data });
```

## 7. Khi bị lỗi
- Trang trắng → F12 → Console, đọc dòng đỏ.
- Bảng rỗng → json-server có chạy không? Mở http://localhost:9999/classes.
- `Cannot read properties of undefined` → dữ liệu chưa tải xong, dùng `?.` (ví dụ `item?.name`).
- So sánh id không khớp → id là chuỗi `"1"` hay số `1`? Dùng `findById` (đã so dạng chuỗi).
- Route không khớp → so từng ký tự với đề (số nhiều/ít, dấu `-`, chữ hoa).
