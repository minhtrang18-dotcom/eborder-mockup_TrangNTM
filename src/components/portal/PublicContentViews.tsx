import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/StatusBadge';
import { BookOpen, HelpCircle, Phone, MessageSquare, Star, CheckCircle, FileText, Download } from 'lucide-react';

export const IntroView: React.FC = () => (
  <div className="space-y-5 max-w-4xl mx-auto">
    <div>
      <h2 className="text-[22px] font-bold text-[#1F2937]">
        Giới thiệu Cổng dịch vụ công cấp giấy thông hành Việt Nam - Lào
      </h2>
      <p className="text-[14px] text-[#6B7280] mt-1">
        Cổng thông tin phục vụ công dân hai nước trong công tác đi lại, thăm thân và giao thương biên giới
      </p>
    </div>

    <Card title="Cơ sở pháp lý & Hiệp định song phương">
      <div className="space-y-4 text-[14px] text-[#1F2937] leading-relaxed">
        <p>
          Căn cứ Hiệp định về Quy chế quản lý biên giới và cửa khẩu biên giới trên đất liền giữa Chính phủ nước Cộng hòa xã hội chủ nghĩa Việt Nam và Chính phủ nước Cộng hòa Dân chủ Nhân dân Lào;
        </p>
        <p>
          Căn cứ Nghị định của Chính phủ quy định về điều kiện, trình tự, thủ tục cấp giấy thông hành biên giới cho công dân Việt Nam sang các nước láng giềng.
        </p>
        <div className="p-4 bg-[#E8F3EE] rounded-lg border border-[#D9E1DC]">
          <h4 className="font-semibold text-[#006B3F] text-[15px] mb-1">
            Phạm vi áp dụng của Sổ thông hành biên giới:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-[13px] text-[#1F2937]">
            <li>Áp dụng cho công dân Việt Nam thường trú tại các tỉnh tiếp giáp biên giới với Lào.</li>
            <li>Có giá trị xuất nhập cảnh qua các cặp cửa khẩu quốc tế, cửa khẩu chính và cửa khẩu phụ được hai nước chỉ định.</li>
            <li>Thời hạn sử dụng tối đa 12 tháng và được tích hợp mã e-Pass điện tử quét tại làn e-Gate.</li>
          </ul>
        </div>
      </div>
    </Card>

    <Card title="Cơ quan thực hiện & Địa chỉ trụ sở tiếp nhận">
      <div className="space-y-3 text-[14px] text-[#1F2937]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#006B3F] flex items-center justify-center shrink-0 mt-0.5 font-bold">
            🏢
          </div>
          <div>
            <strong className="text-[15px] text-[#1F2937] block">Sở Cảnh sát Xuất nhập cảnh · Bộ Công an Lào</strong>
            <span className="text-[#6B7280] text-[13px]">
              Cơ quan thường trực chỉ đạo, thẩm định và cấp sổ thông hành biên giới quốc gia
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[13px]">
          <div className="p-3 bg-[#F5F7F6] rounded-lg border border-[#D9E1DC] space-y-1">
            <span className="font-semibold text-[#006B3F] block">Trụ sở chính (Thủ đô Viêng Chăn):</span>
            <p className="text-[#1F2937]">Đại lộ Lan Xang, Bản Hatsady, Quận Chanthabuly, Thủ đô Viêng Chăn, CHDCND Lào</p>
            <p className="text-[#6B7280]">Điện thoại: (+856) 21 212 520 | Giờ làm việc: 08:00 - 16:30 (Thứ 2 - Thứ 6)</p>
          </div>

          <div className="p-3 bg-[#F5F7F6] rounded-lg border border-[#D9E1DC] space-y-1">
            <span className="font-semibold text-[#006B3F] block">Văn phòng tiếp nhận phía Nam (Champasak):</span>
            <p className="text-[#1F2937]">Đường 13 Nam, Bản Phonsavanh, TP. Pakse, Tỉnh Champasak, CHDCND Lào</p>
            <p className="text-[#6B7280]">Điện thoại: (+856) 31 212 345 | Giờ làm việc: 08:00 - 16:30 (Thứ 2 - Thứ 6)</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

export const FaqView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Ai đủ điều kiện được cấp sổ thông hành biên giới Việt Nam - Lào?',
      a: 'Công dân Việt Nam có hộ khẩu thường trú hoặc đăng ký tạm trú hợp pháp tại các xã, phường, thị trấn thuộc các tỉnh giáp biên giới Lào (Điện Biên, Sơn La, Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị, Thừa Thiên Huế, Quảng Nam, Kon Tum) và cán bộ, công chức, công nhân làm việc tại khu kinh tế cửa khẩu.',
    },
    {
      q: 'Thời gian giải quyết cấp sổ thông hành mất bao lâu?',
      a: 'Đối với hồ sơ nộp trực tuyến qua Cổng dịch vụ công: thời hạn giải quyết là 03 ngày làm việc kể từ khi nhận đủ hồ sơ hợp lệ. Đối với giấy thông hành tạm thời khẩn cấp: thời gian xử lý trong vòng 24 giờ.',
    },
    {
      q: 'Lệ phí cấp sổ thông hành là bao nhiêu và nộp qua hình thức nào?',
      a: 'Lệ phí nhà nước quy định là 50.000 VNĐ / sổ. Người dân có thể thanh toán trực tuyến qua VNeID, quét mã VietQR, thẻ ngân hàng nội địa hoặc nộp tại bưu điện khi nhận kết quả.',
    },
    {
      q: 'Sổ thông hành biên giới có thể gia hạn được không?',
      a: 'Sổ thông hành biên giới Việt - Lào có giá trị không quá 12 tháng và KHÔNG ĐƯỢC GIA HẠN. Khi sổ hết hạn hoặc hết trang thị thực, công dân làm thủ tục "Cấp đổi sổ thông hành" trực tuyến.',
    },
  ];

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div>
        <h2 className="text-[22px] font-bold text-[#1F2937] flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#006B3F]" />
          Câu hỏi thường gặp (FAQ)
        </h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Giải đáp các vướng mắc phổ biến về điều kiện và thủ tục cấp giấy thông hành
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.q}
              className="bg-white border border-[#D9E1DC] rounded-lg overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-4 font-semibold text-[15px] text-[#1F2937] flex items-center justify-between hover:bg-[#F5F7F6]"
              >
                <span>{faq.q}</span>
                <span className="text-[#006B3F] text-lg font-bold">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-[14px] text-[#6B7280] border-t border-[#D9E1DC] bg-[#FFFFFF] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LawsView: React.FC = () => (
  <div className="space-y-5 max-w-4xl mx-auto">
    <div>
      <h2 className="text-[22px] font-bold text-[#1F2937] flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-[#006B3F]" />
        Văn bản quy phạm pháp luật
      </h2>
      <p className="text-[14px] text-[#6B7280] mt-1">
        Hệ thống văn bản chỉ đạo, hiệp ước và biểu mẫu hướng dẫn thực hiện thủ tục thông hành
      </p>
    </div>

    <Card noPadding>
      <div className="divide-y divide-[#D9E1DC]">
        {[
          {
            title: 'Hiệp định Quy chế Quản lý Biên giới trên đất liền Việt Nam - Lào',
            number: 'Hiệp định số 01/2016/HĐ-VNLAO',
            date: 'Ngày ban hành: 16/03/2016',
          },
          {
            title: 'Thông tư hướng dẫn cấp giấy phép và sổ thông hành biên giới',
            number: 'Thông tư số 14/2023/TT-BCA',
            date: 'Ngày ban hành: 12/04/2023',
          },
          {
            title: 'Quyết định công bố thủ tục hành chính dịch vụ công toàn trình cấp thông hành',
            number: 'Quyết định số 892/QĐ-BCA-XNC',
            date: 'Ngày ban hành: 05/01/2025',
          },
        ].map((item) => (
          <div key={item.number} className="p-4 flex items-center justify-between hover:bg-[#F5F7F6]">
            <div>
              <h4 className="text-[14px] font-semibold text-[#1F2937]">{item.title}</h4>
              <div className="text-[12px] text-[#6B7280] mt-0.5">
                {item.number} · {item.date}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4 text-[#1F2937]" />}
            >
              Tải PDF
            </Button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export const FeedbackView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h2 className="text-[22px] font-bold text-[#1F2937] flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#006B3F]" />
          Phản ánh - Kiến nghị của người dân
        </h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Gửi ý kiến đóng góp hoặc phản ánh về thái độ phục vụ, quy trình cấp giấy thông hành
        </p>
      </div>

      {submitted ? (
        <Card className="text-center p-8">
          <CheckCircle className="w-12 h-12 text-[#008A4B] mx-auto mb-3" />
          <h3 className="text-[18px] font-bold text-[#1F2937]">Đã gửi phản ánh thành công!</h3>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Bộ phận Tiếp công dân sẽ rà soát và phản hồi qua số điện thoại hoặc email trong vòng 02 ngày làm việc.
          </p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              Gửi phản ánh khác
            </Button>
          </div>
        </Card>
      ) : (
        <Card title="Biểu mẫu tiếp nhận phản ánh trực tuyến">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <Input label="Họ và tên người phản ánh" placeholder="VD: NGUYỄN VĂN AN" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Số điện thoại liên hệ" placeholder="VD: 0912 345 678" required />
              <Input label="Địa chỉ Email (nếu có)" placeholder="VD: an.nguyen@email.com" />
            </div>
            <Input
              label="Tiêu đề phản ánh / góp ý"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Góp ý về thời gian làm thủ tục tại Cửa khẩu Cầu Treo"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1F2937]">
                Nội dung chi tiết phản ánh *
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nêu rõ địa điểm, thời gian, cán bộ tiếp nhận hoặc nội dung vướng mắc..."
                className="w-full text-[14px] text-[#1F2937] placeholder:text-[#6B7280] bg-[#FFFFFF] border border-[#D9E1DC] rounded px-3 py-2 outline-none focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" type="submit">
                Gửi phản ánh - kiến nghị
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export const RatingView: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState(false);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="text-[22px] font-bold text-[#1F2937] flex items-center gap-2">
          <Star className="w-6 h-6 text-[#D6A928]" />
          Đánh giá mức độ hài lòng dịch vụ công
        </h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Khảo sát sự hài lòng của công dân đối với dịch vụ cấp giấy thông hành biên giới
        </p>
      </div>

      <Card className="text-center p-6 space-y-4">
        <h3 className="text-[16px] font-semibold text-[#1F2937]">
          Bạn đánh giá thế nào về tốc độ xử lý và sự thuận tiện của Cổng dịch vụ công?
        </h3>

        <div className="flex justify-center items-center gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                className={`w-9 h-9 ${
                  star <= rating
                    ? 'text-[#D6A928] fill-[#D6A928]'
                    : 'text-[#D9E1DC]'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="text-[14px] font-medium text-[#006B3F]">
          {rating === 5 && 'Rất hài lòng (5/5 sao)'}
          {rating === 4 && 'Hài lòng (4/5 sao)'}
          {rating === 3 && 'Bình thường (3/5 sao)'}
          {rating === 2 && 'Chưa hài lòng (2/5 sao)'}
          {rating === 1 && 'Rất không hài lòng (1/5 sao)'}
        </div>

        {rated ? (
          <div className="p-3 bg-[#E8F3EE] rounded border border-[#D9E1DC] text-[#008A4B] text-[13px] font-medium">
            Cảm ơn bạn đã đóng góp ý kiến đánh giá quý báu!
          </div>
        ) : (
          <Button variant="primary" onClick={() => setRated(true)}>
            Gửi đánh giá
          </Button>
        )}
      </Card>
    </div>
  );
};
