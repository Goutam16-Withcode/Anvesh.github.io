# ==============================================================================
# ANVESH Python ML Microservice Dockerfile (FastAPI + LightGBM + TreeSHAP)
# ==============================================================================

FROM python:3.10-slim

WORKDIR /app

# Install native dependencies required for LightGBM OpenMP
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    fastapi>=0.111.0 \
    uvicorn[standard]>=0.30.0 \
    pydantic>=2.7.0 \
    numpy>=1.26.4 \
    scipy>=1.13.0 \
    scikit-learn>=1.5.0 \
    lightgbm>=4.3.0 \
    qdrant-client>=1.9.0

COPY ml/ ./ml/
COPY data/ ./data/

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

CMD ["uvicorn", "ml.main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]
