# ระบบ Pub/Sub to Webhook Service

ระบบ Pub/Sub (Publisher/Subscriber) แบบเรียลไทม์ที่ส่งข้อมูลผ่าน Webhook พร้อมการใช้ JWT signing เพื่อความปลอดภัย เหมาะสำหรับการทดสอบทักษะนักพัฒนา Backend
## 🧠 การใช้งาน AI ในกระบวนการพัฒนา (AI in Development)

ในกระบวนการพัฒนาโปรเจกต์นี้ ผมได้ใช้เครื่องมือ AI มาช่วยในหลายส่วน เช่น

- **AI เป็นที่ปรึกษา**: ใช้ช่วย brainstorm โครงสร้างระบบ และวาง flow ของ pub/sub ที่เหมาะสมกับ fastify
- **ช่วยตรวจสอบ syntax และ best practices**: โดยเฉพาะเรื่อง async/await, redis cache, และ error handling
- **ช่วยอธิบาย edge cases ที่ควรคำนึงถึง**
- **ช่วยปรับปรุงข้อความใน README ให้ชัดเจน อ่านง่าย และดูเป็นมืออาชีพมากขึ้น**
- **ปรึกษาการจัด structure ของ front-end** ให้ดูน่าสนใจ เหมาะกับส่งงาน
  
ในโปรเจกต์นี้ ผมเลือกใช้เครื่องมือ AI หลายตัว เพื่อช่วยเสริมประสิทธิภาพในการพัฒนาและลดเวลาในการลองผิดลองถูก โดยแต่ละเครื่องมือมีจุดเด่นที่แตกต่างกัน ดังนี้

## 🗂️ เครื่องมือที่ใช้
| เครื่องมือ | ใช้ทำอะไร |
|------------|-----------|
| ChatGPT (โดย OpenAI) | ใช้ตอนเริ่มต้นโปรเจกต์เพื่อวางแผน ออกแบบโครงสร้างระบบ และขอคำอธิบายเชิงลึกในภาษาที่เข้าใจง่าย |
| Qwen AI (โดย Alibaba) | ใช้ช่วยวิเคราะห์ error message, debug ปัญหา runtime และ refactor code โดยเฉพาะฝั่ง TypeScript/Python |
| Grok AI (ของ Elon Musk / xAI) | ใช้ในการออกแบบ UI หน้าเว็บ, ปรับแต่งคำใน README และจัด layout ส่วนต่าง ๆ ให้ดูดี เหมาะกับส่งงานจริง |

❝ You don’t know what you don’t know ❞
ถ้าไม่มีพื้นฐานเลย ก็อาจไม่รู้ด้วยซ้ำว่าเราควรให้ AI ช่วยอะไร —
เพราะแบบนั้น ผมจึงพยายามฝึกฝนพื้นฐานก่อน แล้วจึงใช้ AI เป็นเครื่องมือเสริม
ไม่ใช่ใช้แทนทุกอย่างครับ


## 📦 คุณสมบัติหลัก
- **REST API 4 Endpoint**:
  - `POST /api/subscribe`: ลงทะเบียน URL เพื่อรับ Webhook
  - `POST /api/unsubscribe`: ยกเลิกการรับ Webhook
  - `POST /api/provide_data`: บันทึกข้อความลงฐานข้อมูล
  - `POST /api/ask`: ดึงข้อความและส่งไปยัง Subscriber ทุกคนผ่าน Webhook
- **แคช**: ใช้ Redis ด้วยระยะเวลาแคช 1 วินาที
- **ความปลอดภัย**: JWT signing สำหรับ Webhook ของแต่ละ Subscriber
- **Webhook Receiver**: ตรวจสอบ JWT และบันทึกข้อความที่ได้รับ
- **Frontend UI**: อินเทอร์เฟซสำหรับทดสอบ Endpoint และดูประวัติ Webhook

## 🔧 เทคโนโลยีที่ใช้
- **Node.js**: สภาพแวดล้อมรันไทม์
- **TypeScript**: ภาษาโปรแกรมหลัก
- **Fastify**: เฟรมเวิร์ก HTTP Server
- **MySQL / MariaDB**: ฐานข้อมูลหลัก
- **Redis**: เซิร์ฟเวอร์แคช
- **JWT**: การเซ็นข้อความด้วยโทเค็น
- **Axios**: ไคลเอนต์ HTTP สำหรับ Frontend
- **Tailwind CSS + DaisyUI**: การออกแบบ UI

