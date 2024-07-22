import app
from config import Config

if __name__ == "__main__":
    application = app.create_app()
    application.run(host="0.0.0.0", port=5005, debug=True)