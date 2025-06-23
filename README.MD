# ระบบ Pub/Sub to Webhook Service

ระบบ Pub/Sub (Publisher/Subscriber) แบบเรียลไทม์ที่ส่งข้อมูลผ่าน Webhook พร้อมการใช้ JWT signing เพื่อความปลอดภัย เหมาะสำหรับการทดสอบทักษะนักพัฒนา Backend

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
   docker-compose up -d  # ตรวจสอบว่า Docker พร้อมใช้งาน
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

3. **สร้าง Schema ฐานข้อมูลเริ่มต้น**:
   ```bash
   npm run init-db  # รันสคริปต์จาก package.json: "ts-node src/db/init-db.ts"
   ```

4. **เริ่ม Backend Server**:
   ```bash
   npm run dev
   ```

5. **เริ่ม Webhook Receiver Server**:
   ```bash
   npm run dev:webhook
   ```

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
