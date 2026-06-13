# HCM202 - Web ôn thi Tư tưởng Hồ Chí Minh & Portfolio Clones

Dự án này bao gồm ứng dụng web ôn trắc nghiệm môn **Tư tưởng Hồ Chí Minh (HCM202)** được thiết kế giao diện theo phong cách **Quizlet**, cùng với các trang giao diện clone (LinkedIn, GitHub) và bộ công cụ tự động trích xuất, phân tích câu hỏi từ file tài liệu `.docx`.

---

## 🚀 Tính năng chính

### 1. 📝 Ôn thi trắc nghiệm HCM202 (Quizlet Style)
* File chính: [index.html](file:///d:/AntiGravity/HCM202/index.html)
* **Giao diện hiện đại**: Thiết kế tối giản, trực quan, hỗ trợ cả giao diện Sáng (Light Mode) và Tối (Dark Mode).
* **Câu hỏi phong phú**: Bộ dữ liệu câu hỏi được trích xuất trực tiếp từ ngân hàng đề thi.
* **Tương tác trực quan**: 
  * Chọn đáp án có phản hồi Đúng/Sai ngay lập tức bằng màu sắc sinh động.
  * Theo dõi tiến độ làm bài, tính điểm số trực tiếp.
  * Nút xem đáp án và chuyển câu dễ dàng.

### 2. 🛠️ Bộ công cụ Trích xuất & Phân tích dữ liệu (Python)
* **Trích xuất tài liệu**: [extract_hcm.py](file:///d:/AntiGravity/HCM202/extract_hcm.py) – Tự động đọc file tài liệu Word `hcm.docx`, lọc bỏ mã XML dư thừa và xuất ra file văn bản thô `hcm_raw.txt`.
* **Phần tích dữ liệu câu hỏi**: [parse_hcm.py](file:///d:/AntiGravity/HCM202/parse_hcm.py) – Đọc file `hcm_raw.txt`, tự động gom cụm câu hỏi, các tùy chọn A-B-C-D cùng đáp án đúng, sau đó chuẩn hóa và lưu thành định dạng JSON [hcm_questions.json](file:///d:/AntiGravity/HCM202/hcm_questions.json).

### 3. 🖥️ Các trang Giao diện Clone khác
* **LinkedIn Clone**: [linkedin.html](file:///d:/AntiGravity/HCM202/linkedin.html) – Trang giao diện thiết kế theo phong cách mạng xã hội nghề nghiệp LinkedIn.
* **GitHub Profile Clone**: [github.html](file:///d:/AntiGravity/HCM202/github.html) – Giao diện trang cá nhân GitHub (mock profile) hỗ trợ Dark/Light mode và cấu hình TailwindCSS.

---

## 📁 Cấu trúc thư mục

```text
HCM202/
├── .gitignore             # Danh sách bỏ qua các tệp tạm thời, cache của Python
├── README.md              # Tài liệu hướng dẫn dự án (này)
│
├── index.html             # Trang web trắc nghiệm ôn tập HCM202 (giao diện Quizlet)
├── hcm_data.js            # Chứa bộ dữ liệu câu hỏi dạng Javascript để nhúng vào trang web
├── hcm_questions.json     # Bộ câu hỏi đã được parse dưới dạng JSON sạch
│
├── linkedin.html          # Bản clone giao diện LinkedIn
├── github.html            # Bản clone giao diện cá nhân GitHub
│
├── extract_hcm.py         # Script Python trích xuất văn bản từ hcm.docx
├── parse_hcm.py           # Script Python phân tích cú pháp câu hỏi thành JSON
└── hcm_raw.txt            # Dữ liệu văn bản thô trích xuất từ tài liệu
```

---

## 🛠️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Xem giao diện trực tiếp trên trình duyệt
Bạn chỉ cần mở trực tiếp các file `.html` bằng trình duyệt web của mình (hoặc sử dụng Extension Live Server trên VS Code để có trải nghiệm tốt nhất):
* Nhấp đúp vào [index.html](file:///d:/AntiGravity/HCM202/index.html) để ôn tập trắc nghiệm.
* Nhấp đúp vào [linkedin.html](file:///d:/AntiGravity/HCM202/linkedin.html) để xem giao diện LinkedIn Clone.
* Nhấp đúp vào [github.html](file:///d:/AntiGravity/HCM202/github.html) để xem giao diện GitHub Clone.

### 2. Sử dụng công cụ trích xuất dữ liệu (Python)
Để chạy các kịch bản python, bạn cần cài đặt thư viện cần thiết và chạy lệnh:
```bash
# Trích xuất dữ liệu từ file docx ban đầu
python extract_hcm.py

# Parse dữ liệu thô sang JSON câu hỏi
python parse_hcm.py
```
*(Lưu ý: Bạn cần chỉnh sửa lại đường dẫn file docx trong mã nguồn Python cho phù hợp với máy tính của mình)*

---

## 📝 Giấy phép
Dự án được xây dựng phục vụ cho mục đích học tập cá nhân môn HCM202.
