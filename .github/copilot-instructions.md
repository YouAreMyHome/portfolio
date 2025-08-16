## Hướng dẫn Copilot / Trợ lý tự động cho repository

Mục tiêu: Nhỏ gọn, rõ ràng để bạn yên tâm khi cho phép Copilot hoặc trợ lý tự động (assistant) thực hiện thay đổi trong repo.

1. Phạm vi hành động

- Chỉ thực hiện thay đổi khi có yêu cầu rõ ràng từ chủ dự án hoặc khi đang xử lý một issue/feature đã được ủy quyền.
- Không tự ý chỉnh sửa nội dung cá nhân, mô tả dự án, thông tin liên hệ hoặc bất kỳ dữ liệu nhạy cảm nào.

2. Nhánh và PR

- Mọi thay đổi phải được tạo trên một nhánh riêng (ví dụ: `copilot/<mô-tả>`).
- Copilot chỉ được phép tạo patch hoặc PR; merge phải do bạn hoặc người được ủy quyền thực hiện.

3. Không commit secrets

- Tuyệt đối không commit token, khoá API, mật khẩu hoặc file chứa secrets. Nếu cần sử dụng secrets, cung cấp hướng dẫn để bạn tự thêm vào GitHub Secrets hoặc `.env` local.

4. Minh bạch thay đổi

- Mỗi PR/patch kèm mô tả ngắn: mục tiêu, file thay đổi, ảnh hưởng, cách rollback.
- Kèm checklist run: build, lint, tests (nếu có) và trạng thái PASS/FAIL.

5. Kiểm tra cơ bản trước commit

- Nếu dự án có script `build`/`lint`/`test` trong `package.json` (hoặc tương đương), chạy các bước cơ bản và báo kết quả.
- Nếu lỗi xuất hiện, sửa tối đa 3 lần; nếu vẫn lỗi, dừng và yêu cầu hướng dẫn.

6. Bảo toàn nội dung người dùng

- Tránh sửa nội dung văn bản do chủ sở hữu cung cấp. Mọi đề xuất sửa nội dung phải ở dạng patch/PR rõ ràng để bạn review.

7. Quy trình khẩn cấp

- Nếu phát hiện dữ liệu nhạy cảm đã bị commit: thông báo ngay, hướng dẫn xóa lịch sử (ví dụ dùng `git filter-repo` hoặc revert/force-push theo chỉ dẫn của bạn) và không tiếp tục push các thay đổi khác.

8. Tùy chọn ủy quyền (chọn 1 khi ủy quyền)

- Patch-only: Copilot chỉ tạo patch/PR, không push. Bạn apply/merge thủ công.
- Branch+PR: Copilot tạo branch và PR tự động; merge vẫn do bạn/được ủy quyền.
- Full automation (khuyến nghị: chỉ dùng với project tin cậy): Copilot có thể tạo branch, PR và tự merge khi mọi checks PASS — cần cấu hình rõ và bạn phải bật tính năng này.

9. Ghi chú kỹ thuật ngắn

- Nếu cần thay đổi cấu hình deploy (ví dụ `vercel.json`, workflow CI), Copilot sẽ: 1) tạo PR với giải thích; 2) liệt kê rủi ro; 3) không merge nếu thay đổi yêu cầu credential.

10. Liên hệ và rollback

- Mỗi PR/patch kèm hướng dẫn rollback đơn giản (ví dụ: `git revert` commit hoặc huỷ PR).
