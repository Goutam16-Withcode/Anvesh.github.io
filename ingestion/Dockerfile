FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt* ./
RUN pip install --no-cache-dir \
    pydantic==2.14.4 \
    requests==2.34.2 \
    numpy==2.2.6 \
    python-dateutil==2.9.0.post0

COPY . /app

CMD ["python", "-m", "ingestion.pipelines.scheduler", "--interval-hours", "6.0", "--limit", "50"]
