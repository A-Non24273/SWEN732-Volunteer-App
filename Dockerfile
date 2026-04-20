FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt || true

EXPOSE 5000

CMD ["python", "backend/app.py"]