from app import create_app
from config import Config

if __name__ == '__main__':
    if str(Config.ENV) == "dev":
        debug = True
    elif str(Config.ENV) == "prod":
        debug = False

    app = create_app()
    app.run(debug=debug, host=Config.HOST, port=Config.PORT)
