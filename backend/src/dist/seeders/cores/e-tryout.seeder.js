import { v4 as uuidv4 } from "uuid";
export default {
    async up(queryInterface, sequelize) {
        const tryout_sessions = [
            {
                tryoutId: uuidv4(),
                code: "TRYOUT_EMOTIONAL_QUOTIENT",
                description: "Emotional Quotient (EQ) adalah kemampuan seseorang dalam memahami, mengelola, dan mengekspresikan emosinya secara positif serta berempati terhadap orang lain.\nPelatihan ini dirancang untuk meningkatkan kesadaran diri, mengelola emosi secara sehat, membangun hubungan interpersonal yang kuat, dan meningkatkan kemampuan beradaptasi di lingkungan kerja.",
                title: "Tryout Emotional Quotient",
                order: 1,
                data: JSON.stringify({
                    icon: " ",
                    type: "multiple-choice",
                    duration: 3600000,
                    telegram: {
                        shortId: 4,
                        instruction: "Please follow the current instruction:",
                    },
                    instruction: `<div style="max-width: 700px; margin: 40px auto; background: #121212; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: white; text-align: center; border-bottom: 3px solid black; padding-bottom: 10px;">Panduan Pengerjaan Soal Cyber Security</h2>
            <h3 style="color: white; margin-top: 20px;"><strong>Durasi:</strong> 1 jam</h3>
            <h3 style="color: white;"><strong>Jumlah Soal:</strong> 20 (Pilihan Ganda)</h3>
            <h3 style="color: white; border-bottom: 2px solid #ddd; padding-bottom: 5px;">Petunjuk Pengerjaan:</h3>
            <ol style="color: white; font-size: 16px; line-height: 1.6; padding-left: 20px; list-style-type: disc;">
              <li>Bacalah setiap soal dengan cermat sebelum menjawab.</li>
              <li>Pilihlah jawaban yang paling tepat dari <strong>a, b, c, d, atau e</strong>.</li>
              <li>Tidak diperkenankan menggunakan catatan atau alat bantu lainnya.</li>
              <li>Jawaban yang benar akan diberikan <strong>1 poin</strong>, tidak ada pengurangan poin untuk jawaban salah.</li>
              <li>Jika waktu habis, jawaban yang sudah terisi akan dikumpulkan secara otomatis.</li>
            </ol>
          </div>`,
                }),
                tag: "phincon",
                active: 1,
                createdAt: "1/5/2025 11:32:54",
                updatedAt: "1/5/2025 11:32:54",
            },
            {
                tryoutId: uuidv4(),
                code: "ISMS-30_CSP_BEGINNER",
                description: "Content Security Policy (Beginner) - Phincon",
                title: "Content Security Policy (Beginner) - Phincon",
                order: 1,
                data: JSON.stringify({
                    icon: " ",
                    type: "multiple-choice",
                    duration: 3600000,
                    telegram: {
                        shortId: 2,
                        instruction: "Please follow the current instruction:",
                    },
                    instruction: `<div style="max-width: 700px; margin: 40px auto; background: #121212; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: white; text-align: center; border-bottom: 3px solid black; padding-bottom: 10px;">Panduan Pengerjaan Soal Cyber Security</h2>
            <h3 style="color: white; margin-top: 20px;"><strong>Durasi:</strong> 1 jam</h3>
            <h3 style="color: white;"><strong>Jumlah Soal:</strong> 20 (Pilihan Ganda)</h3>
            <h3 style="color: white; border-bottom: 2px solid #ddd; padding-bottom: 5px;">Petunjuk Pengerjaan:</h3>
            <ol style="color: white; font-size: 16px; line-height: 1.6; padding-left: 20px; list-style-type: disc;">
              <li>Bacalah setiap soal dengan cermat sebelum menjawab.</li>
              <li>Pilihlah jawaban yang paling tepat dari <strong>a, b, c, d, atau e</strong>.</li>
              <li>Tidak diperkenankan menggunakan catatan atau alat bantu lainnya.</li>
              <li>Jawaban yang benar akan diberikan <strong>1 poin</strong>, tidak ada pengurangan poin untuk jawaban salah.</li>
              <li>Jika waktu habis, jawaban yang sudah terisi akan dikumpulkan secara otomatis.</li>
            </ol>
          </div>`,
                }),
                tag: "phincon",
                active: 1,
                createdAt: "1/5/2025 11:32:54",
                updatedAt: "1/5/2025 11:32:54",
            },
            {
                tryoutId: uuidv4(),
                code: "TRYOUT_CORPORATE_CHAMPION_MENTALITY",
                description: "Pelatihan ini merupakan bagian dari program pelatihan wajib (mandatory training) yang dikelola oleh HR Training Phintraco Group, induk perusahaan Phincon. Modul ini dirancang untuk membentuk pola pikir dan sikap kerja yang unggul di lingkungan korporat, dengan fokus pada kepemimpinan, ketahanan mental, dan orientasi pada kinerja tinggi.​",
                title: "Tryout Corporate Champion Mentality",
                order: 1,
                data: JSON.stringify({
                    icon: " ",
                    type: "multiple-choice",
                    duration: 3600000,
                    telegram: {
                        shortId: 3,
                        instruction: "Please follow the current instruction:",
                    },
                    instruction: `<div style="max-width: 700px; margin: 40px auto; background: #121212; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: white; text-align: center; border-bottom: 3px solid black; padding-bottom: 10px;">Panduan Pengerjaan Soal Cyber Security</h2>
            <h3 style="color: white; margin-top: 20px;"><strong>Durasi:</strong> 1 jam</h3>
            <h3 style="color: white;"><strong>Jumlah Soal:</strong> 20 (Pilihan Ganda)</h3>
            <h3 style="color: white; border-bottom: 2px solid #ddd; padding-bottom: 5px;">Petunjuk Pengerjaan:</h3>
            <ol style="color: white; font-size: 16px; line-height: 1.6; padding-left: 20px; list-style-type: disc;">
              <li>Bacalah setiap soal dengan cermat sebelum menjawab.</li>
              <li>Pilihlah jawaban yang paling tepat dari <strong>a, b, c, d, atau e</strong>.</li>
              <li>Tidak diperkenankan menggunakan catatan atau alat bantu lainnya.</li>
              <li>Jawaban yang benar akan diberikan <strong>1 poin</strong>, tidak ada pengurangan poin untuk jawaban salah.</li>
              <li>Jika waktu habis, jawaban yang sudah terisi akan dikumpulkan secara otomatis.</li>
            </ol>
          </div>`,
                }),
                tag: "phincon",
                active: 1,
                createdAt: "1/5/2025 11:32:54",
                updatedAt: "1/5/2025 11:32:54",
            },
            {
                tryoutId: uuidv4(),
                code: "TRYOUT_ANGER_MANAGEMENT",
                description: "Anger Management adalah proses pembelajaran teknik-teknik untuk mengidentifikasi pemicu kemarahan, mengelola reaksi emosional, dan mengekspresikan kemarahan secara sehat dan konstruktif.\nPelatihan ini bertujuan membantu individu memahami akar emosinya, serta mengembangkan kontrol diri agar mampu menjaga hubungan profesional dan pribadi tetap positif.",
                title: "Tryout Anger Management",
                order: 1,
                data: JSON.stringify({
                    icon: " ",
                    type: "multiple-choice",
                }),
            },
        ];
        await queryInterface.bulkInsert("tryout_sections", tryout_sessions);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("tryout_sections", {});
    },
};
