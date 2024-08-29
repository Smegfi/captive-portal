from app import create_app
from config import Config
from argparse import ArgumentParser

port = None

if __name__ == '__main__':
    parser = ArgumentParser(description="Captive portal python")
    parser.add_argument('--port', type=int, help='Port')
    args = parser.parse_args()

    if str(Config.ENV) == "dev" and port == None:
        if args.port == None:
            port = input("Set port: ")
            app = create_app()
            app.run(debug=True, port=port)
        else:
            port = args.port
            app = create_app()
            app.run(debug=True, port=port)
    elif str(Config.ENV) == "prod":
        app = create_app()
        app.run(debug=False, port=Config.PORT)