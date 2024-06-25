# Python WEB application for captive portal
FROM python:3-alpine

WORKDIR /app

COPY src/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/. .

EXPOSE 5000

ENV RUN=Debug

ENTRYPOINT [ "python" ]
CMD ["main.py"]
