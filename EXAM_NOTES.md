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
3. `src/provider/AppProvider.jsx`: đổi `subjects`, `students` thành các bảng tra cứu của đề (bảng chỉ để lấy tên).
4. `src/App.js`: sửa tên app, link header, **URL các route**.
5. Mỗi câu hỏi: mở trang mẫu gần giống nhất → sửa tên bảng, tên field (tìm chữ `classes`, `subjects`...) → sửa cột bảng.
6. Xóa các khối `TÙY CHỌN` đề không hỏi (nút Add/Edit/Delete, ô tìm kiếm...).
7. So từng Figure trong đề.

## 4. Các file
| File | Dùng cho |
|---|---|
| `src/App.js` | Header + tất cả route. Thêm trang = thêm 1 `<Route>` |
| `src/provider/AppProvider.jsx` | Bảng tra cứu dùng chung + `reload()` |
| `src/utils/helpers.js` | `findById`, `getField`, `countWhere`, `sum`, `average`, `toPercent`, `toMoney`, `toDate`, `nextSort`, `sortIcon`, `sortByField` |
| `src/pages/ListPage.jsx` | Danh sách: dropdown, radio trên URL, tìm kiếm, badge, chuyển trang, xóa |
| `src/pages/DetailPage.jsx` | Chi tiết: `useParams`, thẻ thống kê, sort 3 trạng thái, checkbox lọc |
| `src/pages/FormPage.jsx` | Thêm / sửa chung 1 file, kiểm tra dữ liệu, POST / PUT |
| `src/index.css` | Màu: đổi `--main`, `--dark` |
| `examples/paper-1/` | Lời giải đầy đủ paper-1 để tham khảo |

Mọi trang theo cùng thứ tự: **1 data → 2 state → 3 helper → 4 lọc/sort → 5 render**.

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
<tr className={warning ? "row-warning" : ""}>
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