## 🗂️ โครงสร้างโปรเจกต์
```
API/
├── src/
│   ├── app.ts                        # จุดเริ่มต้นของ Fastify
│   ├── config/
│   │   └── config.ts                 # การกำหนดตัวแปรสภาพแวดล้อม
│   ├── controller/
│   │   ├── ask.controller.ts         # ตัวควบคุมสำหรับ Endpoint Ask
│   │   ├── provideData.controller.ts # ตัวควบคุมสำหรับ Endpoint Provide Data
│   │   ├── subscribe.controller.ts   # ตัวควบคุมสำหรับ Endpoint Subscribe
│   │   └── unsubscribe.controller.ts # ตัวควบคุมสำหรับ Endpoint Unsubscribe
│   ├── db/
│   │   ├── init-db.ts                # สคริปต์เริ่มต้น Schema ฐานข้อมูล
│   │   ├── mysql.ts                  # การเชื่อมต่อ MySQL แบบ Connection Pool
│   │   └── redis.ts                  # ไคลเอนต์ Redis
│   ├── routes/
│   │   ├── ask.routes.ts             # เส้นทางสำหรับ Endpoint Ask
│   │   ├── provideData.routes.ts     # เส้นทางสำหรับ Endpoint Provide Data
│   │   ├── receiver/
│   │   │   └── receive.route.ts      # เส้นทางสำหรับ Webhook Receiver
│   │   ├── subscribe.routes.ts       # เส้นทางสำหรับ Endpoint Subscribe
│   │   └── unsubscribe.routes.ts     # เส้นทางสำหรับ Endpoint Unsubscribe
│   ├── services/
│   │   ├── provideData.service.ts    # ตรรกะสำหรับ Provide Data
│   │   ├── subscribe.service.ts      # ตรรกะสำหรับ Subscribe
│   │   ├── unsubscribe.service.ts    # ตรรกะสำหรับ Unsubscribe
│   │   └── webhook/
│   │       ├── data.service.ts       # ตรรกะการจัดการข้อมูล
│   │       ├── redis.service.ts      # ตรรกะการจัดการแคช Redis
│   │       └── webhook.service.ts    # ตรรกะการส่ง Webhook
│   ├── test/
│   │   └── subscribe.controller.test.ts # การทดสอบสำหรับ Subscribe Controller
│   └── webhookServer.ts              # เซิร์ฟเวอร์สำหรับ Webhook Receiver
├── .env                              # ไฟล์กำหนดตัวแปรสภาพแวดล้อม
├── .gitignore                        # ไฟล์กำหนดไฟล์/โฟลเดอร์ที่ Git จะ忽略
├── docker-compose.yml                # การกำหนด Docker Services
├── package.json                      # การกำหนด Dependencies และ Scripts
└── tsconfig.json                     # การกำหนดค่า TypeScript
```

## 🛠️ การติดตั้งและเริ่มต้น
1. **ติดตั้ง Dependencies และเริ่ม Docker**:
   ```bash
   npm install
 
   ```

2. **สร้างไฟล์ `.env` (ตัวอย่าง)**:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=pubsub_db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
3. **ติดตั้ง เริ่ม Docker**:
   ```bash
   
   docker-compose up -d  # ตรวจสอบว่า Docker พร้อมใช้งาน
   ```

4. **สร้าง Schema ฐานข้อมูลเริ่มต้น**:
   ```bash
   npm run init-db  # รันสคริปต์จาก package.json: "ts-node src/db/init-db.ts"
   ```

5. **เริ่ม Backend Server**:
   ```bash
   npm run dev
   ```

6. **เริ่ม Webhook Receiver Server**:
   ```bash
   npm run dev:webhook
   ```

   ![diagram-export-23-6-2568-11_25_22](https://github.com/user-attachments/assets/c10ca72a-a1f5-45ef-9ea1-d8baa27ca5f8)


## 🌐 API Endpoints
### `POST /api/subscribe`
**Request Body**:
```json
{
  "url": "http://localhost:8000/receive"
}
```
**Response**:
```json
{
  "status": "ok",
  "data": {
    "sub_id": 1,
    "secret": "abc"
  }
}
```

### `POST /api/unsubscribe`
**Request Body**:
```json
{
  "sub_id": 1
}
```
**Response**:
```json
{
  "status": "ok"
}
```

### `POST /api/provide_data`
**Request Body**:
```json
{
  "message": "Hello World!"
}
```
**Response**:
```json
{
  "status": "ok"
}
```

### `POST /api/ask`
**Request Body**:
```json
{
  "tx_id": 1
}
```
**Response**:
```json
{
  "status": "ok",
  "data": {
    "message": "Hello World!",
    "timestamp": "2025-04-05T12:34:56Z"
  }
}
```
![Screenshot 2025-06-23 114829](https://github.com/user-attachments/assets/9784f34a-9100-4d43-a63b-97f1a5c344dc)
![หกด](https://github.com/user-attachments/assets/bd5751ca-84f5-42a1-883b-285c0fadc1e8)


## 📬 Webhook Receiver
- **Endpoint**: `POST /receive`
- **ฟังก์ชัน**: รับ Webhook จาก Backend, ตรวจสอบ JWT และบันทึกข้อความ
- **หน้า Frontend**: เข้าไปที่ `/receive` ในเบราว์เซอร์เพื่อดูประวัติข้อความที่ได้รับ (อัปเดตทุก 2 วินาทีด้วย Polling)

## 🖥️ Frontend UI
- **หน้าหลัก**:
  - ฟอร์มสำหรับใช้งานทั้ง 4 Endpoint
  - แสดงผลลัพธ์ในรูปแบบ JSON
  

5. **เริ่ม Frontend  Server**:
   ```bash
   cd front-end
   npm run dev
   ```
