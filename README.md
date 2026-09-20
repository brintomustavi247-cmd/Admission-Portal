# ভার্সিটি ভর্তি তথ্য ও ক্যালকুলেটর ২০২৪-২৫ (University Admission Tracker)

একটি আধুনিক ও সম্পূর্ণ ফ্রন্টএন্ড ওয়েব অ্যাপ্লিকেশন, যা বাংলাদেশের সকল পাবলিক বিশ্ববিদ্যালয়, ইঞ্জিনিয়ারিং, মেডিকেল ও গুচ্ছ ভর্তি পরীক্ষার তথ্য, সময়সূচি এবং যোগ্যতা যাচাই ক্যালকুলেটর প্রদান করে।

---

## 💻 VS Code-এ যেভাবে রান করবেন (How to run in VS Code)

### ১. পূর্বশর্ত (Prerequisites):
- আপনার কম্পিউটারে **Node.js** (সংস্করণ ১৮ বা তার বেশি) ইনস্টল থাকতে হবে। না থাকলে [nodejs.org](https://nodejs.org) থেকে LTS সংস্করণ ডাউনলোড করে ইনস্টল করুন।
- **VS Code** (Visual Studio Code) ওপেন করুন।

### ২. প্রোজেক্ট ওপেন করা:
1. ডাউনলোড করা জিপ ফাইলটি আনজিপ করুন (Unzip)।
2. **VS Code** ওপেন করে `File` > `Open Folder...` এ গিয়ে এই প্রোজেক্ট ফোল্ডারটি সিলেক্ট করুন।
3. VS Code-এর টার্মিনাল ওপেন করতে কীবোর্ডে চাপুন: `Ctrl + ~` (Windows/Linux) অথবা `Cmd + ~` (Mac), অথবা মেনু থেকে `Terminal` > `New Terminal` নির্বাচন করুন।

### ৩. ডিপেনডেন্সি ইনস্টল করা (Install Dependencies):
টার্মিনালে নিচের কমান্ডটি লিখে Enter চাপুন:
```bash
npm install
```
*(এটি প্রোজেক্টের প্রয়োজনীয় সকল প্যাকেজ যেমন React, Vite, Tailwind CSS, Lucide Icons ইত্যাদি ইনস্টল করবে)*

### ৪. ডেভেলপমেন্ট সার্ভার চালু করা (Run Dev Server):
ইনস্টলেশন শেষ হলে টার্মিনালে লিখুন:
```bash
npm run dev
```

টার্মিনালে একটি লিংক দেখতে পাবেন (যেমন: `http://localhost:3000`)। 
কীবোর্ডে `Ctrl` (বা Mac-এ `Cmd`) চেপে ধরে লিংকে ক্লিক করুন অথবা আপনার ব্রাউজারে `http://localhost:3000` লিখে ভিজিট করুন।

---

## 🛠️ প্রোজেক্ট কমান্ডসমূহ (Available Scripts)

| কমান্ড | কাজ |
| :--- | :--- |
| `npm run dev` | লোকাল ডেভেলপমেন্ট সার্ভার চালু করে (Port 3000) |
| `npm run build` | প্রোডাকশনের জন্য অপ্টিমাইজড ফাইল বিল্ড করে (`dist/` ফোল্ডারে) |
| `npm run preview` | বিল্ড করা সাইট লোকালি প্রিভিউ দেখার জন্য |
| `npm run lint` | টাইপস্ক্রিপ্ট কোড যাচাই (Type-check) করার জন্য |

---

## 📂 ফাইল ও ফোল্ডার ডিরেক্টরি (Project Structure)

```text
├── .vscode/                 # VS Code সেটিংস ও এক্সটেনশন কনফিগ
├── public/                  # স্ট্যাটিক অ্যাসেটস
├── src/
│   ├── components/          # রিঅ্যাক্ট কম্পোনেন্টস
│   │   ├── EligibilityChecker.tsx  # বিষয়ভিত্তিক গ্রেড ও যোগ্যতা ক্যালকুলেটর
│   │   ├── Header.tsx              # হেডার, ডার্ক মোড ও সার্চ
│   │   ├── UniversityCard.tsx      # বিশ্ববিদ্যালয়ের কার্ড ও কাউন্টডাউন
│   │   ├── UniversityModal.tsx     # বিস্তারিত তথ্য ও সার্কুলার পপআপ
│   │   ├── FiltersBar.tsx          # ক্যাটাগরি ও স্ট্যাটাস ফিল্টার
│   │   ├── CalendarTimeline.tsx    # পরীক্ষার সময়সূচি ও ক্যালেন্ডার
│   │   └── ...
│   ├── data/
│   │   └── mockUniversities.ts     # সকল বিশ্ববিদ্যালয়ের বিস্তারিত তথ্য
│   ├── lib/
│   │   ├── banglaUtils.ts          # বাংলা সংখ্যা ও সময় ফরম্যাটার
│   │   └── sheetFetcher.ts         # গুগল শিট কানেক্টর (ঐচ্ছিক)
│   ├── types/
│   │   └── admission.ts            # টাইপস্ক্রিপ্ট ইন্টারফেস
│   ├── App.tsx                     # রুট কম্পোনেন্ট
│   ├── page.tsx                    # মূল ড্যাশবোর্ড পেজ
│   ├── main.tsx                    # রিঅ্যাক্ট এন্ট্রি পয়েন্ট
│   └── index.css                   # Tailwind CSS স্টাইল
├── index.html               # মূল HTML ডকুমেন্ট
├── package.json             # ডিপেনডেন্সি ও স্ক্রিপ্ট
├── tsconfig.json            # টাইপস্ক্রিপ্ট কনফিগারেশন
└── vite.config.ts           # Vite কনফিগারেশন
```

---

## 💡 সহায়ক VS Code এক্সটেনশন (Recommended Extensions)

VS Code-এ কাজ করার সুবিধার্থে নিচের এক্সটেনশনগুলো ইনস্টল করার পরামর্শ দেওয়া হচ্ছে:
1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - ক্লাসগুলোর অটো-সাজেশন দেয়।
2. **Prettier - Code formatter** (`esbenp.prettier-vscode`) - কোড সুন্দর করে সাজাতে।
3. **ESLint** (`dbaeumer.vscode-eslint`) - সিনট্যাক্স ও কোড কোয়ালিটি যাচাই করতে।
