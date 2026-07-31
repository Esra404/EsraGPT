# EsraGPT

EsraGPT, kullanıcıyı tanıyan, hafızaya sahip ve ileride RAG/vektör araması desteklenebilecek bir kişisel yapay zeka asistanı prototipidir.

## Mevcut özellikler
- FastAPI tabanlı REST API
- JSON tabanlı profil sistemi
- Çalışan hafıza sistemi (ekleme, listeleme, güncelleme, silme, arama)
- Dinamik sistem prompt üretimi
- Swagger üzerinden test edilebilir endpointler
- İleride Ollama, RAG ve veritabanı desteği için genişletilebilir yapı

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
