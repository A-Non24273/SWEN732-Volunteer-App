FROM python:3.10

WORKDIR /app

COPY backend/ ./backend/

RUN pip install -r backend/requirements.txt || true

EXPOSE 5000

CMD ["python", "backend/app.py"]