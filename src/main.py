from flask import Flask, request, render_template, send_file
from setup import RunMode, checkEnvironment

app = Flask(__name__)

@app.route("/")
def main():
     email = request.args.get('email')
     marketing = request.args.get('marketing')
     data = {
          "email": email,
          "marketing": marketing
     }
     return render_template("index.html", data=data)

@app.route("/tos")
def tos():
     return render_template("tos.html")

@app.route("/APAuthentication")
def test():
     data = {
          "url": request.args.get("url"),
          "ap_ip": request.args.get("ap_ip"),
          "ap_port": request.args.get("ap_port")
     }
     return render_template("index.html", data=data)

@app.route("/tos-download")
def tosDownload():
     return send_file("static/document/TOS.docx")

if __name__ == "__main__":
     try:
          result = checkEnvironment()
          if result == RunMode.DEBUG:
               app.run(debug=True)
          elif result == RunMode.PRODUCTION:
               app.run(host="0.0.0.0", port="5000", debug=True)
     except:
          exit(1)
     finally:
          exit(0)
