# EsraGPT

EsraGPT, kullanıcıyı tanıyan, hafızaya sahip ve ileride RAG/vektör araması desteklenebilecek bir kişisel yapay zeka asistanı prototipidir.

## Mevcut özellikler
- FastAPI tabanlı REST API
- JSON tabanlı profil sistemi
- Çalışan hafıza sistemi (ekleme, listeleme, güncelleme, silme, arama)
- Dinamik sistem prompt üretimi
- Swagger üzerinden test edilebilir endpointler
- İleride Ollama, RAG ve veritabanı desteği için genişletilebilir yapı
- 
## Proje 
<img width="1600" height="888" alt="chat1" src="https://github.com/user-attachments/assets/1594e168-6e5c-46be-9034-566da37c6576" />
<img width="1535" height="569" alt="chat5" src="https://github.com/user-attachments/assets/70184f23-3061-4417-9dca-6974bb6c63c2" />
<img width="1535" height="833" alt="chat4" src="https://github.com/user-attachments/assets/29142056-2908-4b2d-96de-1cfe393c4086" />
<img width="1542" height="944" alt="chat3" src="https://github.com/user-attachments/assets/aa4af54a-55e0-4a1e-b43b-943c5e108a16" />
<img width="1544" height="939" alt="chat2" src="https://github.com/user-attachments/assets/86fb433f-9c85-48fd-96b0-befc719f51c7" />

## Proje yapısı
```text
EsraChat/
├── app/
│   ├── api/
│   │   └── routes/
│   ├── core/
│   ├── data/
│   ├── models/
│   ├── services/
│   ├── uploads/
│   ├── vector_db/
│   └── main.py
├── prompts/
├── rag/
├── utils/
├── data/
├── logs/
├── uploads/
├── tests/
├── vector_db/
├── requirements.txt
└── README.md
```

## Kurulum
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# .env dosyasına GEMINI_API_KEY değerinizi ekleyin
uvicorn app.main:app --reload
```

## Ana endpointler
- GET /health
- POST /api/chat
- GET /api/profile
- PUT /api/profile
- POST /api/memory
- GET /api/memory
- PUT /api/memory/{memory_id}
- DELETE /api/memory/{memory_id}
- GET /api/memory/search
- GET /api/conversations

## Mimari yaklaşım
- Modüler servis katmanları
- JSON tabanlı hafıza, profil ve konuşma geçmişi yönetimi
- SOLID prensiplerine yakın bir servis tasarımı
- İleride SQLite/PostgreSQL, Ollama ve RAG altyapısına geçişe hazır yapı
